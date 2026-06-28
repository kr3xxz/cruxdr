"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { SectionHeader } from "@/components/ui/section-header";
import { SearchInput, FilterButton, FilterBar } from "@/components/ui/search-input";
import { SeverityBadge, SeverityDot } from "@/components/ui/severity-badge";

const HUNT_TYPES = [
  { id: "ioc", label: "IOC Search", icon: "target" },
  { id: "host", label: "Host Search", icon: "host" },
  { id: "user", label: "User Search", icon: "user" },
  { id: "query", label: "Custom Query", icon: "query" },
];

const HUNT_PLACEHOLDERS: Record<string, string> = {
  ioc: "Enter IOC (IP, domain, hash)...",
  host: "Enter hostname or IP...",
  user: "Enter username or email...",
  query: "Enter custom search query...",
};

export default function ThreatHunting() {
  const [huntType, setHuntType] = useState("ioc");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [hunting, setHunting] = useState(false);
  const [history, setHistory] = useState<string[]>([]);

  const hunt = async () => {
    if (!query.trim()) return;
    setHunting(true);
    setHistory((prev) => [query, ...prev].slice(0, 20));

    try {
      let url = `http://localhost:8080/hunt?q=${encodeURIComponent(query)}`;
      if (huntType === "ioc") url = `http://localhost:8080/hunt?ioc=${encodeURIComponent(query)}`;
      else if (huntType === "host") url = `http://localhost:8080/hunt?host=${encodeURIComponent(query)}`;
      else if (huntType === "user") url = `http://localhost:8080/hunt?user=${encodeURIComponent(query)}`;
      
      const res = await fetch(url);
      const data = await res.json();
      setResults(Array.isArray(data) ? data : []);
    } catch {
      setResults([]);
    } finally {
      setHunting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") hunt();
  };

  return (
    <div className="glass-panel rounded-xl overflow-hidden">
      <div className="border-b border-zinc-800 px-6 py-4">
        <SectionHeader
          title="Threat Hunting Workbench"
          subtitle="Proactive threat search across all telemetry"
          icon={
            <svg className="h-4 w-4 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          }
        />
      </div>

      <div className="p-6">
        {/* Hunt Type Selector */}
        <div className="flex items-center gap-2 mb-5">
          {HUNT_TYPES.map((type) => (
            <button
              key={type.id}
              onClick={() => { setHuntType(type.id); setResults([]); }}
              className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-xs font-semibold transition-all ${
                huntType === type.id
                  ? "border-violet-500/30 bg-violet-950/30 text-violet-300"
                  : "border-zinc-800 bg-zinc-900/40 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300"
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 relative">
            <SearchInput
              value={query}
              onChange={setQuery}
              placeholder={HUNT_PLACEHOLDERS[huntType] || "Search..."}
              className="w-full"
            />
          </div>
          <button
            onClick={hunt}
            disabled={hunting || !query.trim()}
            className="flex items-center gap-2 rounded-lg border border-violet-500/30 bg-violet-950/40 px-5 py-2 text-sm font-semibold text-violet-300 hover:bg-violet-950/60 hover:border-violet-500/50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            {hunting ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-violet-300 border-t-transparent" />
                Hunting...
              </>
            ) : (
              <>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                Hunt
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Results */}
          <div className="xl:col-span-3">
            <div className="flex items-center gap-2 mb-3">
              <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">Results</h3>
              {results.length > 0 && (
                <span className="text-[10px] text-zinc-600 font-mono">({results.length} matches)</span>
              )}
            </div>
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {results.length === 0 && !hunting && (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <svg className="h-10 w-10 text-zinc-700 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                  <p className="text-sm text-zinc-600">Enter a search query to begin hunting</p>
                  <p className="text-xs text-zinc-700 mt-1">Search by IP, hostname, username, or custom query</p>
                </div>
              )}
              {results.map((event, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.02 }}
                  className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4 hover:bg-zinc-900/60 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold font-mono text-cyan-400 uppercase tracking-wider">
                        {event.event_type || "Event"}
                      </span>
                      {event.severity && <SeverityBadge severity={event.severity} />}
                    </div>
                    {event.timestamp && (
                      <span className="text-[10px] text-zinc-600 font-mono">
                        {new Date(event.timestamp).toLocaleString()}
                      </span>
                    )}
                  </div>
                  <div className="space-y-0.5 text-xs text-zinc-400">
                    {event.username && <div>User: <span className="font-mono text-zinc-300">{event.username}</span></div>}
                    {event.source_ip && <div>IP: <span className="font-mono text-zinc-300">{event.source_ip}</span></div>}
                    {event.host && <div>Host: <span className="font-mono text-zinc-300">{event.host}</span></div>}
                  </div>
                  {event.raw && (
                    <div className="mt-2 text-[11px] text-zinc-600 font-mono break-all leading-relaxed border-t border-zinc-800 pt-2">
                      {event.raw}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Query History */}
          <div className="xl:col-span-1">
            <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-3">Query History</h3>
            {history.length === 0 ? (
              <div className="text-xs text-zinc-700 text-center py-8">No queries yet</div>
            ) : (
              <div className="space-y-1 max-h-[600px] overflow-y-auto">
                {history.map((h, i) => (
                  <button
                    key={i}
                    onClick={() => { setQuery(h); hunt(); }}
                    className="w-full text-left rounded-md border border-zinc-800/60 bg-zinc-900/30 px-3 py-2 text-xs text-zinc-500 hover:bg-zinc-900/60 hover:text-zinc-300 transition-colors truncate font-mono"
                  >
                    {h}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
