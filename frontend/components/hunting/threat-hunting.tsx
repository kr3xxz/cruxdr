"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionHeader } from "@/components/ui/section-header";
import { SearchInput, FilterButton, FilterBar } from "@/components/ui/search-input";
import { SeverityBadge, SeverityDot } from "@/components/ui/severity-badge";

const HUNT_TYPES = [
  { id: "ioc", label: "IOC Search", icon: "🎯" },
  { id: "host", label: "Host Search", icon: "🖥" },
  { id: "user", label: "User Search", icon: "👤" },
  { id: "query", label: "Custom Query", icon: "🔍" },
];

const SEARCH_ENDPOINTS: Record<string, string> = {
  ioc: "http://localhost:8080/search?q=",
  host: "http://localhost:8040/api/hunts?host=",
  user: "http://localhost:8040/api/hunts?user=",
  query: "http://localhost:8040/api/hunts?q=",
};

export default function ThreatHunting() {
  const [huntType, setHuntType] = useState("ioc");
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const executeSearch = async () => {
    if (!search.trim()) return;
    setLoading(true);
    setHistory((prev) => [search, ...prev.slice(0, 9)]);
    try {
      const ep = SEARCH_ENDPOINTS[huntType] || SEARCH_ENDPOINTS.ioc;
      const res = await fetch(`${ep}${encodeURIComponent(search)}`);
      const data = await res.json();
      setResults(Array.isArray(data) ? data : []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel rounded-xl overflow-hidden">
      <div className="border-b border-zinc-800/60 px-6 py-4">
        <SectionHeader
          title="Threat Hunting"
          subtitle={`${results.length} results · ${history.length} past hunts`}
          icon={
            <svg className="h-4 w-4 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          }
        />
      </div>

      <div className="p-6">
        <FilterBar className="mb-4">
          {HUNT_TYPES.map((ht) => (
            <FilterButton
              key={ht.id}
              label={ht.label}
              active={huntType === ht.id}
              onClick={() => setHuntType(ht.id)}
            />
          ))}
        </FilterBar>

        <div className="flex items-center gap-3 mb-6">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder={
              huntType === "ioc" ? "Enter IOC (IP, domain, hash)..." :
              huntType === "host" ? "Enter hostname..." :
              huntType === "user" ? "Enter username..." :
              "Enter custom query..."
            }
            className="flex-1"
          />
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={executeSearch}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 hover:shadow-xl hover:shadow-cyan-500/30 transition-all duration-200 disabled:opacity-50"
          >
            {loading ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            )}
            {loading ? "Searching..." : "Hunt"}
          </motion.button>
        </div>

        <AnimatePresence mode="wait">
          {results.length > 0 ? (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-2 max-h-[500px] overflow-y-auto pr-1"
            >
              {results.map((result, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.02 }}
                  className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4 hover:border-zinc-700 transition-all duration-200"
                >
                  <div className="flex items-start gap-3">
                    <SeverityDot severity={result.severity || "medium"} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-white">{result.title || result.type || "Match"}</span>
                        {result.mitre && (
                          <span className="text-[10px] text-violet-400/70 font-mono">{result.mitre}</span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-400">{result.message || result.description || JSON.stringify(result)}</p>
                      <div className="flex items-center gap-2 mt-1.5 text-[10px] text-zinc-600 font-mono">
                        {result.host && <span>{result.host}</span>}
                        {result.user && <><span className="text-zinc-800">|</span><span>{result.user}</span></>}
                        {result.source_ip && <><span className="text-zinc-800">|</span><span>{result.source_ip}</span></>}
                      </div>
                    </div>
                    {result.severity && <SeverityBadge severity={result.severity} />}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : history.length > 0 ? (
            <motion.div
              key="history"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-10 text-center"
            >
              <svg className="h-8 w-8 text-zinc-700 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <p className="text-sm text-zinc-600">No results for &ldquo;{history[0]}&rdquo;</p>
              <p className="text-xs text-zinc-700 mt-1">Try a different search term or hunt type</p>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-16 text-center"
            >
              <svg className="h-12 w-12 text-zinc-700 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <p className="text-sm text-zinc-600">Proactive Threat Hunting</p>
              <p className="text-xs text-zinc-700 mt-1">Search for IOCs, hosts, users, or custom queries</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
