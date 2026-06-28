"use client";

import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import { useEventStore } from "@/store/live-events";

const CHART_COLORS = {
  ransomware: "#ef4444",
  brute_force: "#f97316",
  lateral_movement: "#eab308",
  phishing: "#22c55e",
  exfiltration: "#3b82f6",
  credential_dumping: "#a78bfa",
  privilege_escalation: "#ec4899",
};

const CHART_CONFIG = [
  { key: "ransomware", label: "Ransomware", color: CHART_COLORS.ransomware },
  { key: "brute_force", label: "Brute Force", color: CHART_COLORS.brute_force },
  { key: "lateral_movement", label: "Lateral Movement", color: CHART_COLORS.lateral_movement },
  { key: "phishing", label: "Phishing", color: CHART_COLORS.phishing },
  { key: "exfiltration", label: "Exfiltration", color: CHART_COLORS.exfiltration },
  { key: "credential_dumping", label: "Cred. Dumping", color: CHART_COLORS.credential_dumping },
  { key: "privilege_escalation", label: "Priv. Escalation", color: CHART_COLORS.privilege_escalation },
];

export function ThreatTrends() {
  const events = useEventStore((state) => state.events);

  const data = useMemo(() => {
    const grouped: Record<string, number> = {
      ransomware: 0,
      brute_force: 0,
      lateral_movement: 0,
      phishing: 0,
      exfiltration: 0,
      credential_dumping: 0,
      privilege_escalation: 0,
    };

    (events ?? []).forEach((event: any) => {
      const key = event.attack_type as string;
      if (grouped[key] !== undefined) {
        grouped[key]++;
      }
    });

    return [
      { name: "Ransomware", value: grouped.ransomware, color: CHART_COLORS.ransomware },
      { name: "Brute Force", value: grouped.brute_force, color: CHART_COLORS.brute_force },
      { name: "Lateral Movement", value: grouped.lateral_movement, color: CHART_COLORS.lateral_movement },
      { name: "Phishing", value: grouped.phishing, color: CHART_COLORS.phishing },
      { name: "Exfiltration", value: grouped.exfiltration, color: CHART_COLORS.exfiltration },
      { name: "Cred. Dumping", value: grouped.credential_dumping, color: CHART_COLORS.credential_dumping },
      { name: "Priv. Escalation", value: grouped.privilege_escalation, color: CHART_COLORS.privilege_escalation },
    ];
  }, [events]);

  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <div className="glass-panel rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-950/60 border border-blue-500/30">
            <svg className="h-4 w-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-zinc-200 uppercase tracking-wider">Threat Activity Trends</h3>
            <p className="text-[10px] text-zinc-500 font-mono">Attack type distribution</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-white font-mono">{total}</div>
          <div className="text-[10px] text-zinc-500 font-mono">TOTAL EVENTS</div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0.005 270)" strokeOpacity={0.5} />
          <XAxis
            dataKey="name"
            tick={{ fill: "oklch(0.5 0.01 270)", fontSize: 10, fontFamily: "Geist Mono" }}
            axisLine={{ stroke: "oklch(0.25 0.005 270)" }}
            tickLine={false}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fill: "oklch(0.5 0.01 270)", fontSize: 10, fontFamily: "Geist Mono" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              background: "oklch(0.16 0.005 270)",
              border: "1px solid oklch(0.25 0.005 270)",
              borderRadius: "8px",
              fontSize: "12px",
              color: "oklch(0.92 0.005 270)",
              fontFamily: "Geist Mono",
            }}
            cursor={{ stroke: "oklch(0.35 0.005 270)" }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#ef4444"
            strokeWidth={2.5}
            dot={{ fill: "#ef4444", r: 4, strokeWidth: 0 }}
            activeDot={{ fill: "#ef4444", r: 6, strokeWidth: 2, stroke: "oklch(0.25 0.005 270)" }}
            isAnimationActive={true}
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-zinc-800/60">
        {CHART_CONFIG.map((item) => (
          <div key={item.key} className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-[10px] text-zinc-500 font-mono">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
