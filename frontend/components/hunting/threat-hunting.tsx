"use client";

import { useState } from "react";

export default function ThreatHunting() {

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);

  const hunt = async () => {

    const res = await fetch(
      `http://localhost:8080/hunt?q=${encodeURIComponent(query)}`
    );

    const data = await res.json();

    setResults(data);
  };

  return (
    <div className="space-y-6">

      <h1 className="text-3xl font-bold text-white">
        Threat Hunting Workbench
      </h1>

      <div className="flex gap-4">

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="username:root"
          className="flex-1 bg-black border border-zinc-700 rounded p-3 text-white"
        />

        <button
          onClick={hunt}
          className="px-6 py-3 bg-cyan-600 rounded text-white"
        >
          Hunt
        </button>

      </div>

      <div className="space-y-3">

        {results.map((event, idx) => (

          <div
            key={idx}
            className="bg-zinc-900 border border-zinc-700 rounded p-4 text-white"
          >

            <div>
              Event: {event.event_type}
            </div>

            <div>
              User: {event.username}
            </div>

            <div>
              IP: {event.source_ip}
            </div>

            <div className="text-zinc-400 text-sm">
              {event.raw}
            </div>

          </div>

        ))}

      </div>

    </div>
  );
}
