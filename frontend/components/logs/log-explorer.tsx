"use client";

import {
  useEffect,
  useState,
} from "react";

export default function LogExplorer() {

  const [logs, setLogs] =
    useState<any[]>([]);

  const [search, setSearch] =
    useState("");

  const fetchLogs =
    async () => {

      try {

        const res =
          await fetch(
            "http://localhost:8050/logs"
          );

        const data =
          await res.json();

        setLogs(
          Array.isArray(data)
            ? [...data].reverse()
            : []
        );

      } catch (err) {

        console.error(err);
      }
    };

  useEffect(() => {

    fetchLogs();

    const interval =
      setInterval(
        fetchLogs,
        2000
      );

    return () =>
      clearInterval(interval);

  }, []);

  const filteredLogs =
    logs.filter((log) =>
      JSON.stringify(log)
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );

  const severityColor =
    (
      severity: string
    ) => {

      switch (
        severity?.toLowerCase()
      ) {

        case "critical":
          return "bg-red-700";

        case "high":
          return "bg-orange-600";

        case "medium":
          return "bg-yellow-600";

        default:
          return "bg-cyan-700";
      }
    };

  return (

    <div className="
      border
      border-cyan-500
      rounded-2xl
      bg-[#050816]
      p-6
      shadow-2xl
    ">

      <div className="
        flex
        justify-between
        items-center
        mb-6
      ">

        <div>

          <h1 className="
            text-4xl
            font-bold
            text-cyan-400
          ">
            Live Log Explorer
          </h1>

          <p className="
            text-zinc-500
            mt-1
          ">
            Real-time telemetry and security events
          </p>

        </div>

        <input
          type="text"
          placeholder="Search logs..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          className="
            bg-black
            border
            border-cyan-500
            rounded-lg
            px-4
            py-2
            text-white
            w-72
            outline-none
          "
        />

      </div>

      <div className="
        overflow-x-auto
        overflow-y-auto
        max-h-[520px]
        rounded-xl
        border
        border-zinc-800
        scrollbar-thin
        scrollbar-thumb-cyan-500
        scrollbar-track-black
      ">

        <table className="
          w-full
          min-w-[900px]
          text-left
          border-collapse
        ">

          <thead className="
            sticky
            top-0
            bg-[#050816]
            z-10
          ">

            <tr className="
              text-zinc-400
              border-b
              border-zinc-800
            ">

              <th className="py-3 px-4">
                Time
              </th>

              <th className="px-4">
                Host
              </th>

              <th className="px-4">
                User
              </th>

              <th className="px-4">
                Event
              </th>

              <th className="px-4">
                Severity
              </th>

            </tr>

          </thead>

          <tbody>

            {
              filteredLogs.map(
                (
                  log,
                  index
                ) => (

                  <tr
                    key={index}
                    className="
                      border-b
                      border-zinc-900
                      hover:bg-zinc-950
                      transition
                    "
                  >

                    <td className="
                      py-4
                      px-4
                      text-cyan-400
                      font-mono
                      text-sm
                      whitespace-nowrap
                    ">
                      {
                        log.timestamp
                          ?.split(" ")[1]
                      }
                    </td>

                    <td className="
                      px-4
                      text-yellow-400
                      font-bold
                    ">
                      {log.host}
                    </td>

                    <td className="
                      px-4
                      text-zinc-300
                    ">
                      {log.user}
                    </td>

                    <td className="
                      px-4
                      text-red-300
                    ">
                      {log.message}
                    </td>

                    <td className="px-4">

                      <span className={`
                        px-3
                        py-1
                        rounded-full
                        text-xs
                        font-bold
                        text-white
                        ${severityColor(
                          log.severity
                        )}
                      `}>
                        {log.severity}
                      </span>

                    </td>

                  </tr>
                )
              )
            }

          </tbody>

        </table>

      </div>

    </div>
  );
}
