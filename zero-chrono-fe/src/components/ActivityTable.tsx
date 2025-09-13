"use client";

import * as React from "react";

type Row = {
  id: string;
  when: string;
  source: "watch" | "system" | "agent";
  text: string;
  routedTo?: "calendar" | "search" | "drug" | "none";
  status?: "pending" | "done" | "blocked";
};

const seed: Row[] = [
  {
    id: "1",
    when: "just now",
    source: "watch",
    text: "schedule lunch 12–1",
    routedTo: "calendar",
    status: "done",
  },
  {
    id: "2",
    when: "1m",
    source: "watch",
    text: "add Cymbalta for Jonathan",
    routedTo: "drug",
    status: "blocked",
  },
  {
    id: "3",
    when: "3m",
    source: "watch",
    text: "latest on macrolide statin risks",
    routedTo: "search",
    status: "done",
  },
];

export function ActivityTable() {
  const [rows, setRows] = React.useState<Row[]>(seed);

  // simple demo: append a fake row every 20s
  React.useEffect(() => {
    const t = setInterval(() => {
      setRows((r) => [
        {
          id: crypto.randomUUID(),
          when: "now",
          source: "agent",
          text: "cached rationale reused (green mode)",
          routedTo: "none",
          status: "done",
        },
        ...r,
      ]);
    }, 20000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60">
      <table className="w-full text-sm">
        <thead className="bg-zinc-100/60 dark:bg-zinc-800/40 text-zinc-600">
          <tr>
            <th className="text-left px-4 py-2 font-medium">When</th>
            <th className="text-left px-4 py-2 font-medium">Source</th>
            <th className="text-left px-4 py-2 font-medium">Text</th>
            <th className="text-left px-4 py-2 font-medium">Routed</th>
            <th className="text-left px-4 py-2 font-medium">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-200/60 dark:divide-zinc-800/60">
          {rows.map((r) => (
            <tr key={r.id} className="hover:bg-zinc-50/60 dark:hover:bg-zinc-900/40">
              <td className="px-4 py-2">{r.when}</td>
              <td className="px-4 py-2">{r.source}</td>
              <td className="px-4 py-2">{r.text}</td>
              <td className="px-4 py-2">{r.routedTo}</td>
              <td className="px-4 py-2">
                <span
                  className={
                    r.status === "done"
                      ? "text-emerald-600"
                      : r.status === "blocked"
                      ? "text-rose-600"
                      : "text-amber-600"
                  }
                >
                  {r.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
