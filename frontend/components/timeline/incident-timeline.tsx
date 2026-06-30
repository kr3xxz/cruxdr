"use client";

import { SectionHeader } from "@/components/ui/section-header";

const events = [
  { time: "10:01", event: "SSH Brute Force Detected" },
  { time: "10:05", event: "Credential Access" },
  { time: "10:07", event: "Privilege Escalation" },
  { time: "10:10", event: "Malware Download" },
];

export function IncidentTimeline() {
  return (
    <div className="glass-panel rounded-xl p-6">
      <SectionHeader
        title="Investigation Timeline"
        subtitle="Attack progression"
        icon={
          <svg className="h-4 w-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
      />
      <div className="mt-6 space-y-4">
        {(events ?? []).map((event, index) => (
          <div key={index} className="flex gap-4 items-start group">
            <div className="flex flex-col items-center">
              <div className="h-3 w-3 rounded-full bg-cyan-500/50 border-2 border-cyan-500/80 group-hover:border-cyan-400 transition-colors" />
              {index < events.length - 1 && <div className="w-px flex-1 bg-zinc-800 group-hover:bg-zinc-700 transition-colors" />}
            </div>
            <div className="pb-4">
              <p className="text-zinc-400 text-xs font-mono">{event.time}</p>
              <p className="text-white text-sm font-semibold mt-0.5">{event.event}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
