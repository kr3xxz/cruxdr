"use client";

import { useEffect, useState } from "react";

const typeConfig: Record<string, { bg: string; border: string; text: string; icon: string }> = {
  source: { bg: "bg-purple-950/40", border: "border-purple-500/30", text: "text-purple-400", icon: "🌐" },
  victim: { bg: "bg-red-950/40", border: "border-red-500/30", text: "text-red-400", icon: "👤" },
  host: { bg: "bg-blue-950/40", border: "border-blue-500/30", text: "text-blue-400", icon: "🖥" },
  process: { bg: "bg-amber-950/40", border: "border-amber-500/30", text: "text-amber-400", icon: "⚙" },
};

const severityBorder: Record<string, string> = {
  critical: "border-l-red-500",
  high: "border-l-orange-500",
  medium: "border-l-yellow-500",
  low: "border-l-blue-500",
};

export function LiveAttackGraph() {
  const [graph, setGraph] = useState<any>(null);

  const fetchGraph = async () => {
    try {
      const res = await fetch("http://localhost:8030/graph");
      const data = await res.json();
      setGraph(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchGraph();
    const interval = setInterval(fetchGraph, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950/80 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-950/60 border border-cyan-500/30">
            <svg className="h-4 w-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Live Attack Graph</h2>
            <p className="text-[11px] text-zinc-500 font-mono">Correlation chain &bull; user → host → process</p>
          </div>
        </div>
        {graph?.severity && (
          <span className={`text-xs font-mono font-semibold uppercase tracking-wider ${severityBorder[graph.severity] ? "text-cyan-400" : "text-zinc-500"}`}>
            {graph.mitre ? `${graph.mitre}` : ""}
          </span>
        )}
      </div>

      {graph?.nodes ? (
        <div className="flex items-start gap-3 overflow-x-auto pb-2">
          {graph.nodes.map((node: any, idx: number) => {
            const cfg = typeConfig[node.type] || typeConfig.process;
            const sevBorder = severityBorder[node.severity] || "border-l-zinc-700";
            return (
              <div key={idx} className="flex items-center gap-3 shrink-0">
                <div className={`min-w-[170px] rounded-lg border ${cfg.border} ${cfg.bg} border-l-4 ${sevBorder} p-4`}>
                  <div className={`text-[10px] font-semibold uppercase tracking-wider ${cfg.text} mb-1`}>
                    {node.label || node.type}
                  </div>
                  <div className="text-sm font-bold text-white break-all leading-snug">
                    {node.id}
                  </div>
                  {node.severity && (
                    <div className={`mt-1.5 text-[10px] font-mono font-semibold uppercase tracking-wider ${cfg.text}/70`}>
                      {node.severity}
                    </div>
                  )}
                </div>
                {idx < graph.nodes.length - 1 && (
                  <div className="text-zinc-700 text-2xl font-bold">→</div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <svg className="h-8 w-8 text-zinc-700 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
          </svg>
          <p className="text-sm text-zinc-600">Waiting for attack telemetry...</p>
          <p className="text-xs text-zinc-700 mt-1">Graph populates when incidents are correlated</p>
        </div>
      )}
    </div>
  );
}
