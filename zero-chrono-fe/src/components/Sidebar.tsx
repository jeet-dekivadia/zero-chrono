"use client";

import React from "react";
import { cn } from "../lib/utils";
import {
  Inbox,
  ListChecks,
  Stethoscope,
  LineChart,
  Database,
  FileText,
} from "lucide-react";

type Item = { key: string; label: string; icon: React.ComponentType<any> };

const NAV: Item[] = [
  { key: "inbox",   label: "Inbox",   icon: Inbox },
  { key: "tasks",   label: "Tasks",   icon: ListChecks },
  { key: "patient", label: "Patient", icon: Stethoscope },
  { key: "graph",   label: "Graph",   icon: LineChart },
  { key: "carbon",  label: "Carbon",  icon: Database },
  { key: "logs",    label: "Logs",    icon: FileText },
];

export function Sidebar({
  current,
  onChange,
}: {
  current: string;
  onChange: (key: string) => void;
}) {
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <aside
      className={cn(
        "h-dvh sticky top-0 border-r border-zinc-200/60 dark:border-zinc-800/60",
        "bg-white/70 dark:bg-zinc-900/60 backdrop-blur",
        collapsed ? "w-16" : "w-64",
        "transition-[width] duration-300"
      )}
    >
      <div className="flex items-center justify-between px-3 py-3">
        <div className={cn("font-semibold tracking-tight", collapsed && "sr-only")}>
          Zero&nbsp;Chrono
        </div>
        <button
          className="rounded-md px-2 py-1 text-xs hover:bg-zinc-100 dark:hover:bg-zinc-800"
          onClick={() => setCollapsed((v) => !v)}
          aria-label="Toggle sidebar"
        >
          {collapsed ? "›" : "‹"}
        </button>
      </div>

      <nav className="px-2 py-2 space-y-1">
        {NAV.map((item) => {
          const Icon = item.icon;
          const active = current === item.key;
          return (
            <button
              key={item.key}
              onClick={() => onChange(item.key)}
              className={cn(
                "w-full flex items-center gap-3 rounded-xl px-3 py-2 text-sm",
                "hover:bg-zinc-100 dark:hover:bg-zinc-800",
                active && "bg-zinc-100 dark:bg-zinc-800 font-medium"
              )}
            >
              <Icon className="size-4 shrink-0" />
              <span className={cn(collapsed && "sr-only")}>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className={cn("mt-auto p-3 text-xs text-zinc-500", collapsed && "sr-only")}>
        v0.1 • local-first
      </div>
    </aside>
  );
}
