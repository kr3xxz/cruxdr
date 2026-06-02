"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import { useEventStore } from "@/store/event-store";

export function ThreatTrends() {

  const events =
    useEventStore(
      (state) => state.events
    );

  const grouped = {

    ransomware: 0,
    brute_force: 0,
    lateral_movement: 0,
    phishing: 0,
    exfiltration: 0,
  };

  (events ?? []).forEach(
    (event: any) => {

      if (
        grouped[
          event.attack_type as keyof typeof grouped
        ] !== undefined
      ) {

        grouped[
          event.attack_type as keyof typeof grouped
        ]++;
      }
    }
  );

  const data = [

    {
      name: "Ransomware",
      value: grouped.ransomware,
    },

    {
      name: "Brute Force",
      value: grouped.brute_force,
    },

    {
      name: "Lateral Movement",
      value: grouped.lateral_movement,
    },

    {
      name: "Phishing",
      value: grouped.phishing,
    },

    {
      name: "Exfiltration",
      value: grouped.exfiltration,
    },
  ];

  return (
    <div className="
      bg-zinc-900
      border
      border-zinc-800
      rounded-xl
      p-6
      h-[500px]
    ">

      <h2 className="
        text-white
        text-3xl
        font-bold
        mb-8
      ">
        Threat Activity Trends
      </h2>

      <ResponsiveContainer
        width="100%"
        height={350}
      >

        <LineChart data={data}>

          <CartesianGrid
            strokeDasharray="3 3"
          />

          <XAxis dataKey="name" />

          <YAxis />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="value"
            stroke="#ef4444"
            strokeWidth={3}
          />

        </LineChart>

      </ResponsiveContainer>

    </div>
  );
}
