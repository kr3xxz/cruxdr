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
import { SectionHeader } from "@/components/ui/section-header";

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
  { key: "ransomware", color: CHART_COLORS.ransomware, name: "Ransomware" },
  { key: "brute_force", color: CHART_COLORS.brute_force, name: "Brute Force" },
  { key: "lateral_movement", color: CHART_COLORS.lateral_movement, name: "Lateral" },
  { key: "phishing", color: CHART_COLORS.phishing, name: "Phishing" },
  { key: "exfiltration", color: CHART_COLORS.exfiltration, name: "Exfil" },
  { key: "credential_dumping", color: CHART_COLORS.credential_dumping, name: "Creds" },
  { key: "privilege_escalation", color: CHART_COLORS.privilege_escalation, name: "PrivEsc" },
];

export function ThreatTrends() {
  const events = useEventStore((state) => state.events);

  const data = useMemo(() => {
    const grouped: Record<string, number> = {
      ransomware: 0, brute_force: 0, lateral_movement: 0,
      phishing: 0, exfiltration: 0, credential_dumping: 0, privilege_escalation: 0,
    };
    (events ?? []).forEach((event: any) => {
      const key = event.attack_type as string;
      if (grouped[key] !== undefined) grouped[key]++;
    });
    return [
      { name: "Ransomware", value: grouped.ransomware, color: CHART_COLORS.ransomware },
      { name: "Brute Force", value: grouped.brute_force, color: CHART_COLORS.brute_force },
      { name: "Lateral", value: grouped.lateral_movement, color: CHART_COLORS.lateral_movement },
      { name: "Phishing", value: grouped.phishing, color: CHART_COLORS.phishing },
      { name: "Exfil", value: grouped.exfiltration, color: CHART_COLORS.exfiltration },
      { name: "Creds", value: grouped.credential_dumping, color: CHART_COLORS.credential_dumping },
      { name: "PrivEsc", value: grouped.privilege_escalation, color: CHART_COLORS.privilege_escalation },
    ];
  }, [events]);

  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <div className="glass-panel rounded-xl p-6">
      <SectionHeader
        title="Threat Trends"
        subtitle={`${total} total events across ${data.filter((d) => d.value > 0).length} attack types`}
        icon={
          <svg className="h-4 w-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
          </svg>
        }
      />
      <div className="mt-6 h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.2 0.01 270)" strokeOpacity={0.5} />
            <XAxis
              dataKey="name"
              stroke="oklch(0.4 0.01 270)"
              tick={{ fill: "oklch(0.5 0.01 270)", fontSize: 11 }}
              axisLine={{ stroke: "oklch(0.2 0.01 270)" }}
            />
            <YAxis
              stroke="oklch(0.4 0.01 270)"
              tick={{ fill: "oklch(0.5 0.01 270)", fontSize: 11 }}
              axisLine={{ stroke: "oklch(0.2 0.01 270)" }}
            />
            <Tooltip
              contentStyle={{
                background: "oklch(0.12 0.008 270 / 0.9)",
                border: "1px solid oklch(0.2 0.01 270)",
                borderRadius: "8px",
                color: "oklch(0.9 0.01 270)",
                fontSize: "12px",
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#06b6d4"
              strokeWidth={2}
              dot={{ fill: "#06b6d4", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: "#06b6d4", stroke: "oklch(0.12 0.008 270)", strokeWidth: 2 }}
              animationDuration={800}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
