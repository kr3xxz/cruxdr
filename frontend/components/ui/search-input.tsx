"use client";

import { cn } from "@/lib/utils";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchInput({ value, onChange, placeholder = "Search...", className }: SearchInputProps) {
  return (
    <div className={cn("relative group", className)}>
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 group-focus-within:text-zinc-400 transition-colors duration-200"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
      </svg>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-zinc-800 bg-zinc-900/60 py-2 pl-10 pr-4 text-sm text-zinc-200 placeholder-zinc-600 transition-all duration-200 focus:border-cyan-500/40 focus:bg-zinc-900/80 focus:outline-none focus:ring-1 focus:ring-cyan-500/20 group-hover:border-zinc-700"
      />
    </div>
  );
}

interface FilterButtonProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
  count?: number;
}

export function FilterButton({ label, active, onClick, count }: FilterButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-semibold font-mono transition-all duration-200",
        active
          ? "border-cyan-500/30 bg-cyan-500/10 text-cyan-400 shadow-sm shadow-cyan-500/5"
          : "border-zinc-800 bg-transparent text-zinc-500 hover:border-zinc-700 hover:text-zinc-400"
      )}
    >
      {label}
      {count !== undefined && (
        <span className={cn(
          "ml-1 rounded px-1 py-0.5 text-[10px]",
          active ? "bg-cyan-500/20 text-cyan-400" : "bg-zinc-800/60 text-zinc-600"
        )}>
          {count}
        </span>
      )}
    </button>
  );
}

interface FilterBarProps {
  children: React.ReactNode;
  className?: string;
}

export function FilterBar({ children, className }: FilterBarProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {children}
    </div>
  );
}
