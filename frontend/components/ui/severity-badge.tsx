"use client";

import { cn } from "@/lib/utils";

interface SeverityBadgeProps {
  severity: string | number;
  size?: "sm" | "md" | "lg";
  showDot?: boolean;
  className?: string;
  animated?: boolean;
}

const severityConfig: Record<string, { bg: string; text: string; border: string; dot: string; glow: string }> = {
  critical: { bg: "bg-fuchsia-950/40", text: "text-fuchsia-400", border: "border-fuchsia-500/30", dot: "bg-fuchsia-500", glow: "shadow-fuchsia-500/10" },
  high: { bg: "bg-rose-950/40", text: "text-rose-400", border: "border-rose-500/30", dot: "bg-rose-500", glow: "shadow-rose-500/10" },
  medium: { bg: "bg-amber-950/40", text: "text-amber-400", border: "border-amber-500/30", dot: "bg-amber-500", glow: "shadow-amber-500/10" },
  low: { bg: "bg-cyan-950/40", text: "text-cyan-400", border: "border-cyan-500/30", dot: "bg-cyan-500", glow: "shadow-cyan-500/10" },
  info: { bg: "bg-zinc-800/40", text: "text-zinc-400", border: "border-zinc-600/30", dot: "bg-zinc-500", glow: "shadow-zinc-500/5" },
};

export const SEVERITY_ORDER = ["critical", "high", "medium", "low", "info"];

const sizeClasses = {
  sm: "px-2 py-0.5 text-[10px]",
  md: "px-2.5 py-0.5 text-xs",
  lg: "px-3 py-1 text-sm",
};

function normalizeSeverity(s: any): string {
  if (typeof s === "number") return s >= 70 ? "critical" : s >= 40 ? "high" : s >= 20 ? "medium" : "low";
  return (s || "medium").toString().toLowerCase();
}

export function SeverityBadge({ severity, size = "sm", showDot = true, animated, className }: SeverityBadgeProps) {
  const sev = normalizeSeverity(severity);
  const config = severityConfig[sev] || severityConfig.medium;
  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 rounded-md border font-mono font-semibold uppercase tracking-wider transition-all duration-200",
      "hover:brightness-110",
      config.bg, config.text, config.border,
      sizeClasses[size],
      animated && sev === "critical" && "severity-glow-critical",
      animated && sev === "high" && "severity-glow-high",
      className
    )}>
      {showDot && (
        <span className={cn(
          "h-1.5 w-1.5 rounded-full",
          config.dot,
          sev === "critical" && "animate-pulse"
        )} />
      )}
      {sev}
    </span>
  );
}

export function SeverityDot({ severity, className, size = "sm" }: { severity: string | number; className?: string; size?: "sm" | "md" }) {
  const sev = normalizeSeverity(severity);
  const colors: Record<string, string> = {
    critical: "bg-fuchsia-500",
    high: "bg-rose-500",
    medium: "bg-amber-500",
    low: "bg-cyan-500",
    info: "bg-zinc-500",
  };
  return (
    <span className={cn(
      "rounded-full",
      size === "md" ? "h-2.5 w-2.5" : "h-2 w-2",
      colors[sev] || "bg-zinc-500",
      sev === "critical" && "animate-pulse",
      className
    )} />
  );
}

export function getSeverityColor(severity: string | number): string {
  const sev = normalizeSeverity(severity);
  const map: Record<string, string> = {
    critical: "#d946ef",
    high: "#fb7185",
    medium: "#fbbf24",
    low: "#22d3ee",
    info: "#a1a1aa",
  };
  return map[sev] || map.medium;
}

export function SeverityPill({ severity, className }: { severity: string | number; className?: string }) {
  const sev = normalizeSeverity(severity);
  const config = severityConfig[sev] || severityConfig.medium;
  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 rounded-full border font-mono font-semibold uppercase tracking-wider text-[10px] px-2.5 py-0.5",
      config.bg, config.text, config.border,
      className
    )}>
      <span className={cn("h-1.5 w-1.5 rounded-full", config.dot)} />
      {sev}
    </span>
  );
}
