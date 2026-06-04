"use client";

import { useEffect, useState } from "react";

export function KPICards() {

  const [stats, setStats] =
    useState({
      incidents: 0,
      threatScore: 0,
      techniques: 0,
      assets: 0,
    });

  const loadStats = async () => {

    try {

      const res =
        await fetch(
          "http://localhost:8030/incidents"
        );

      const incidents =
        await res.json();

      const threatScore =
        incidents.reduce(
          (score: number, incident: any) => {

            const sev =
              (
                incident.severity ||
                ""
              ).toUpperCase();

            if (sev === "CRITICAL")
              return score + 40;

            if (sev === "HIGH")
              return score + 20;

            if (sev === "MEDIUM")
              return score + 10;

            return score + 5;

          },
          0
        );

      const mitre =
        new Set(
          incidents.map(
            (i: any) => i.mitre
          )
        );

      const assets =
        new Set(
          incidents.flatMap(
            (i: any) => [
              i.host,
              i.user,
            ]
          )
        );

      setStats({
        incidents:
          incidents.length,

        threatScore,

        techniques:
          mitre.size,

        assets:
          assets.size,
      });

    } catch (err) {

      console.error(
        "KPI ERROR",
        err
      );
    }
  };

  useEffect(() => {

    loadStats();

    const interval =
      setInterval(
        loadStats,
        5000
      );

    return () =>
      clearInterval(
        interval
      );

  }, []);

  const cards = [
    {
      title:
        "Active Incidents",

      value:
        stats.incidents,

      color:
        "text-red-400",
    },

    {
      title:
        "Threat Score",

      value:
        stats.threatScore,

      color:
        "text-orange-400",
    },

    {
      title:
        "MITRE Techniques",

      value:
        stats.techniques,

      color:
        "text-cyan-400",
    },

    {
      title:
        "Assets Monitored",

      value:
        stats.assets,

      color:
        "text-green-400",
    },
  ];

  return (

    <div className="
      grid
      grid-cols-1 md:grid-cols-2 xl:grid-cols-4
      gap-4
      mb-6
    ">

      {cards.map(
        (card) => (

          <div
            key={card.title}
            className="
              bg-slate-900
              border
              border-slate-800
              rounded-xl
              p-5
            "
          >

            <div className="
              text-slate-400
              text-sm
            ">
              {card.title}
            </div>

            <div
              className={`
                text-3xl
                font-bold
                mt-2
                ${card.color}
              `}
            >
              {card.value}
            </div>

          </div>
        )
      )}

    </div>
  );
}
