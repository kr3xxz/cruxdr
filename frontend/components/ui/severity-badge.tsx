"use client";

import { cn } from "@/lib/utils";

interface SeverityBadgeProps {
  severity: string;
  size?: "sm" | "md" | "lg";
  showDot?: boolean;
  className?: string;
}

const severityConfig: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  critical: { bg: "bg-red-950/40", text: "text-red-400", border: "border-red-500/30", dot: "bg-red-500" },
  high: { bg: "bg-orange-950/40", text: "text-orange-400", border: "border-orange-500/30", dot: "bg-orange-500" },
  medium: { bg: "bg-yellow-950/40", text: "text-yellow-400", border: "border-yellow-500/30", dot: "bg-yellow-500" },
  low: { bg: "bg-blue-950/40", text: "text-blue-400", border: "border-blue-500/30", dot: "bg-blue-500" },
  info: { bg: "bg-zinc-800/40", text: "text-zinc-400", border: "border-zinc-600/30", dot: "bg-zinc-500" },
};

export const SEVERITY_ORDER = ["critical", "high", "medium", "low", "info"];

const sizeClasses = {
  sm: "px-2 py-0.5 text-[10px]",
  md: "px-2.5 py-0.5 text-xs",
  lg: "px-3 py-1 text-sm",
};

export function SeverityBadge({ severity, size = "sm", showDot = true, className }: SeverityBadgeProps) {
  const config = severityConfig[severity?.toLowerCase()] || severityConfig.medium;
  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 rounded-md border font-mono font-semibold uppercase tracking-wider",
      config.bg, config.text, config.border,
      sizeClasses[size],
      className
    )}>
      {showDot && (
        <span className={cn(
          "h-1.5 w-1.5 rounded-full",
          config.dot,
          severity === "critical" && "animate-pulse"
        )} />
      )}
      {severity}
    </span>
  );
}

export function SeverityDot({ severity, className }: { severity: string; className?: string }) {
  const colors: Record<string, string> = {
    critical: "bg-red-500",
    high: "bg-orange-500",
    medium: "bg-yellow-500",
    low: "bg-blue-500",
    info: "bg-zinc-500",
  };
  return (
    <span className={cn(
      "h-2 w-2 rounded-full",
      colors[severity?.toLowerCase()] || "bg-zinc-500",
      severity === "critical" && "animate-pulse",
      className
    )} />
  );
}

export function getSeverityColor(severity: string): string {
  const map: Record<string, string> = {
    critical: "#ef4444",
    high: "#f97316",
    medium: "#eab308",
    low: "#3b82f6",
    info: "#a1a1aa",
  };
  return map[severity?.toLowerCase()] || map.medium;
}
