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
      { name: "Ransomware",        value: grouped.ransomware },
      { name: "Brute Force",       value: grouped.brute_force },
      { name: "Lateral Movement",  value: grouped.lateral_movement },
      { name: "Phishing",          value: grouped.phishing },
      { name: "Exfiltration",      value: grouped.exfiltration },
      { name: "Cred. Dumping",     value: grouped.credential_dumping },
      { name: "Priv. Escalation",  value: grouped.privilege_escalation },
    ];
  }, [events]);

  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 h-[500px]">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-white text-3xl font-bold">Threat Activity Trends</h2>
        <div className="text-red-400 font-semibold text-sm">{total} events</div>
      </div>

      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#ef4444"
            strokeWidth={3}
            dot={{ fill: "#ef4444", r: 4 }}
            isAnimationActive={true}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
