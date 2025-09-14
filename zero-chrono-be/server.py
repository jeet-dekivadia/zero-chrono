import os
import re
import json
import sys
from typing import Dict, Any, Tuple

from flask import Flask, request, jsonify, make_response

# Ensure we can import sibling lm_test.py regardless of package name
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
if CURRENT_DIR not in sys.path:
    sys.path.append(CURRENT_DIR)
import lm_test  # type: ignore


def create_main_app() -> Flask:
    app = Flask(__name__)

    # --- Simple CORS ---
    @app.after_request
    def add_cors_headers(response):  # type: ignore[override]
        response.headers["Access-Control-Allow-Origin"] = os.getenv("CORS_ALLOW_ORIGIN", "*")
        response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
        response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
        return response

    @app.route("/health", methods=["GET"])  # liveness
    def health() -> Tuple[Any, int]:
        return jsonify({"status": "ok"}), 200

    @app.route("/generate", methods=["POST", "OPTIONS"])  # proxy to LM Studio generator
    def generate() -> Tuple[Any, int]:
        if request.method == "OPTIONS":
            return make_response(("", 204))

        data = request.get_json(silent=True) or {}
        prompt_text = data.get("prompt")
        if not prompt_text:
            return jsonify({"error": "Missing 'prompt' in JSON body."}), 400

        # Optional lightweight CSV context passthrough (same keys as lm_test)
        csv_content = data.get("csv_content")
        csv_delimiter = data.get("csv_delimiter", ",")
        csv_max_rows = int(data.get("csv_max_rows", 1000))
        rag_columns = data.get("rag_columns", "*")
        rag_max_chars = int(data.get("rag_max_chars", 4000))

        csv_context = None
        try:
            if csv_content:
                csv_context = lm_test._build_csv_context_from_text(
                    csv_text=csv_content,
                    delimiter=csv_delimiter,
                    csv_max_rows=csv_max_rows,
                    rag_columns=rag_columns,
                    rag_max_chars=rag_max_chars,
                )
        except Exception as exc:  # pragma: no cover
            return jsonify({"error": f"Failed to process CSV content: {exc}"}), 400

        user_content = f"{csv_context}{prompt_text}" if csv_context else prompt_text

        base_url = os.getenv("LMSTUDIO_BASE_URL", "http://localhost:1234/v1")
        api_key = os.getenv("LMSTUDIO_API_KEY", "lm-studio")
        model = os.getenv("LMSTUDIO_MODEL")
        temperature = float(os.getenv("LMSTUDIO_TEMPERATURE", "0.7"))
        max_tokens = int(os.getenv("LMSTUDIO_MAX_TOKENS", "4096"))

        try:
            content, model_used = lm_test._generate_completion(
                prompt_text=user_content,
                base_url=base_url,
                api_key=api_key,
                model=model,
                temperature=temperature,
                max_tokens=max_tokens,
            )
        except Exception as exc:  # pragma: no cover
            return jsonify({"error": str(exc)}), 500

        return jsonify({"content": content, "model": model_used}), 200

    # --- Graph endpoint ---
    def _slugify(text: str) -> str:
        text = text.strip().lower()
        text = re.sub(r"[^a-z0-9]+", "-", text)
        return text.strip("-")

    def _node_type_from(source_type: str) -> str:
        t = (source_type or "").strip().lower()
        if t in ("diagnosis", "condition"):  # normalize
            return "Condition"
        if t in ("test", "test results", "lab", "labtest"):
            return "LabTest"
        if t in ("medication", "drug"):
            return "Drug"
        return "Guideline"

    def _edge_type_from(src_type: str, tgt_type: str) -> str:
        src = _node_type_from(src_type)
        tgt = _node_type_from(tgt_type)
        if src == "Condition" and tgt == "LabTest":
            return "has_lab"
        if src == "Condition" and tgt == "Drug":
            return "prescribed"
        if src == "LabTest" and tgt == "Drug":
            return "prescribed"
        if src == "Drug" and tgt == "Drug":
            return "interacts_with"
        if src == "Patient" and tgt == "Appointment":
            return "has_appointment"
        # Fallback generic relation
        return "guideline"

    # --- Auto-build graph.json when missing ---
    def _read_text(path: str) -> str:
        with open(path, "r", encoding="utf-8") as f:
            return f.read()

    def _safe_json_loads(text: str):
        try:
            return json.loads(text)
        except Exception:
            # Best-effort: extract first JSON object/array substring
            m = re.search(r"\{[\s\S]*\}", text)
            if m:
                try:
                    return json.loads(m.group(0))
                except Exception:
                    pass
            m = re.search(r"\[[\s\S]*\]", text)
            if m:
                try:
                    return json.loads(m.group(0))
                except Exception:
                    pass
            raise

    def _gen_completion(prompt_text: str) -> Tuple[str, str]:
        base_url = os.getenv("LMSTUDIO_BASE_URL", "http://localhost:1234/v1")
        api_key = os.getenv("LMSTUDIO_API_KEY", "lm-studio")
        model = os.getenv("LMSTUDIO_MODEL")
        temperature = float(os.getenv("LMSTUDIO_TEMPERATURE", "0.7"))
        max_tokens = int(os.getenv("LMSTUDIO_MAX_TOKENS", "4096"))
        return lm_test._generate_completion(
            prompt_text=prompt_text,
            base_url=base_url,
            api_key=api_key,
            model=model,
            temperature=temperature,
            max_tokens=max_tokens,
        )

    def _csv_context(csv_path: str) -> str:
        return lm_test._build_csv_context_from_file(
            file_path=csv_path,
            delimiter=",",
            csv_max_rows=1000,
            rag_columns="*",
            rag_max_chars=4000,
        )

    def _ensure_nodes_from_csv(csv_path: str, prompt_path: str, out_json_path: str) -> list:
        if not os.path.exists(csv_path):
            return []
        prompt_text = _read_text(prompt_path)
        context = _csv_context(csv_path)
        content, _ = _gen_completion(f"{context}{prompt_text}")
        data = _safe_json_loads(content)
        if isinstance(data, dict) and "Nodes" in data:
            nodes = data.get("Nodes") or []
        else:
            nodes = data if isinstance(data, list) else []
        # Normalize minimal fields
        norm_nodes = []
        for n in nodes:
            if not isinstance(n, dict):
                continue
            title = str(n.get("title") or "").strip()
            body = str(n.get("body") or "").strip()
            tags = str(n.get("tags") or "").strip()
            if not title:
                continue
            norm_nodes.append({"title": title, "body": body, "tags": tags})
        with open(out_json_path, "w", encoding="utf-8") as f:
            json.dump(norm_nodes, f, indent=2, ensure_ascii=False)
        return norm_nodes

    def _load_nodes(path: str) -> list:
        if not os.path.exists(path):
            return []
        with open(path, "r", encoding="utf-8") as f:
            try:
                return json.load(f)
            except Exception:
                return []

    def _generate_links_from_nodes(diag_nodes: list, lab_nodes: list, med_nodes: list, linker_prompt_path: str) -> list:
        linker_tmpl = _read_text(linker_prompt_path)
        prompt_filled = (
            linker_tmpl
            .replace("<PATIENT_DIAGNOSES>", json.dumps(diag_nodes, ensure_ascii=False, indent=2))
            .replace("<PATIENT_LABS>", json.dumps(lab_nodes, ensure_ascii=False, indent=2))
            .replace("<PATIENT_MEDICATIONS>", json.dumps(med_nodes, ensure_ascii=False, indent=2))
        )
        content, _ = _gen_completion(prompt_filled)
        data = _safe_json_loads(content)
        links = data.get("Links") if isinstance(data, dict) else []
        if not isinstance(links, list):
            links = []
        # Normalize minimal link fields
        norm_links = []
        for l in links:
            if not isinstance(l, dict):
                continue
            src = str(l.get("source") or "").strip()
            tgt = str(l.get("target") or "").strip()
            if not src or not tgt:
                continue
            norm_links.append({
                "source": src,
                "source_type": str(l.get("source_type") or "").strip(),
                "target": tgt,
                "target_type": str(l.get("target_type") or "").strip(),
                "description": str(l.get("description") or "").strip(),
            })
        return norm_links

    def _autobuild_graph(repo_root: str) -> Dict[str, Any]:
        # Paths
        this_dir = os.path.dirname(os.path.abspath(__file__))
        prompts_dir = os.path.join(this_dir, "prompts")
        diag_csv = os.path.join(repo_root, "diagnoses.csv")
        lab_csv = os.path.join(repo_root, "labs.csv")
        med_csv = os.path.join(repo_root, "medications.csv")
        diag_prompt = os.path.join(prompts_dir, "diagnosis_summary.txt")
        lab_prompt = os.path.join(prompts_dir, "lab_summary_prompt.txt")
        med_prompt = os.path.join(prompts_dir, "drug_summary_prompt.txt")
        linker_prompt = os.path.join(prompts_dir, "linker_prompt.txt")
        diag_json = os.path.join(repo_root, "diagnoses.json")
        lab_json = os.path.join(repo_root, "labs.json")
        med_json = os.path.join(repo_root, "medications.json")

        # 1) Generate nodes and save to JSON files
        diag_nodes = _ensure_nodes_from_csv(diag_csv, diag_prompt, diag_json)
        lab_nodes = _ensure_nodes_from_csv(lab_csv, lab_prompt, lab_json)
        med_nodes = _ensure_nodes_from_csv(med_csv, med_prompt, med_json)

        # If any are empty (e.g., model or file issues), try loading existing
        if not diag_nodes:
            diag_nodes = _load_nodes(diag_json) or _load_nodes(os.path.join(repo_root, "diagnosis.json"))
        if not lab_nodes:
            lab_nodes = _load_nodes(lab_json)
        if not med_nodes:
            med_nodes = _load_nodes(med_json)

        # 2) Generate links via linker prompt
        links = _generate_links_from_nodes(diag_nodes, lab_nodes, med_nodes, linker_prompt)

        # 3) Combine
        all_nodes = list(diag_nodes) + list(lab_nodes) + list(med_nodes)
        graph_obj = {"Nodes": all_nodes, "Links": links}

        # 4) Save graph.json
        graph_path = os.path.join(repo_root, "graph.json")
        with open(graph_path, "w", encoding="utf-8") as f:
            json.dump(graph_obj, f, indent=2, ensure_ascii=False)

        return graph_obj

    @app.route("/graph", methods=["GET"])  # returns GraphCanvas GraphData
    def graph() -> Tuple[Any, int]:
        # Resolve path to project root and graph.json
        this_dir = os.path.dirname(os.path.abspath(__file__))
        repo_root = os.path.abspath(os.path.join(this_dir, os.pardir, os.pardir))
        graph_path = os.path.join(repo_root, "graph.json")

        # If graph.json is missing, auto-build it using prompts + CSVs
        data = None
        if not os.path.exists(graph_path):
            try:
                data = _autobuild_graph(repo_root)
            except Exception as exc:
                # Fall back to empty graph if generation fails
                return jsonify({"nodes": [], "edges": [], "error": f"graph build failed: {exc}"}), 200

        if data is None:
            with open(graph_path, "r", encoding="utf-8") as f:
                data = json.load(f)

        links = data.get("Links", []) or []

        nodes_map: Dict[str, Dict[str, Any]] = {}
        edges_list = []

        for idx, link in enumerate(links):
            src_label = str(link.get("source", "")).strip()
            src_type_raw = str(link.get("source_type", "")).strip()
            tgt_label = str(link.get("target", "")).strip()
            tgt_type_raw = str(link.get("target_type", "")).strip()

            if not src_label or not tgt_label:
                continue

            src_type = _node_type_from(src_type_raw)
            tgt_type = _node_type_from(tgt_type_raw)

            src_id = f"{src_type.lower()}:{_slugify(src_label)}"
            tgt_id = f"{tgt_type.lower()}:{_slugify(tgt_label)}"

            if src_id not in nodes_map:
                nodes_map[src_id] = {"id": src_id, "type": src_type, "label": src_label}
            if tgt_id not in nodes_map:
                nodes_map[tgt_id] = {"id": tgt_id, "type": tgt_type, "label": tgt_label}

            edge_type = _edge_type_from(src_type_raw, tgt_type_raw)
            edges_list.append(
                {
                    "id": f"edge-{idx}",
                    "source": src_id,
                    "target": tgt_id,
                    "type": edge_type,
                    "confidence": 0.8,
                }
            )

        graph_payload = {"nodes": list(nodes_map.values()), "edges": edges_list}
        return jsonify(graph_payload), 200

    return app


if __name__ == "__main__":
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", "5001"))
    app = create_main_app()
    app.run(host=host, port=port)


