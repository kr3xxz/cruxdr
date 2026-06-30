"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionHeader } from "@/components/ui/section-header";
import { SearchInput } from "@/components/ui/search-input";
import { SeverityBadge } from "@/components/ui/severity-badge";
import { cn } from "@/lib/utils";

function formatTimestamp(ts: string | undefined) {
  if (!ts) return "";
  try {
    const d = new Date(ts);
    return d.toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" });
  } catch {
    return ts;
  }
}

export default function LogExplorer() {
  const [logs, setLogs] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const [severityFilter, setSeverityFilter] = useState<string | null>(null);

  const fetchLogs = async () => {
    let url = "http://localhost:8080/logs";
    if (query.trim()) {
      url = `http://localhost:8080/search?q=${encodeURIComponent(query)}`;
    }
    try {
      const response = await fetch(url);
      const data = await response.json();
      setLogs(Array.isArray(data) ? [...data].reverse() : []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [query]);

  useEffect(() => {
    const interval = setInterval(fetchLogs, 3000);
    return () => clearInterval(interval);
  }, [query]);

  const filtered = severityFilter
    ? logs.filter((log) => (log.severity || "info").toLowerCase() === severityFilter.toLowerCase())
    : logs;

  const severityCounts = logs.reduce((acc: Record<string, number>, log: any) => {
    const sev = (log.severity || "info").toLowerCase();
    acc[sev] = (acc[sev] || 0) + 1;
    return acc;
  }, {});

  const getEventTypeColor = (type: string | undefined) => {
    const colors: Record<string, string> = {
      alert: "border-l-fuchsia-500/60",
      warning: "border-l-amber-500/60",
      info: "border-l-cyan-500/40",
      error: "border-l-rose-500/60",
      critical: "border-l-fuchsia-500/80",
    };
    return colors[(type || "").toLowerCase()] || "border-l-zinc-600/30";
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <SectionHeader
          title="Log Explorer"
          subtitle={`${logs.length} events • ${filtered.length} shown`}
          icon={
            <svg className="h-4 w-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
          }
          action={
            <SearchInput
              value={query}
              onChange={setQuery}
              placeholder="Search logs..."
              className="w-64"
            />
          }
        />
      </div>

      <div className="flex items-center gap-2 mb-4">
        {["critical", "high", "medium", "info"].map((sev) => (
          <button
            key={sev}
            onClick={() => setSeverityFilter(severityFilter === sev ? null : sev)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-mono font-semibold uppercase tracking-wider transition-all duration-200",
              severityFilter === sev
                ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-300 shadow-[0_0_8px] shadow-cyan-500/20"
                : "border-zinc-700/40 text-zinc-500 hover:border-zinc-600/60 hover:text-zinc-300"
            )}
          >
            {sev}
            {severityCounts[sev] > 0 && (
              <span className="tabular-nums opacity-60">{severityCounts[sev]}</span>
            )}
          </button>
        ))}
      </div>

      <div className="space-y-1.5 max-h-[500px] overflow-y-auto custom-scrollbar">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <svg className="h-8 w-8 text-zinc-700 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
            <p className="text-xs text-zinc-600 font-mono">No log events found</p>
          </div>
        ) : (
          filtered.slice(0, 200).map((log: any, idx: number) => {
            const isExpanded = expandedIdx === idx;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.003 }}
              >
                <button
                  onClick={() => setExpandedIdx(isExpanded ? null : idx)}
                  className={cn(
                    "w-full text-left rounded-lg border px-4 py-2.5 font-mono text-[11px] transition-all duration-200 border-l-4",
                    isExpanded
                      ? "border-zinc-700/60 bg-zinc-800/30 border-l-cyan-400/60"
                      : "border-zinc-800/40 bg-zinc-900/20 hover:bg-zinc-900/40 hover:border-zinc-700/50",
                    getEventTypeColor(log.event_type)
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className={cn(
                      "shrink-0 font-semibold tracking-wide",
                      log.severity === "critical" || log.severity === "high"
                        ? "text-fuchsia-400"
                        : log.severity === "medium"
                        ? "text-amber-400"
                        : "text-cyan-400"
                    )}>
                      [{log.event_type || "event"}]
                    </span>
                    <span className="shrink-0 text-zinc-600 tabular-nums w-16">
                      {formatTimestamp(log.timestamp)}
                    </span>
                    <span className="flex-1 truncate text-zinc-400">
                      {log.raw || log.message || JSON.stringify(log)}
                    </span>
                    {log.severity && (
                      <SeverityBadge severity={log.severity} size="sm" className="shrink-0" />
                    )}
                    <svg
                      className={cn(
                        "h-3 w-3 shrink-0 text-zinc-600 transition-transform duration-200",
                        isExpanded && "rotate-180"
                      )}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </div>
                </button>
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mx-4 mb-2 rounded-b-lg border-x border-b border-zinc-800/40 bg-zinc-900/20 p-4">
                        <div className="grid grid-cols-2 gap-3">
                          {[
                            { label: "Event Type", value: log.event_type || "—" },
                            { label: "Severity", value: log.severity || "—" },
                            { label: "Timestamp", value: log.timestamp || "—" },
                            { label: "Source IP", value: log.source_ip || "—" },
                            { label: "Host", value: log.host || "—" },
                            { label: "User", value: log.user || "—" },
                            { label: "Attack Type", value: log.attack_type || "—" },
                            { label: "MITRE Technique", value: log.mitre_technique || "—" },
                          ].map((field) => (
                            <div key={field.label} className="flex flex-col gap-0.5">
                              <span className="text-[10px] text-zinc-600 uppercase tracking-wider">{field.label}</span>
                              <span className="text-xs text-zinc-300 font-mono break-all">{field.value}</span>
                            </div>
                          ))}
                        </div>
                        {log.message && (
                          <div className="mt-3 pt-3 border-t border-zinc-800/40">
                            <span className="text-[10px] text-zinc-600 uppercase tracking-wider block mb-1">Message</span>
                            <p className="text-xs text-zinc-300 font-mono">{log.message}</p>
                          </div>
                        )}
                        {log.raw && log.raw !== log.message && (
                          <div className="mt-3 pt-3 border-t border-zinc-800/40">
                            <span className="text-[10px] text-zinc-600 uppercase tracking-wider block mb-1">Raw</span>
                            <pre className="text-[10px] text-zinc-500 font-mono whitespace-pre-wrap break-all max-h-32 overflow-y-auto">
                              {log.raw}
                            </pre>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
