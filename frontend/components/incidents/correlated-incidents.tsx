"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SeverityBadge, SeverityDot, getSeverityColor } from "@/components/ui/severity-badge";
import { SectionHeader } from "@/components/ui/section-header";
import { SearchInput, FilterButton, FilterBar } from "@/components/ui/search-input";

export function CorrelatedIncidents() {
  const [incidents, setIncidents] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("http://localhost:8030/incidents");
        const data = await res.json();
        setIncidents(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      }
    };
    load();
    const interval = setInterval(load, 3000);
    return () => clearInterval(interval);
  }, []);

  const filtered = incidents.filter((inc) => {
    const matchesSearch = !search || 
      (inc.title || "").toLowerCase().includes(search.toLowerCase()) ||
      (inc.user || "").toLowerCase().includes(search.toLowerCase()) ||
      (inc.host || "").toLowerCase().includes(search.toLowerCase()) ||
      (inc.mitre || "").toLowerCase().includes(search.toLowerCase());
    const matchesSeverity = !severityFilter || (inc.severity || "").toLowerCase() === severityFilter.toLowerCase();
    return matchesSearch && matchesSeverity;
  });

  const selected = selectedId ? incidents.find((i) => i.id === selectedId || i.title === selectedId) : null;

  const severityCounts = incidents.reduce((acc: Record<string, number>, inc: any) => {
    const sev = (inc.severity || "unknown").toLowerCase();
    acc[sev] = (acc[sev] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="glass-panel rounded-xl overflow-hidden">
      <div className="border-b border-zinc-800 px-6 py-4">
        <SectionHeader
          title="Incident Response"
          subtitle={`${incidents.length} incidents • ${filtered.length} shown`}
          icon={
            <svg className="h-4 w-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          }
        />
      </div>

      <div className="p-6">
        <div className="flex items-center gap-4 mb-5">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search incidents by title, user, host..."
            className="flex-1 max-w-md"
          />
          <FilterBar>
            {["critical", "high", "medium"].map((sev) => (
              <FilterButton
                key={sev}
                label={sev}
                active={severityFilter === sev}
                onClick={() => setSeverityFilter(severityFilter === sev ? null : sev)}
                count={severityCounts[sev] || 0}
              />
            ))}
          </FilterBar>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
          {/* Incident List */}
          <div className="xl:col-span-2">
            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <svg className="h-10 w-10 text-zinc-700 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                  </svg>
                  <p className="text-sm text-zinc-600">No incidents found</p>
                  <p className="text-xs text-zinc-700 mt-1">Launch attacks or upload telemetry to generate incidents</p>
                </div>
              ) : (
                filtered.map((incident, idx) => {
                  const isSelected = selectedId === (incident.id || incident.title);
                  return (
                    <motion.button
                      key={incident.id || incident.title || idx}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      onClick={() => setSelectedId(isSelected ? null : (incident.id || incident.title))}
                      className={`w-full text-left rounded-lg border p-4 transition-all ${
                        isSelected
                          ? "border-zinc-600 bg-zinc-900/80"
                          : "border-zinc-800 bg-zinc-900/40 hover:border-zinc-700 hover:bg-zinc-900/60"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <SeverityDot severity={incident.severity} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-sm font-semibold text-white truncate">
                              {incident.title || "Untitled Incident"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-zinc-500 font-mono">
                            <span>{incident.user || "N/A"}</span>
                            <span className="text-zinc-700">•</span>
                            <span>{incident.host || "N/A"}</span>
                          </div>
                        </div>
                        <SeverityBadge severity={incident.severity} />
                      </div>
                    </motion.button>
                  );
                })
              )}
            </div>
          </div>

          {/* Incident Detail */}
          <div className="xl:col-span-3">
            <AnimatePresence mode="wait">
              {selected ? (
                <motion.div
                  key={selected.id || selected.title}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-6"
                >
                  {/* Detail Header */}
                  <div className="flex items-center gap-4 mb-6 pb-6 border-b border-zinc-800">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-white">{selected.title || "Untitled Incident"}</h3>
                        <SeverityBadge severity={selected.severity} size="md" />
                      </div>
                      <div className="flex items-center gap-3 text-xs text-zinc-500 font-mono">
                        <span className="flex items-center gap-1">
                          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                          </svg>
                          {selected.user || "Unassigned"}
                        </span>
                        <span className="text-zinc-700">|</span>
                        <span className="flex items-center gap-1">
                          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                          </svg>
                          {selected.host || "N/A"}
                        </span>
                        {selected.mitre && (
                          <>
                            <span className="text-zinc-700">|</span>
                            <span className="text-violet-400">{selected.mitre}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-md border px-2.5 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-wider text-emerald-400 border-emerald-500/30 bg-emerald-950/30">Open</span>
                    </div>
                  </div>

                  {/* Detail Grid */}
                  <div className="grid grid-cols-2 gap-6">
                    {/* Alert Details */}
                    <div>
                      <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Alert Details</h4>
                      <div className="space-y-2.5">
                        {[
                          { label: "Severity", value: selected.severity, color: getSeverityColor(selected.severity) },
                          { label: "MITRE Technique", value: selected.mitre || "N/A", color: "#a78bfa" },
                          { label: "User", value: selected.user || "N/A" },
                          { label: "Host", value: selected.host || "N/A" },
                          { label: "Source IP", value: selected.source_ip || "N/A" },
                          { label: "Status", value: selected.status || "active" },
                        ].map((item) => (
                          <div key={item.label} className="flex items-center justify-between rounded-md border border-zinc-800/60 bg-zinc-900/30 px-3.5 py-2">
                            <span className="text-[11px] text-zinc-500 font-mono">{item.label}</span>
                            <span className="text-xs font-semibold" style={item.color ? { color: item.color } : {}}>
                              {item.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Related Events */}
                    <div>
                      <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Related Alerts</h4>
                      {selected.events && selected.events.length > 0 ? (
                        <div className="space-y-2">
                          {selected.events.map((ev: any, i: number) => (
                            <div key={i} className="rounded-md border border-zinc-800/60 bg-zinc-900/30 p-3">
                              <div className="flex items-center gap-2 mb-1">
                                <SeverityDot severity={ev.severity} />
                                <span className="text-xs font-semibold text-white">{ev.title || ev.type || `Event ${i + 1}`}</span>
                              </div>
                              <p className="text-[11px] text-zinc-500 font-mono">{ev.message || ev.description || ""}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-32 text-zinc-700 text-xs">
                          No related alerts
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Timeline */}
                  {selected.timeline && selected.timeline.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-zinc-800">
                      <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Timeline</h4>
                      <div className="space-y-2">
                        {selected.timeline.map((entry: any, i: number) => (
                          <div key={i} className="flex items-start gap-3">
                            <div className="flex flex-col items-center">
                              <div className="h-2 w-2 rounded-full bg-zinc-700" />
                              {i < selected.timeline.length - 1 && <div className="w-px flex-1 bg-zinc-800" />}
                            </div>
                            <div className="pb-4">
                              <p className="text-xs text-zinc-400">{entry.message || entry.action}</p>
                              <p className="text-[10px] text-zinc-600 font-mono">{entry.timestamp || ""}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="empty-detail"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center h-full min-h-[400px] rounded-lg border border-dashed border-zinc-800 bg-zinc-900/20"
                >
                  <svg className="h-12 w-12 text-zinc-700 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                  </svg>
                  <p className="text-sm text-zinc-600">Select an incident to view details</p>
                  <p className="text-xs text-zinc-700 mt-1">Investigation workspace with timeline and related alerts</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
