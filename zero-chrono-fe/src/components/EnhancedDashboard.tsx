"use client";

import * as React from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { KpiCard } from "./Kpicard";
import { ActivityTable } from "./ActivityTable";
import GraphCanvas from "./GraphCanvas";
import { CarbonBar } from "./CarbonBar";
import BobAssistant from "./BobAssistant";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Calendar, Users, FileText, Phone, Brain, Clock, CheckCircle, AlertTriangle, Mic } from "lucide-react";

export default function EnhancedDashboard() {
  const [tab, setTab] = React.useState<string>("inbox");
  const [showBob, setShowBob] = React.useState(false);
  const [recentActivity, setRecentActivity] = React.useState<any[]>([]);

  const handleVoiceCommand = (command: any) => {
    // Add to recent activity
    setRecentActivity(prev => [command, ...prev.slice(0, 9)]);
  };

  return (
    <div className="flex min-h-screen medical-gradient">
      <div className="w-[280px] flex-shrink-0">
        <Sidebar current={tab} onChange={setTab} />
      </div>
      <main className="flex-1 flex flex-col">
        <Topbar />
        
        <div className="flex-1 p-8 space-y-8 max-w-7xl mx-auto w-full">
          {/* Hero Section with Bob Integration */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-2 h-2 bg-primary rounded-full medical-pulse"></div>
                  <h1 className="text-3xl font-semibold text-foreground tracking-tight">
                    0chrono Dashboard
                  </h1>
                </div>
                <p className="text-muted-foreground text-lg font-normal">
                  See more patients, not more pages
                </p>
              </div>
              <Button
                onClick={() => setShowBob(!showBob)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-6 py-3 text-lg"
              >
                <Mic className="h-5 w-5 mr-2" />
                {showBob ? 'Hide Bob' : 'Talk to Bob'}
              </Button>
            </div>

            {/* Bob Assistant */}
            {showBob && (
              <div className="mb-8">
                <BobAssistant
                  doctorId="doc1"
                  onCommandProcessed={handleVoiceCommand}
                />
              </div>
            )}
          </div>

          {/* Enhanced KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            <KpiCard 
              title="Patients Seen Today" 
              value={42} 
              hint="vs 38 yesterday (+10.5%)" 
              icon="👥"
              trend="up"
            />
            <KpiCard 
              title="Average Wait Time" 
              value="12 min" 
              hint="vs 18 min last week (-33%)" 
              icon="⏱️"
              trend="down"
            />
            <KpiCard 
              title="Voice Commands" 
              value={recentActivity.length || 156} 
              hint="processed by Bob today" 
              icon="🎤"
              trend="up"
            />
            <KpiCard 
              title="Insurance Claims" 
              value="94.2%" 
              hint="approval rate this month" 
              icon="📋"
              trend="up"
            />
          </div>

          {/* Tab content */}
          <div className="glass-effect rounded-xl p-8 shadow-sm border">
            {tab === "inbox" && <InboxView recentActivity={recentActivity} />}
            {tab === "tasks" && <TasksView />}
            {tab === "patient" && <PatientView />}
            {tab === "bob" && <BobView recentActivity={recentActivity} />}
            {tab === "graph" && <GraphView />}
            {tab === "carbon" && <CarbonView />}
            {tab === "logs" && <LogsView />}
          </div>
        </div>
      </main>
    </div>
  );
}

/* ----- Enhanced Views ----- */

function InboxView({ recentActivity }: { recentActivity: any[] }) {
  return (
    <section className="space-y-6">
      <SectionTitle 
        title="Clinical Inbox" 
        subtitle="Real-time patient data and Bob's recent activities"
        icon="📥"
      />
      
      {/* Recent Bob Activity */}
      {recentActivity.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-blue-600" />
              Recent Bob Activities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {recentActivity.slice(0, 5).map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge className={getActivityBadgeColor(activity.type)}>
                      {activity.type?.toUpperCase() || 'COMMAND'}
                    </Badge>
                    <span className="text-sm text-gray-700 truncate max-w-md">
                      {activity.transcript}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusIcon status={activity.status} />
                    <span className="text-xs text-gray-500">
                      {new Date(activity.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <ActivityTable />
    </section>
  );
}

function BobView({ recentActivity }: { recentActivity: any[] }) {
  return (
    <section className="space-y-6">
      <SectionTitle 
        title="Bob AI Assistant" 
        subtitle="Voice command history and management"
        icon="🤖"
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Command Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>Command Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <StatItem 
                label="Total Commands Today" 
                value={recentActivity.length} 
                icon={<Mic className="h-4 w-4" />}
              />
              <StatItem 
                label="Approved Commands" 
                value={recentActivity.filter(cmd => cmd.status === 'approved').length}
                icon={<CheckCircle className="h-4 w-4 text-green-600" />}
              />
              <StatItem 
                label="Pending Review" 
                value={recentActivity.filter(cmd => cmd.status === 'pending-review').length}
                icon={<Clock className="h-4 w-4 text-yellow-600" />}
              />
              <StatItem 
                label="Average Confidence" 
                value={`${Math.round((recentActivity.reduce((acc, cmd) => acc + (cmd.confidence || 0), 0) / Math.max(recentActivity.length, 1)) * 100)}%`}
                icon={<Brain className="h-4 w-4 text-blue-600" />}
              />
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="h-16 flex flex-col gap-1">
                <Users className="h-5 w-5" />
                <span className="text-xs">Patient List</span>
              </Button>
              <Button variant="outline" className="h-16 flex flex-col gap-1">
                <Calendar className="h-5 w-5" />
                <span className="text-xs">Schedule</span>
              </Button>
              <Button variant="outline" className="h-16 flex flex-col gap-1">
                <FileText className="h-5 w-5" />
                <span className="text-xs">OPD Summary</span>
              </Button>
              <Button variant="outline" className="h-16 flex flex-col gap-1">
                <Phone className="h-5 w-5" />
                <span className="text-xs">Emergency</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Full Command History */}
      <Card>
        <CardHeader>
          <CardTitle>Command History</CardTitle>
        </CardHeader>
        <CardContent>
          {recentActivity.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No voice commands yet. Start talking to Bob!
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {recentActivity.map((activity, index) => (
                <CommandHistoryItem key={index} command={activity} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
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
          bobGenerated={true}
        />
        <TaskCard 
          title="Lab Results Analysis"
          status="in-progress"
          priority="medium"
          patient="Sarah M."
          time="5 minutes ago"
          bobGenerated={false}
        />
        <TaskCard 
          title="Drug Interaction Assessment"
          status="completed"
          priority="low"
          patient="Michael R."
          time="15 minutes ago"
          bobGenerated={true}
        />
        <TaskCard 
          title="Insurance Claim Processing"
          status="pending"
          priority="high"
          patient="Emma L."
          time="1 minute ago"
          bobGenerated={true}
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
          message="Bob processed voice command: 'Add paracetamol for John Doe'"
          source="bob-assistant"
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
          message="Insurance claim auto-generated for patient JS001"
          source="insurance-processor"
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

function TaskCard({ title, status, priority, patient, time, bobGenerated }: {
  title: string;
  status: "pending" | "in-progress" | "completed";
  priority: "low" | "medium" | "high";
  patient: string;
  time: string;
  bobGenerated?: boolean;
}) {
  return (
    <div className="bg-card border border-border rounded-xl p-6 space-y-4 hover:shadow-md transition-all duration-200 hover:border-primary/20">
      <div className="flex items-start justify-between">
        <h3 className="font-semibold text-card-foreground text-base">{title}</h3>
        <div className="flex items-center gap-2">
          {bobGenerated && (
            <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-xs">
              BOB
            </Badge>
          )}
          <span className={`px-3 py-1 rounded-full text-xs font-medium border priority-${priority}`}>
            {priority.toUpperCase()}
          </span>
        </div>
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

function StatItem({ label, value, icon }: { label: string; value: string | number; icon: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-sm text-gray-600">{label}</span>
      </div>
      <span className="font-semibold">{value}</span>
    </div>
  );
}

function CommandHistoryItem({ command }: { command: any }) {
  return (
    <div className="bg-gray-50 rounded-lg p-4 border">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <StatusIcon status={command.status} />
          <Badge className={getActivityBadgeColor(command.type)}>
            {command.type?.toUpperCase() || 'COMMAND'}
          </Badge>
          <span className="text-xs text-gray-500">
            {command.confidence > 0 && `${Math.round(command.confidence * 100)}% confidence`}
          </span>
        </div>
        <span className="text-xs text-gray-500">
          {new Date(command.timestamp).toLocaleTimeString()}
        </span>
      </div>
      
      <div className="text-sm text-gray-700 mb-2">
        "{command.transcript}"
      </div>
      
      {command.processedAction?.summary && (
        <div className="text-sm text-blue-700 bg-blue-50 rounded p-2">
          <strong>Processed:</strong> {command.processedAction.summary}
        </div>
      )}
    </div>
  );
}

function StatusIcon({ status }: { status: string }) {
  switch (status) {
    case 'approved':
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    case 'rejected':
      return <AlertTriangle className="h-4 w-4 text-red-600" />;
    case 'pending-review':
      return <Clock className="h-4 w-4 text-yellow-600" />;
    default:
      return <Clock className="h-4 w-4 text-gray-600" />;
  }
}

function getActivityBadgeColor(type: string) {
  switch (type) {
    case 'prescription':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'diagnosis':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'schedule':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'emergency':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}
