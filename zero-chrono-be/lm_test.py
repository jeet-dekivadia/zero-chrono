import argparse
import csv
import os
import re
import sys
import io
from typing import List, Optional, Sequence, Tuple

from openai import OpenAI
from flask import Flask, request, jsonify


def read_text_file(file_path: str) -> str:
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"Prompt file not found: {file_path}")
    with open(file_path, "r", encoding="utf-8") as f:
        return f.read().strip()


def resolve_model(client: OpenAI, explicit_model: Optional[str]) -> str:
    if explicit_model:
        return explicit_model

    env_model = os.getenv("LMSTUDIO_MODEL")
    if env_model:
        return env_model

    # Best-effort auto-detect of the first available model
    try:
        models = client.models.list()
        if getattr(models, "data", None):
            return models.data[0].id
    except Exception:
        pass

    raise RuntimeError(
        "No model specified and unable to auto-detect. "
        "Pass --model, or set LMSTUDIO_MODEL."
    )


def _split_words(text: str) -> List[str]:
    """Tokenize text into lowercase "words" (alnum sequences)."""
    if not text:
        return []
    return re.findall(r"[A-Za-z0-9_]+", text.lower())


def _load_csv_head_rows(
    file_path: str,
    delimiter: str,
    max_rows: int,
) -> Tuple[List[str], List[List[str]]]:
    """Load CSV header and up to max_rows rows."""
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"CSV file not found: {file_path}")

    header: List[str] = []
    rows: List[List[str]] = []
    with open(file_path, "r", encoding="utf-8", newline="") as f:
        reader = csv.reader(f, delimiter=delimiter)
        for idx, row in enumerate(reader):
            if idx == 0:
                header = [col.strip() for col in row]
                continue
            rows.append([cell.strip() for cell in row])
            if len(rows) >= max_rows:
                break
    return header, rows


def _load_csv_head_rows_from_text(
    csv_text: str,
    delimiter: str,
    max_rows: int,
) -> Tuple[List[str], List[List[str]]]:
    """Load CSV header and up to max_rows rows from a text string."""
    if csv_text is None:
        raise ValueError("CSV text is None")

    header: List[str] = []
    rows: List[List[str]] = []
    with io.StringIO(csv_text) as f:
        reader = csv.reader(f, delimiter=delimiter)
        for idx, row in enumerate(reader):
            if idx == 0:
                header = [col.strip() for col in row]
                continue
            rows.append([cell.strip() for cell in row])
            if len(rows) >= max_rows:
                break
    return header, rows


def _select_column_indices(header: Sequence[str], columns_arg: Optional[str]) -> List[int]:
    """Return column indices to consider for retrieval."""
    if not header:
        return []
    if not columns_arg or columns_arg.strip() == "*":
        return list(range(len(header)))

    requested = [c.strip().lower() for c in columns_arg.split(",") if c.strip()]
    indices: List[int] = []
    header_lc = [h.lower() for h in header]
    for name in requested:
        if name.isdigit():
            idx = int(name)
            if 0 <= idx < len(header):
                indices.append(idx)
            continue
        # match by name (case-insensitive)
        if name in header_lc:
            indices.append(header_lc.index(name))
    # de-duplicate while preserving order
    seen = set()
    unique_indices: List[int] = []
    for i in indices:
        if i not in seen:
            seen.add(i)
            unique_indices.append(i)
    return unique_indices if unique_indices else list(range(len(header)))


def _score_row_by_overlap(row_text: str, prompt_words: Sequence[str]) -> int:
    if not row_text:
        return 0
    row_words = set(_split_words(row_text))
    if not row_words:
        return 0
    return sum(1 for w in prompt_words if w in row_words)


def _build_row_text(row: Sequence[str], col_indices: Sequence[int]) -> str:
    if not col_indices:
        return " | ".join(str(c) for c in row)
    return " | ".join(str(row[i]) if i < len(row) else "" for i in col_indices)


def _rank_top_k_rows(
    header: Sequence[str],
    rows: Sequence[Sequence[str]],
    prompt_text: str,
    col_indices: Sequence[int],
    top_k: int,
) -> List[Tuple[int, int]]:
    """Return list of (row_index, score) sorted by score desc, then row_index asc."""
    prompt_words = _split_words(prompt_text)
    scored: List[Tuple[int, int]] = []
    for idx, row in enumerate(rows):
        text = _build_row_text(row, col_indices)
        score = _score_row_by_overlap(text, prompt_words)
        if score > 0:
            scored.append((idx, score))
    scored.sort(key=lambda x: (-x[1], x[0]))
    return scored[: max(1, top_k)] if scored else []


def _format_context_table(
    header: Sequence[str],
    rows: Sequence[Sequence[str]],
    selected_indices: Sequence[int],
    col_indices: Sequence[int],
    max_chars: int,
) -> str:
    """Render selected rows as a compact, model-friendly table string."""
    # Build a compact pipe table over selected columns
    selected_header = [header[i] for i in col_indices] if col_indices else list(header)
    lines: List[str] = []
    lines.append(" | ".join(selected_header))
    lines.append(" | ".join(["-" * max(3, min(20, len(h))) for h in selected_header]))
    for row_idx in selected_indices:
        row = rows[row_idx]
        line = _build_row_text(row, col_indices)
        lines.append(line)
        # Stop early if exceeding max_chars
        if sum(len(l) + 1 for l in lines) > max_chars:
            break
    table = "\n".join(lines)
    # Truncate hard if still too long
    if len(table) > max_chars:
        table = table[: max_chars - 3] + "..."
    return table


def _build_csv_context_from_components(
    header: Sequence[str],
    rows: Sequence[Sequence[str]],
    rag_columns: Optional[str],
    rag_max_chars: int,
) -> str:
    col_indices = _select_column_indices(header, rag_columns)
    selected_indices = list(range(len(rows)))
    table = _format_context_table(
        header=header,
        rows=rows,
        selected_indices=selected_indices,
        col_indices=col_indices,
        max_chars=max(500, rag_max_chars),
    )
    return (
        "You are given a CSV-derived context table.\n"
        "Use this table as authoritative context if it answers the question.\n\n"
        f"CSV Context (all {len(selected_indices)} rows):\n{table}\n\n"
    )


def _build_csv_context_from_file(
    file_path: str,
    delimiter: str,
    csv_max_rows: int,
    rag_columns: Optional[str],
    rag_max_chars: int,
) -> str:
    header, rows = _load_csv_head_rows(
        file_path=file_path,
        delimiter=delimiter,
        max_rows=max(1, csv_max_rows),
    )
    return _build_csv_context_from_components(
        header=header,
        rows=rows,
        rag_columns=rag_columns,
        rag_max_chars=rag_max_chars,
    )


def _build_csv_context_from_text(
    csv_text: str,
    delimiter: str,
    csv_max_rows: int,
    rag_columns: Optional[str],
    rag_max_chars: int,
) -> str:
    header, rows = _load_csv_head_rows_from_text(
        csv_text=csv_text,
        delimiter=delimiter,
        max_rows=max(1, csv_max_rows),
    )
    return _build_csv_context_from_components(
        header=header,
        rows=rows,
        rag_columns=rag_columns,
        rag_max_chars=rag_max_chars,
    )


def _generate_completion(
    prompt_text: str,
    base_url: str,
    api_key: str,
    model: Optional[str],
    temperature: float,
    max_tokens: int,
) -> Tuple[str, str]:
    """Returns (content, model_used). Raises on error."""
    client = OpenAI(base_url=base_url, api_key=api_key)
    model_name = resolve_model(client, model)
    # Print before querying the LM
    try:
        preview = (prompt_text or "")[:200].replace("\n", " ")
        print(
            f"[LM] Querying model={model_name} temp={temperature} max_tokens={max_tokens} "
            f"prompt_chars={len(prompt_text or '')} preview={preview}"
        )
    except Exception:
        pass
    response = client.chat.completions.create(
        model=model_name,
        messages=[{"role": "user", "content": prompt_text}],
        temperature=temperature,
        max_tokens=max_tokens,
    )
    content = getattr(response.choices[0].message, "content", None) if response and response.choices else None
    if not content:
        raise RuntimeError("No content returned.")
    return content, model_name


def create_app(
    base_url: str,
    api_key: str,
    model: Optional[str],
    temperature: float,
    max_tokens: int,
    default_csv_delimiter: str = ",",
    default_csv_max_rows: int = 1000,
    default_rag_columns: str = "*",
    default_rag_max_chars: int = 4000,
) -> Flask:
    app = Flask(__name__)

    @app.route("/health", methods=["GET"])  # simple readiness check
    def health() -> tuple:
        return jsonify({"status": "ok"}), 200

    @app.route("/generate", methods=["POST"])  # main generation endpoint
    def generate() -> tuple:
        data = request.get_json(silent=True) or {}
        prompt_text = data.get("prompt")
        if not prompt_text:
            return jsonify({"error": "Missing 'prompt' in JSON body."}), 400

        csv_content = data.get("csv_content")
        csv_delimiter = data.get("csv_delimiter", default_csv_delimiter)
        csv_max_rows = int(data.get("csv_max_rows", default_csv_max_rows))
        rag_columns = data.get("rag_columns", default_rag_columns)
        rag_max_chars = int(data.get("rag_max_chars", default_rag_max_chars))

        # Optional CSV context
        csv_context: Optional[str] = None
        try:
            if csv_content:
                csv_context = _build_csv_context_from_text(
                    csv_text=csv_content,
                    delimiter=csv_delimiter,
                    csv_max_rows=csv_max_rows,
                    rag_columns=rag_columns,
                    rag_max_chars=rag_max_chars,
                )
        except Exception as exc:
            return jsonify({"error": f"Failed to process CSV content: {exc}"}), 400

        user_content = f"{csv_context}{prompt_text}" if csv_context else prompt_text

        try:
            content, model_used = _generate_completion(
                prompt_text=user_content,
                base_url=base_url,
                api_key=api_key,
                model=model,
                temperature=temperature,
                max_tokens=max_tokens,
            )
        except Exception as exc:
            return jsonify({"error": str(exc)}), 500

        return jsonify({"content": content, "model": model_used}), 200

    return app


def main() -> int:
    parser = argparse.ArgumentParser(
        description=(
            "Read a prompt from a text file and query a local LM Studio "
            "server using the OpenAI-compatible API."
        )
    )
    parser.add_argument(
        "--serve",
        action="store_true",
        help="Run a Flask HTTP server instead of CLI mode.",
    )
    parser.add_argument(
        "--host",
        default=os.getenv("HOST", "0.0.0.0"),
        help="Server host (default: 0.0.0.0)",
    )
    parser.add_argument(
        "--port",
        type=int,
        default=int(os.getenv("PORT", "5000")),
        help="Server port (default: 5000)",
    )
    parser.add_argument(
        "--prompt-file",
        default="original_prompt.txt",
        help="Path to the prompt text file (default: prompt.txt)",
    )
    parser.add_argument(
        "--csv-file",
        default=None,
        help="Optional path to a CSV file to use for lightweight RAG.",
    )
    parser.add_argument(
        "--csv-delimiter",
        default=",",
        help="CSV delimiter (default: ',').",
    )
    parser.add_argument(
        "--csv-max-rows",
        type=int,
        default=1000,
        help="Max CSV data rows to read (default: 20000).",
    )
    parser.add_argument(
        "--rag-columns",
        default="*",
        help=(
            "Columns to consider for retrieval. Comma-separated names or indices. "
            "Use '*' for all (default)."
        ),
    )
    parser.add_argument(
        "--rag-top-k",
        type=int,
        default=1000,
        help="Number of most relevant rows to include as context (default: 5)",
    )
    parser.add_argument(
        "--rag-max-chars",
        type=int,
        default=4000,
        help="Max characters of CSV context to attach (default: 4000).",
    )
    parser.add_argument(
        "--base-url",
        default=os.getenv("LMSTUDIO_BASE_URL", "http://localhost:1234/v1"),
        help="LM Studio OpenAI-compatible base URL (default: http://localhost:1234/v1)",
    )
    parser.add_argument(
        "--api-key",
        default=os.getenv("LMSTUDIO_API_KEY", "lm-studio"),
        help="API key (default: lm-studio)",
    )
    parser.add_argument(
        "--model",
        default=os.getenv("LMSTUDIO_MODEL"),
        help="Model name/ID served by LM Studio (default: auto-detect)",
    )
    parser.add_argument(
        "--temperature",
        type=float,
        default=0.7,
        help="Sampling temperature (default: 0.7)",
    )
    parser.add_argument(
        "--max-tokens",
        type=int,
        default=4096,
        help="Max tokens in the response (default: 1024)",
    )

    args = parser.parse_args()

    # Server mode: spin up Flask app
    if args.serve:
        app = create_app(
            base_url=args.base_url,
            api_key=args.api_key,
            model=args.model,
            temperature=args.temperature,
            max_tokens=args.max_tokens,
            default_csv_delimiter=args.csv_delimiter,
            default_csv_max_rows=args.csv_max_rows,
            default_rag_columns=args.rag_columns,
            default_rag_max_chars=args.rag_max_chars,
        )
        app.run(host=args.host, port=args.port)
        return 0

    try:
        prompt_text = read_text_file(args.prompt_file)
    except Exception as exc:
        print(f"Error reading prompt file: {exc}", file=sys.stderr)
        return 1

    client = OpenAI(base_url=args.base_url, api_key=args.api_key)

    try:
        model_name = resolve_model(client, args.model)
    except Exception as exc:
        print(str(exc), file=sys.stderr)
        return 2

    # Optional: Lightweight CSV RAG
    csv_context: Optional[str] = None
    if args.csv_file:
        try:
            csv_context = _build_csv_context_from_file(
                file_path=args.csv_file,
                delimiter=args.csv_delimiter,
                csv_max_rows=args.csv_max_rows,
                rag_columns=args.rag_columns,
                rag_max_chars=args.rag_max_chars,
            )
        except Exception as exc:
            print(f"Warning: failed to process CSV for RAG: {exc}", file=sys.stderr)

    # Compose messages
    user_content = (
        f"{csv_context}{prompt_text}" if csv_context else prompt_text
    )

    try:
        content, _ = _generate_completion(
            prompt_text=user_content,
            base_url=args.base_url,
            api_key=args.api_key,
            model=args.model,
            temperature=args.temperature,
            max_tokens=args.max_tokens,
        )
    except Exception as exc:
        print(f"Error querying LM Studio: {exc}", file=sys.stderr)
        return 3

    print(content)
    with open("response.json", "w") as f:
        f.write(content)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

