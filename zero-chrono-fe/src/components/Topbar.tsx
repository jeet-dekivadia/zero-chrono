"use client";

import { Search, Settings, Mic } from "lucide-react";

export function Topbar() {
  return (
    <header className="sticky top-0 z-10 bg-white/70 dark:bg-zinc-900/60 backdrop-blur border-b border-zinc-200/60 dark:border-zinc-800/60">
      <div className="h-14 px-4 flex items-center gap-3">
        <div className="relative max-w-lg w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-500" />
          <input
            placeholder="Search utterances, patients, tasks…"
            className="w-full rounded-xl border border-zinc-300/60 dark:border-zinc-700/60 bg-white/70 dark:bg-zinc-900/70 pl-9 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-400/50"
          />
        </div>

        <div className="ml-auto flex items-center gap-2">
          <span className="inline-flex items-center gap-1 text-xs rounded-full border px-2 py-1 border-zinc-300/60 dark:border-zinc-700/60">
            <Mic className="size-3.5" /> Watch: <b>connected</b>
          </span>
          <button className="rounded-xl border px-3 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 border-zinc-300/60 dark:border-zinc-700/60 inline-flex items-center gap-2">
            <Settings className="size-4" /> Settings
          </button>
        </div>
      </div>
    </header>
  );
}
