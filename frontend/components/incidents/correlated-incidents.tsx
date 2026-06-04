"use client";

import { useEffect, useState } from "react";

export function CorrelatedIncidents() {

  const [incidents, setIncidents] = useState<any[]>([]);
  const [selected, setSelected] = useState(0);

  useEffect(() => {

    const load = async () => {

      try {

        const res = await fetch(
          "http://localhost:8030/incidents"
        );

        const data = await res.json();

        setIncidents(
          Array.isArray(data)
            ? data
            : []
        );

      } catch (err) {

        console.error(err);
      }
    };

    load();

    const interval =
      setInterval(load, 3000);

    return () =>
      clearInterval(interval);

  }, []);

  const incident =
    incidents[selected] ?? null;

  const severityColor = (
    severity: string
  ) => {

    switch (
      severity?.toLowerCase()
    ) {

      case "critical":
        return "bg-red-600";

      case "high":
        return "bg-orange-500";

      case "medium":
        return "bg-yellow-500";

      default:
        return "bg-green-500";
    }
  };

  return (

    <div className="
      bg-slate-950
      border
      border-slate-800
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
          Correlated Incidents
        </h2>

        <div className="
          bg-red-600
          text-white
          px-3
          py-1
          rounded-full
          text-sm
        ">
          {incidents.length} Incidents
        </div>

      </div>

      {incidents.length > 0 && incident && (

        <div className="mb-8">

          <input
            type="range"
            min={0}
            max={incidents.length - 1}
            value={selected}
            onChange={(e) =>
              setSelected(
                Number(
                  e.target.value
                )
              )
            }
            className="
              w-full
              mb-4
            "
          />

          <div className="
            border
            border-slate-700
            rounded-xl
            p-5
            bg-slate-900
          ">

            <div className="
              flex
              items-center
              gap-3
              mb-4
            ">

              <div
                className={`
                  h-4
                  w-4
                  rounded-full
                  ${severityColor(
                    incident.severity
                  )}
                `}
              />

              <span className="
                text-white
                text-xl
                font-bold
              ">
                {incident.title}
              </span>

            </div>

            <div className="
              grid
              grid-cols-2
              gap-4
              text-sm
            ">

              <div>
                <span className="
                  text-zinc-400
                ">
                  Severity
                </span>

                <div className="
                  text-white
                ">
                  {incident.severity}
                </div>
              </div>

              <div>
                <span className="
                  text-zinc-400
                ">
                  MITRE
                </span>

                <div className="
                  text-red-400
                ">
                  {incident.mitre}
                </div>
              </div>

              <div>
                <span className="
                  text-zinc-400
                ">
                  User
                </span>

                <div className="
                  text-white
                ">
                  {incident.user}
                </div>
              </div>

              <div>
                <span className="
                  text-zinc-400
                ">
                  Host
                </span>

                <div className="
                  text-white
                ">
                  {incident.host}
                </div>
              </div>

            </div>

          </div>

        </div>

      )}

      <div className="
        max-h-[500px]
        overflow-y-auto
        space-y-3
      ">

        {incidents.map(
          (
            incident,
            idx
          ) => (

            <div
              key={idx}
              onClick={() =>
                setSelected(idx)
              }
              className="
                cursor-pointer
                border
                border-slate-800
                bg-slate-900
                hover:bg-slate-800
                rounded-lg
                p-4
              "
            >

              <div className="
                flex
                justify-between
                items-center
              ">

                <span className="
                  text-white
                  font-semibold
                ">
                  {incident.title}
                </span>

                <span className="
                  text-red-400
                ">
                  {incident.mitre}
                </span>

              </div>

              <div className="
                text-zinc-400
                text-sm
                mt-1
              ">
                {incident.user} • {incident.host}
              </div>

            </div>
          )
        )}

      </div>

    </div>
  );
}
