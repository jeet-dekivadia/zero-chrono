"use client";

import * as React from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { KpiCard } from "./Kpicard";
import { ActivityTable } from "./ActivityTable";
import { GraphCanvas } from "./GraphCanvas";
import { CarbonBar } from "./CarbonBar";

export default function Dashboard() {
  const [tab, setTab] = React.useState<string>("inbox");

  return (
    <div className="grid grid-cols-[auto_1fr]">
      <Sidebar current={tab} onChange={setTab} />
      <main className="min-h-dvh">
        <Topbar />

        <div className="p-4 space-y-4">
          {/* KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <KpiCard title="Inbox (24h)" value={12} hint="+3 new" />
            <KpiCard title="Patients" value={5} hint="demo / synthetic" />
            <KpiCard title="Interaction alerts" value={2} hint="needs review" />
            <KpiCard title="CO₂ saved" value="38%" hint="via cache & local model" />
          </div>

          {/* Tab content */}
          {tab === "inbox" && <InboxView />}
          {tab === "tasks" && <TasksView />}
          {tab === "patient" && <PatientView />}
          {tab === "graph" && <GraphView />}
          {tab === "carbon" && <CarbonView />}
          {tab === "logs" && <LogsView />}
        </div>
      </main>
    </div>
  );
}

/* ----- Views ----- */

function InboxView() {
  return (
    <section className="space-y-4">
      <SectionTitle title="Inbox" subtitle="Latest utterances from Apple Watch & agents" />
      <ActivityTable />
    </section>
  );
}

function TasksView() {
  return (
    <section className="space-y-4">
      <SectionTitle title="Tasks" subtitle="Router decisions & queued actions" />
      <div className="rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 p-4 text-sm">
        Coming soon: task router queue (calendar/search/drug), retries, rollbacks.
      </div>
    </section>
  );
}

function PatientView() {
  return (
    <section className="space-y-4">
      <SectionTitle title="Patient" subtitle="Current meds, allergies, conditions (demo data)" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 p-4">
          <div className="text-sm font-medium">Profile</div>
          <div className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Select demo patient; wire to your MIMIC-IV demo dataset later.
          </div>
        </div>
        <div className="rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 p-4">
          <div className="text-sm font-medium">Medications</div>
          <ul className="mt-2 list-disc pl-5 text-sm">
            <li>Atorvastatin 20mg qd</li>
            <li>Azithromycin 250mg (recent)</li>
          </ul>
        </div>
        <div className="rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 p-4">
          <div className="text-sm font-medium">Allergies / Conditions</div>
          <ul className="mt-2 list-disc pl-5 text-sm">
            <li>Penicillin (rash)</li>
            <li>Hyperlipidemia</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

function GraphView() {
  return (
    <section className="space-y-4">
      <SectionTitle title="Knowledge Graph" subtitle="Live edges for meds ↔ conditions ↔ allergies" />
      <GraphCanvas />
    </section>
  );
}

function CarbonView() {
  return (
    <section className="space-y-4">
      <SectionTitle title="Carbon HUD" subtitle="Token/call budgets, caching & savings" />
      <CarbonBar />
    </section>
  );
}

function LogsView() {
  return (
    <section className="space-y-4">
      <SectionTitle title="Logs" subtitle="Structured events & errors" />
      <div className="rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 p-4 text-sm">
        Event logs placeholder. Stream server logs here for judges.
      </div>
    </section>
  );
}

function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div>
      <div className="text-lg font-semibold tracking-tight">{title}</div>
      {subtitle ? <div className="text-sm text-zinc-500">{subtitle}</div> : null}
    </div>
  );
}
