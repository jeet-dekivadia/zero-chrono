/* filepath: /Users/revlord/Desktop/hackMIT_/zero-chrono/zero-chrono-fe/src/components/Dashboard.tsx */
"use client";

import * as React from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { KpiCard } from "./Kpicard";
import { ActivityTable } from "./ActivityTable";
import GraphCanvas from "./GraphCanvas";
import { CarbonBar } from "./CarbonBar";

export default function Dashboard() {
  const [tab, setTab] = React.useState<string>("inbox");

  return (
    <div className="flex min-h-screen medical-gradient">
      <div className="w-[280px] flex-shrink-0">
        <Sidebar current={tab} onChange={setTab} />
      </div>
      <main className="flex-1 flex flex-col">
        <Topbar />
        
        <div className="flex-1 p-8 space-y-8 max-w-7xl mx-auto w-full">
          {/* Hero Section */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-2 h-2 bg-primary rounded-full medical-pulse"></div>
              <h1 className="text-3xl font-semibold text-foreground tracking-tight">
                Zero Chrono
              </h1>
            </div>
            <p className="text-muted-foreground text-lg font-normal">
              Professional medical AI platform for clinical decision support
            </p>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            <KpiCard 
              title="Critical Alerts" 
              value={12} 
              hint="+3 from yesterday" 
              icon="⚠"
              trend="up"
            />
            <KpiCard 
              title="Active Patients" 
              value={247} 
              hint="under monitoring" 
              icon="👥"
              trend="stable"
            />
            <KpiCard 
              title="Drug Interactions" 
              value={2} 
              hint="require review" 
              icon="⚗"
              trend="down"
            />
            <KpiCard 
              title="System Health" 
              value="99.2%" 
              hint="all systems operational" 
              icon="●"
              trend="up"
            />
          </div>

          {/* Tab content */}
          <div className="glass-effect rounded-xl p-8 shadow-sm border">
            {tab === "inbox" && <InboxView />}
            {tab === "tasks" && <TasksView />}
            {tab === "patient" && <PatientView />}
            {tab === "graph" && <GraphView />}
            {tab === "carbon" && <CarbonView />}
            {tab === "logs" && <LogsView />}
          </div>
        </div>
      </main>
    </div>
  );
}

/* ----- Views ----- */

function InboxView() {
  return (
    <section className="space-y-6">
      <SectionTitle 
        title="Clinical Inbox" 
        subtitle="Real-time patient data from monitoring systems"
        icon="📥"
      />
      <ActivityTable />
    </section>
  );
}

function TasksView() {
  return (
    <section className="space-y-6">
      <SectionTitle 
        title="Clinical Tasks" 
        subtitle="AI-driven decisions & scheduled interventions"
        icon="📋"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TaskCard 
          title="Medication Review Required"
          status="pending"
          priority="high"
          patient="Jonathan D."
          time="2 minutes ago"
        />
        <TaskCard 
          title="Lab Results Analysis"
          status="in-progress"
          priority="medium"
          patient="Sarah M."
          time="5 minutes ago"
        />
        <TaskCard 
          title="Drug Interaction Assessment"
          status="completed"
          priority="low"
          patient="Michael R."
          time="15 minutes ago"
        />
        <TaskCard 
          title="Allergy Profile Update"
          status="pending"
          priority="high"
          patient="Emma L."
          time="1 minute ago"
        />
      </div>
    </section>
  );
}

function PatientView() {
  return (
    <section className="space-y-6">
      <SectionTitle 
        title="Patient Overview" 
        subtitle="Comprehensive medical profile and current status"
        icon="🏥"
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <PatientCard 
          title="Patient Profile"
          content={
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center border">
                  <span className="text-xl">👤</span>
                </div>
                <div>
                  <div className="font-semibold text-lg">Jonathan Smith</div>
                  <div className="text-sm text-muted-foreground">Patient ID: #JS001</div>
                </div>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Age</span>
                  <span className="font-medium">42 years</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Status</span>
                  <span className="font-medium">Active</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Last Visit</span>
                  <span className="font-medium">Sept 12, 2025</span>
                </div>
              </div>
            </div>
          }
        />
        
        <PatientCard 
          title="Current Medications"
          content={
            <div className="space-y-3">
              <MedItem name="Atorvastatin" dose="20mg" frequency="Daily" status="active" />
              <MedItem name="Metformin" dose="500mg" frequency="Twice daily" status="active" />
              <MedItem name="Lisinopril" dose="10mg" frequency="Daily" status="active" />
            </div>
          }
        />
        
        <PatientCard 
          title="Conditions & Allergies"
          content={
            <div className="space-y-3">
              <ConditionItem name="Type 2 Diabetes" severity="Well controlled" />
              <ConditionItem name="Hypertension" severity="Stable" />
              <AllergyItem name="Penicillin" reaction="Skin rash" severity="Moderate" />
            </div>
          }
        />
      </div>
    </section>
  );
}

function GraphView() {
  return (
    <section className="space-y-6">
      <SectionTitle 
        title="Knowledge Graph" 
        subtitle="Interactive visualization of drug interactions and clinical relationships"
        icon="🕸"
      />
      <GraphCanvas />
    </section>
  );
}

function CarbonView() {
  return (
    <section className="space-y-6">
      <SectionTitle 
        title="System Analytics" 
        subtitle="Performance metrics and operational statistics"
        icon="📊"
      />
      <CarbonBar />
    </section>
  );
}

function LogsView() {
  return (
    <section className="space-y-6">
      <SectionTitle 
        title="System Logs" 
        subtitle="Real-time events and system diagnostics"
        icon="📝"
      />
      <div className="space-y-3">
        <LogEntry 
          timestamp="14:32:15"
          level="info"
          message="Patient vitals received from monitoring system"
          source="watch-service"
        />
        <LogEntry 
          timestamp="14:31:48"
          level="warning"
          message="Drug interaction detected: Atorvastatin + Warfarin"
          source="interaction-engine"
        />
        <LogEntry 
          timestamp="14:30:22"
          level="info"
          message="Clinical guidelines updated successfully"
          source="knowledge-base"
        />
        <LogEntry 
          timestamp="14:29:55"
          level="error"
          message="Failed to sync patient data - retry scheduled"
          source="data-sync"
        />
      </div>
    </section>
  );
}

/* ----- Helper Components ----- */

function SectionTitle({ title, subtitle, icon }: { 
  title: string; 
  subtitle?: string; 
  icon?: string;
}) {
  return (
    <div className="flex items-start gap-4">
      {icon && (
        <div className="text-2xl mt-1">{icon}</div>
      )}
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h2>
        {subtitle && (
          <p className="text-muted-foreground mt-1 text-base">{subtitle}</p>
        )}
      </div>
    </div>
  );
}

function TaskCard({ title, status, priority, patient, time }: {
  title: string;
  status: "pending" | "in-progress" | "completed";
  priority: "low" | "medium" | "high";
  patient: string;
  time: string;
}) {
  return (
    <div className="bg-card border border-border rounded-xl p-6 space-y-4 hover:shadow-md transition-all duration-200 hover:border-primary/20">
      <div className="flex items-start justify-between">
        <h3 className="font-semibold text-card-foreground text-base">{title}</h3>
        <span className={`px-3 py-1 rounded-full text-xs font-medium border priority-${priority}`}>
          {priority.toUpperCase()}
        </span>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Patient:</span>
          <span className="text-card-foreground font-medium">{patient}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Updated:</span>
          <span className="text-card-foreground">{time}</span>
        </div>
      </div>
      
      <div className="flex justify-end">
        <span className={`px-3 py-1 rounded-full text-xs font-medium border status-${status}`}>
          {status.replace("-", " ").toUpperCase()}
        </span>
      </div>
    </div>
  );
}

function PatientCard({ title, content }: { title: string; content: React.ReactNode }) {
  return (
    <div className="bg-card border border-border rounded-xl p-6 space-y-4 hover:shadow-md transition-all duration-200">
      <h3 className="font-semibold text-card-foreground border-b border-border pb-3 text-lg">
        {title}
      </h3>
      {content}
    </div>
  );
}

function MedItem({ name, dose, frequency, status }: {
  name: string;
  dose: string;
  frequency: string;
  status: "active" | "discontinued";
}) {
  return (
    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border/50">
      <div>
        <div className="font-medium text-sm">{name}</div>
        <div className="text-xs text-muted-foreground">{dose} • {frequency}</div>
      </div>
      <span className={`px-2 py-1 rounded-full text-xs font-medium border tag-${status}`}>
        {status.toUpperCase()}
      </span>
    </div>
  );
}

function ConditionItem({ name, severity }: { name: string; severity: string }) {
  return (
    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border/50">
      <div className="font-medium text-sm">{name}</div>
      <span className="px-2 py-1 tag-condition border rounded-full text-xs font-medium">
        {severity.toUpperCase()}
      </span>
    </div>
  );
}

function AllergyItem({ name, reaction, severity }: { 
  name: string; 
  reaction: string; 
  severity: string;
}) {
  return (
    <div className="p-4 bg-muted border border-border rounded-lg">
      <div className="flex items-center justify-between">
        <div className="font-medium text-sm">{name}</div>
        <span className="px-2 py-1 tag-allergy border rounded-full text-xs font-medium">
          {severity.toUpperCase()}
        </span>
      </div>
      <div className="text-xs text-muted-foreground mt-1">{reaction}</div>
    </div>
  );
}

function LogEntry({ timestamp, level, message, source }: {
  timestamp: string;
  level: "info" | "warning" | "error";
  message: string;
  source: string;
}) {
  return (
    <div className="bg-card border border-border rounded-lg p-4 space-y-3 hover:shadow-sm transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground font-mono tabular-nums">{timestamp}</span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium border log-${level}`}>
            {level.toUpperCase()}
          </span>
        </div>
        <span className="text-xs text-muted-foreground font-mono">{source}</span>
      </div>
      <p className="text-sm text-card-foreground leading-relaxed">{message}</p>
    </div>
  );
}