"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { SectionHeader } from "@/components/ui/section-header";
import { SearchInput } from "@/components/ui/search-input";

export default function LogExplorer() {
  const [logs, setLogs] = useState<any[]>([]);
  const [query, setQuery] = useState("");

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

  return (
    <div className="glass-panel rounded-xl overflow-hidden">
      <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-4">
        <SectionHeader
          title="SIEM Telemetry Explorer"
          subtitle="Search and browse security events"
          icon={
            <svg className="h-4 w-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
            </svg>
          }
        />
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] text-zinc-500 font-mono">{logs.length} events</span>
        </div>
      </div>
      <div className="p-5">
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Search telemetry by event type, IP, user..."
          className="mb-5"
        />
        <div className="space-y-2 max-h-[500px] overflow-y-auto">
          {logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <svg className="h-10 w-10 text-zinc-700 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
              </svg>
              <p className="text-sm text-zinc-600">No telemetry data available</p>
              <p className="text-xs text-zinc-700 mt-1">Upload logs or launch attacks to populate the event stream</p>
            </div>
          ) : (
            logs.map((log, idx) => {
              const norm = (s: any) => typeof s === "number" ? (s >= 70 ? "critical" : s >= 40 ? "high" : s >= 20 ? "medium" : "low") : (s || "").toString().toLowerCase();
              const isCritical = norm(log.severity) === "critical" || norm(log.severity) === "high";
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.02 }}
                  className={`rounded-lg border ${isCritical ? "border-red-900/20 bg-red-950/15" : "border-zinc-800 bg-zinc-900/40"} p-4 hover:bg-zinc-900/60 transition-colors`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold font-mono uppercase tracking-wider ${isCritical ? "text-red-400" : "text-cyan-400"}`}>
                        {log.attack_type || log.event_type}
                      </span>
                      {log.severity && (
                        <span className={`text-[10px] font-mono ${isCritical ? "text-red-500" : "text-zinc-600"}`}>
                          {log.severity}
                        </span>
                      )}
                    </div>
                    {log.source_ip && (
                      <span className="text-[10px] text-zinc-500 font-mono shrink-0">{log.source_ip}</span>
                    )}
                  </div>
                  {(log.username || log.user) && (
                    <div className="text-xs text-zinc-300 mb-2">
                      User: <span className="font-mono text-zinc-400">{log.username || log.user}</span>
                    </div>
                  )}
                  <div className="text-[11px] text-zinc-600 break-all font-mono leading-relaxed">
                    {log.raw || log.message}
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
