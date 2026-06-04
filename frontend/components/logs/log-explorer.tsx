"use client";

import {
  useEffect,
  useState
} from "react";

export default function LogExplorer() {

  const [logs, setLogs] =
    useState<any[]>([]);

  const [query, setQuery] =
    useState("");

  const fetchLogs = async () => {

    let url =
      "http://localhost:8080/logs";

    if (query.trim()) {

      url =
        `http://localhost:8080/search?q=${query}`;
    }

    try {

      const response =
        await fetch(url);

      const data =
        await response.json();

      setLogs(data.reverse());

    } catch (err) {

      console.error(err);
    }
  };

  useEffect(() => {

    fetchLogs();

  }, [query]);

  useEffect(() => {

    const interval =
      setInterval(fetchLogs, 3000);

    return () =>
      clearInterval(interval);

  }, [query]);

  return (

    <div className="
      bg-zinc-900
      border
      border-zinc-700
      rounded-xl
      p-6
    ">

      <div className="
        flex
        justify-between
        items-center
        mb-6
      ">

        <h2 className="
          text-white
          text-2xl
          font-bold
        ">
          SIEM Telemetry Explorer
        </h2>

        <div className="
          text-green-400
          font-semibold
          text-sm
        ">
          LIVE
        </div>

      </div>

      <input
        type="text"
        placeholder="Search telemetry..."
        value={query}
        onChange={(e) =>
          setQuery(e.target.value)
        }
        className="
          w-full
          bg-slate-950
          border
          border-zinc-700
          rounded-lg
          p-3
          text-white
          mb-6
        "
      />

      <div className="
        space-y-3
        max-h-[600px]
        overflow-y-auto
      ">

        {logs.map((log, idx) => (

          <div
            key={idx}
            className="
              border
              border-zinc-700
              bg-slate-950
              rounded-lg
              p-4
            "
          >

            <div className="
              flex
              justify-between
              mb-2
            ">

              <span className="
                text-red-400
                font-bold
              ">
                {log.event_type}
              </span>

              <span className="
                text-cyan-400
                text-sm
              ">
                {log.source_ip}
              </span>

            </div>

            <div className="
              text-white
              text-sm
              mb-2
            ">
              User: {log.username}
            </div>

            <div className="
              text-zinc-400
              text-xs
              break-all
            ">
              {log.raw}
            </div>

          </div>

        ))}

      </div>

    </div>
  );
}
