"use client";

import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeStyles = {
  sm: { icon: "h-7 w-7", title: "text-sm", subtitle: "text-[10px]" },
  md: { icon: "h-8 w-8", title: "text-base", subtitle: "text-[11px]" },
  lg: { icon: "h-10 w-10", title: "text-lg", subtitle: "text-xs" },
};

export function SectionHeader({ title, subtitle, icon, action, className, size = "md" }: SectionHeaderProps) {
  const s = sizeStyles[size];
  return (
    <div className={cn("flex items-center justify-between", className)}>
      <div className="flex items-center gap-3">
        {icon && (
          <div className={cn(
            "flex items-center justify-center rounded-lg border border-zinc-700/40 bg-gradient-to-br from-zinc-800/80 to-zinc-900/80 shadow-sm",
            s.icon
          )}>
            {icon}
          </div>
        )}
        <div>
          <h2 className={cn("font-bold text-foreground tracking-tight", s.title)}>{title}</h2>
          {subtitle && (
            <p className={cn("text-muted-foreground/60 font-mono tracking-wide", s.subtitle)}>{subtitle}</p>
          )}
        </div>
      </div>
      {action && (
        <div className="flex items-center gap-2">
          {action}
        </div>
      )}
    </div>
  );
}

export function LiveIndicator({ pulse = true }: { pulse?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <span className="relative flex h-2 w-2">
        <span className={cn(
          "absolute inline-flex h-full w-full rounded-full bg-cyan-400/60",
          pulse && "animate-ping"
        )} />
        <span className={cn(
          "relative inline-flex h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_6px] shadow-cyan-400/60",
          pulse && "dot-pulse"
        )} />
      </span>
      <span className="text-[11px] text-zinc-500 font-mono tracking-wide">Live</span>
    </div>
  );
}
