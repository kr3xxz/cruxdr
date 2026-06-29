"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useTransform, useSpring, animate } from "framer-motion";
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

const colorStyles: Record<string, { value: string; accent: string; glow: string }> = {
  critical: { value: "text-red-400", accent: "bg-red-500/20", glow: "group-hover:shadow-red-500/5" },
  high: { value: "text-orange-400", accent: "bg-orange-500/20", glow: "group-hover:shadow-orange-500/5" },
  medium: { value: "text-yellow-400", accent: "bg-yellow-500/20", glow: "group-hover:shadow-yellow-500/5" },
  low: { value: "text-blue-400", accent: "bg-blue-500/20", glow: "group-hover:shadow-blue-500/5" },
  info: { value: "text-zinc-400", accent: "bg-zinc-500/20", glow: "group-hover:shadow-zinc-500/5" },
  primary: { value: "text-cyan-400", accent: "bg-cyan-500/20", glow: "group-hover:shadow-cyan-500/5" },
};

function AnimatedValue({ value, className }: { value: string | number; className: string }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));
  const displayValue = useSpring(rounded, { stiffness: 80, damping: 20 });

  useEffect(() => {
    const numericValue = typeof value === "number" ? value : parseInt(value as string, 10) || 0;
    const controls = animate(count, numericValue, { duration: 1.2, ease: [0.25, 0.1, 0.25, 1] });
    return controls.stop;
  }, [value]);

  return (
    <motion.p className={cn("text-3xl font-bold font-mono tracking-tight tabular-nums", className)}>
      {typeof value === "number" ? <motion.span>{displayValue}</motion.span> : value}
    </motion.p>
  );
}

export function KPICard({ title, value, subtitle, icon, trend, color = "info", className, delay = 0 }: KPICardProps) {
  const colors = colorStyles[color];
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={cn(
        "card-depth card-accent card-lift rounded-xl p-5 relative overflow-hidden group",
        "shadow-lg transition-shadow duration-300",
        colors.glow,
        className
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
      <div className="flex items-start justify-between relative z-[1]">
        <div className="flex-1 min-w-0">
          <p className="text-[10px] text-zinc-500 font-mono tracking-[0.12em] uppercase mb-2">{title}</p>
          <AnimatedValue value={value} className={colors.value} />
          {subtitle && (
            <p className="text-[10px] text-zinc-600 mt-1.5 font-mono">{subtitle}</p>
          )}
        </div>
        {icon && (
          <div className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg relative overflow-hidden",
            colors.accent,
            "ring-1 ring-inset ring-white/5"
          )}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent" />
            <span className="relative">{icon}</span>
          </div>
        )}
      </div>
      {trend && (
        <div className="mt-3 flex items-center gap-1.5 relative z-[1]">
          <span className={cn(
            "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-semibold font-mono",
            trend.direction === "up"
              ? "bg-red-500/15 text-red-400"
              : "bg-emerald-500/15 text-emerald-400"
          )}>
            {trend.direction === "up" ? "↑" : "↓"} {trend.value}%
          </span>
          <span className="text-[10px] text-zinc-600 font-mono">{trend.label}</span>
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
    <div className="flex items-center justify-between rounded-lg border border-zinc-800/50 bg-zinc-900/30 px-3.5 py-2 transition-colors hover:border-zinc-700/50 hover:bg-zinc-900/50">
      <span className="text-xs text-zinc-500 font-mono tracking-wide">{label}</span>
      <span className={cn("text-sm font-bold font-mono tabular-nums", color || "text-zinc-100")}>{value}</span>
    </div>
  );
}
