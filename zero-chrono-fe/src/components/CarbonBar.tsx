export function CarbonBar({
  tokens = 1240,
  calls = 6,
  saved = 38,
}: {
  tokens?: number;
  calls?: number;
  saved?: number; // %
}) {
  return (
    <div className="rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 p-4 bg-white/70 dark:bg-zinc-900/60">
      <div className="text-sm font-medium">Carbon / Cost</div>
      <div className="mt-3 grid grid-cols-3 gap-3 text-sm">
        <div><span className="text-zinc-500">Tokens:</span> <b>{tokens.toLocaleString()}</b></div>
        <div><span className="text-zinc-500">External calls:</span> <b>{calls}</b></div>
        <div><span className="text-zinc-500">Saved via cache:</span> <b>{saved}%</b></div>
      </div>

      <div className="mt-3 h-2 rounded-full bg-zinc-200/80 dark:bg-zinc-800/80 overflow-hidden">
        <div className="h-full bg-emerald-500/80" style={{ width: `${Math.min(saved, 100)}%` }} />
      </div>

      <div className="mt-3">
        <label className="inline-flex items-center gap-2 text-sm">
          <input type="checkbox" defaultChecked className="size-4" />
          Enable Green Mode (compress prompts, reuse context, block web search for low-risk)
        </label>
      </div>
    </div>
  );
}
