"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: { value: number; direction: "up" | "down"; label: string };
  color?: "critical" | "high" | "medium" | "low" | "info" | "primary";
  className?: string;
  delay?: number;
}

const colorStyles: Record<string, { value: string; accent: string }> = {
  critical: { value: "text-red-400", accent: "bg-red-500/20" },
  high: { value: "text-orange-400", accent: "bg-orange-500/20" },
  medium: { value: "text-yellow-400", accent: "bg-yellow-500/20" },
  low: { value: "text-blue-400", accent: "bg-blue-500/20" },
  info: { value: "text-zinc-400", accent: "bg-zinc-500/20" },
  primary: { value: "text-cyan-400", accent: "bg-cyan-500/20" },
};

export function KPICard({ title, value, subtitle, icon, trend, color = "info", className, delay = 0 }: KPICardProps) {
  const colors = colorStyles[color];
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay, ease: "easeOut" }}
      className={cn(
        "card-depth card-accent card-lift rounded-xl p-5 relative overflow-hidden group",
        className
      )}
    >
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-zinc-500/15 to-transparent" />
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-[11px] text-zinc-500 font-mono tracking-wider mb-1.5">{title}</p>
          <p className={cn("text-3xl font-bold font-mono tracking-tight", colors.value)}>
            {value}
          </p>
          {subtitle && (
            <p className="text-[11px] text-zinc-600 mt-1">{subtitle}</p>
          )}
        </div>
        {icon && (
          <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-lg", colors.accent)}>
            {icon}
          </div>
        )}
      </div>
      {trend && (
        <div className="mt-3 flex items-center gap-1.5">
          <span className={cn(
            "text-xs font-mono font-semibold",
            trend.direction === "up" ? "text-red-400" : "text-emerald-400"
          )}>
            {trend.direction === "up" ? "↑" : "↓"} {trend.value}%
          </span>
          <span className="text-[10px] text-zinc-600">{trend.label}</span>
        </div>
      )}
    </motion.div>
  );
}

interface MetricRowProps {
  label: string;
  value: string | number;
  color?: string;
}

export function MetricRow({ label, value, color }: MetricRowProps) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-zinc-800/60 bg-zinc-900/40 px-3.5 py-2">
      <span className="text-xs text-zinc-500 font-mono">{label}</span>
      <span className={cn("text-sm font-bold font-mono", color || "text-zinc-100")}>{value}</span>
    </div>
  );
}
