"use client";

const events = [
  {
    time: "10:01",
    event: "SSH Brute Force Detected",
  },
  {
    time: "10:05",
    event: "Credential Access",
  },
  {
    time: "10:07",
    event: "Privilege Escalation",
  },
  {
    time: "10:10",
    event: "Malware Download",
  },
];

export function IncidentTimeline() {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
      <h2 className="text-white text-xl font-semibold mb-6">
        Investigation Timeline
      </h2>

      <div className="space-y-4">
        {(events ?? []).map((event, index) => (
          <div
            key={index}
            className="flex gap-4 items-start"
          >
            <div className="w-3 h-3 rounded-full bg-slate-800 mt-2" />

            <div>
              <p className="text-zinc-400 text-sm">
                {event.time}
              </p>

              <p className="text-white">
                {event.event}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
