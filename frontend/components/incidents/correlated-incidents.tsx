"use client";

import {
  useEffect,
  useState,
} from "react";

export function CorrelatedIncidents() {

  const [incidents, setIncidents] =
    useState<any[]>([]);

  const [selected, setSelected] =
    useState<any>(null);

  const fetchIncidents =
    async () => {

      const res =
        await fetch(
          "http://localhost:8030/incidents"
        );

      const data =
        await res.json();

      setIncidents(
        Array.isArray(data)
          ? data
          : []
      );
    };

  useEffect(() => {

    fetchIncidents();

    const interval =
      setInterval(
        fetchIncidents,
        2000
      );

    return () =>
      clearInterval(interval);

  }, []);

  return (

    <div className="grid grid-cols-3 gap-6">

      <div className="col-span-1 border border-red-500 rounded-xl bg-[#050816] p-5">

        <h2 className="text-red-400 text-3xl font-bold mb-6">
          Incidents
        </h2>

        <div className="space-y-4">

          {
            incidents.map(
              (
                incident,
                index
              ) => (

                <div
                  key={index}
                  onClick={() =>
                    setSelected(
                      incident
                    )
                  }
                  className="cursor-pointer border border-zinc-800 hover:border-red-500 rounded-lg p-4 bg-black"
                >

                  <div className="text-white font-bold">
                    {incident.title}
                  </div>

                  <div className="text-red-400 text-sm mt-2">
                    Severity:
                    {" "}
                    {incident.severity}
                  </div>

                  <div className="text-cyan-400 text-sm">
                    MITRE:
                    {" "}
                    {incident.mitre}
                  </div>

                </div>
              )
            )
          }

        </div>

      </div>

      <div className="col-span-2 border border-cyan-500 rounded-xl bg-[#050816] p-6">

        {
          selected ? (

            <div>

              <h2 className="text-cyan-400 text-4xl font-bold mb-6">
                Investigation
              </h2>

              <div className="space-y-5">

                <div>
                  <div className="text-zinc-400">
                    Host
                  </div>

                  <div className="text-white text-xl">
                    {selected.host}
                  </div>
                </div>

                <div>
                  <div className="text-zinc-400">
                    User
                  </div>

                  <div className="text-white text-xl">
                    {selected.user}
                  </div>
                </div>

                <div>
                  <div className="text-zinc-400">
                    MITRE Technique
                  </div>

                  <div className="text-red-400 text-xl">
                    {selected.mitre}
                  </div>
                </div>

                <div>

                  <div className="text-zinc-400 mb-3">
                    Timeline
                  </div>

                  <div className="space-y-3">

                    {
                      selected.timeline.map(
                        (
                          item: any,
                          idx: number
                        ) => (

                          <div
                            key={idx}
                            className="border border-zinc-800 rounded-lg p-4 bg-black"
                          >

                            <div className="text-cyan-400 font-bold">
                              {item.step}
                            </div>

                            <div className="text-zinc-300 mt-2">
                              {item.description}
                            </div>

                          </div>
                        )
                      )
                    }

                  </div>

                </div>

                <div>

                  <div className="text-zinc-400 mb-3">
                    Indicators of Compromise
                  </div>

                  <div className="flex gap-3 flex-wrap">

                    {
                      selected.iocs.map(
                        (
                          ioc: string,
                          idx: number
                        ) => (

                          <div
                            key={idx}
                            className="bg-red-700 px-4 py-2 rounded-full text-sm"
                          >
                            {ioc}
                          </div>
                        )
                      )
                    }

                  </div>

                </div>

              </div>

            </div>

          ) : (

            <div className="text-zinc-500 text-xl">
              Select an incident to investigate
            </div>
          )
        }

      </div>

    </div>
  );
}
