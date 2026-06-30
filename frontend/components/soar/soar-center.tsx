"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { SectionHeader } from "@/components/ui/section-header";
import { SeverityBadge } from "@/components/ui/severity-badge";

export function SOARCenter() {
  const [responses, setResponses] = useState<any[]>([]);

  const fetchResponses = async () => {
    try {
      const res = await fetch("http://localhost:8061/responses");
      const data = await res.json();
      setResponses(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchResponses();
    const interval = setInterval(fetchResponses, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-panel rounded-xl p-6">
      <SectionHeader
        title="SOAR Automation Center"
        subtitle={`${responses.length} automated responses`}
        size="lg"
        icon={
          <svg className="h-4 w-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.75v2.25m-4.5 0h13.5m-13.5 0a2.25 2.25 0 00-2.25 2.25v10.5a2.25 2.25 0 002.25 2.25h13.5a2.25 2.25 0 002.25-2.25V6a2.25 2.25 0 00-2.25-2.25H5.25zm2.25 7.5h9m-4.5 3H9m3-6h.008v.008H12V9z" />
          </svg>
        }
      />

      <div className="mt-6 space-y-2 max-h-[500px] overflow-y-auto pr-1">
        {responses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <svg className="h-10 w-10 text-zinc-700 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.75v2.25m-4.5 0h13.5m-13.5 0a2.25 2.25 0 00-2.25 2.25v10.5a2.25 2.25 0 002.25 2.25h13.5a2.25 2.25 0 002.25-2.25V6a2.25 2.25 0 00-2.25-2.25H5.25zm2.25 7.5h9m-4.5 3H9m3-6h.008v.008H12V9z" />
            </svg>
            <p className="text-sm text-zinc-600">No SOAR actions executed</p>
            <p className="text-xs text-zinc-700 mt-1">Automated responses appear here when threats are detected</p>
          </div>
        ) : (
          responses.map((response, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03 }}
              className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900/40 p-4 hover:border-zinc-700 transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-950/50 border border-emerald-500/20">
                  <svg className="h-4 w-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{response.action}</p>
                  <p className="text-[11px] text-zinc-500 font-mono">{response.target}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <SeverityBadge severity={response.severity || "medium"} />
                <span className={`text-[10px] font-mono ${response.status === "completed" ? "text-emerald-400" : "text-amber-400"}`}>
                  {response.status}
                </span>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
