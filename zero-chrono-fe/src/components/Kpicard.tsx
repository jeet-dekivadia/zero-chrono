/* filepath: /Users/revlord/Desktop/hackMIT_/zero-chrono/zero-chrono-fe/src/components/Kpicard.tsx */
import * as React from "react";

interface KpiCardProps {
  title: string;
  value: string | number;
  hint?: string;
  icon?: string;
  trend?: "up" | "down" | "stable";
}

export function KpiCard({ title, value, hint, icon, trend }: KpiCardProps) {
  const trendIcons = {
    up: "📈",
    down: "📉", 
    stable: "➖"
  };

  const trendColors = {
    up: "text-green-600 dark:text-green-400",
    down: "text-red-600 dark:text-red-400",
    stable: "text-blue-600 dark:text-blue-400"
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all duration-200 hover:-translate-y-1 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {icon && (
            <div className="text-2xl group-hover:scale-110 transition-transform duration-200">
              {icon}
            </div>
          )}
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            {title}
          </h3>
        </div>
        {trend && (
          <div className={`text-lg ${trendColors[trend]}`}>
            {trendIcons[trend]}
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <div className="text-3xl font-bold text-card-foreground group-hover:text-primary transition-colors duration-200">
          {value}
        </div>
        {hint && (
          <div className="text-sm text-muted-foreground flex items-center gap-1">
            <div className="w-2 h-2 bg-primary rounded-full opacity-60"></div>
            {hint}
          </div>
        )}
      </div>
      
      {/* Subtle background pattern */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"></div>
    </div>
  );
}