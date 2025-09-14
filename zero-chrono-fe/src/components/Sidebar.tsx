/* filepath: /Users/revlord/Desktop/hackMIT_/zero-chrono/zero-chrono-fe/src/components/Sidebar.tsx */
import * as React from "react";

interface SidebarProps {
  current: string;
  onChange: (tab: string) => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: string;
  badge?: number;
}

const NAV_ITEMS: NavItem[] = [
  { id: "inbox", label: "Clinical Inbox", icon: "📥", badge: 12 },
  { id: "tasks", label: "Tasks", icon: "📋", badge: 4 },
  { id: "patient", label: "Patients", icon: "🏥" },
  { id: "graph", label: "Knowledge Graph", icon: "🕸" },
  { id: "carbon", label: "Analytics", icon: "📊" },
  { id: "logs", label: "System Logs", icon: "📝" },
];

export function Sidebar({ current, onChange }: SidebarProps) {
  return (
    <div className="bg-sidebar border-r border-sidebar-border h-screen flex flex-col sticky top-0">
      {/* Header */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary text-primary-foreground rounded-lg flex items-center justify-center shadow-sm border border-primary">
            <span className="font-bold text-sm">ZC</span>
          </div>
          <div>
            <div className="font-semibold text-sidebar-foreground text-sm tracking-tight">Zero Chrono</div>
            <div className="text-xs text-sidebar-foreground/60">Medical AI Platform</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => onChange(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 group border ${
              current === item.id
                ? "bg-sidebar-primary text-sidebar-primary-foreground border-sidebar-primary shadow-sm"
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground border-transparent hover:border-sidebar-border"
            }`}
          >
            <span className="text-lg group-hover:scale-110 transition-transform duration-200">
              {item.icon}
            </span>
            <span className="font-medium text-sm flex-1">{item.label}</span>
            {item.badge && (
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                current === item.id
                  ? "bg-sidebar-primary-foreground/20 text-sidebar-primary-foreground border-sidebar-primary-foreground/20"
                  : "bg-sidebar-primary text-sidebar-primary-foreground border-sidebar-primary"
              }`}>
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </nav>s

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center border border-border">
            <span className="text-sm">👨‍⚕️</span>
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold text-sidebar-foreground">Dr. Sarah Chen</div>
            <div className="text-xs text-sidebar-foreground/60">Attending Physician</div>
          </div>
        </div>
      </div>
    </div>
  );
}