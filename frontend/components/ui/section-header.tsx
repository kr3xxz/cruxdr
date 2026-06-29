"use client";

import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export function SectionHeader({ title, subtitle, icon, action, className }: SectionHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between", className)}>
      <div className="flex items-center gap-3">
        {icon && (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-700/40 bg-gradient-to-br from-zinc-800/80 to-zinc-900/80 shadow-sm">
            {icon}
          </div>
        )}
        <div>
          <h2 className="text-base font-bold text-foreground tracking-tight">{title}</h2>
          {subtitle && (
            <p className="text-[11px] text-muted-foreground/60 font-mono tracking-wide">{subtitle}</p>
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

export function LiveIndicator() {
  return (
    <div className="flex items-center gap-2">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/60" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
      </span>
      <span className="text-[11px] text-zinc-500 font-mono tracking-wide">Live</span>
    </div>
  );
}
