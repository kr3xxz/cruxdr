"use client";

import { useEffect, useState } from "react";

export function CorrelatedIncidents() {

  const [incidents, setIncidents] =
    useState<any[]>([]);

  useEffect(() => {

    const load = async () => {

      const res =
        await fetch(
          "http://localhost:8080/incidents"
        );

      const data =
        await res.json();

      setIncidents(data);
    };

    load();

    const interval =
      setInterval(load, 3000);

    return () =>
      clearInterval(interval);

  }, []);

  return (

    <div className="space-y-4">

      <h2 className="
        text-white
        text-2xl
        font-bold
      ">
        Correlated Incidents
      </h2>

      {incidents.map((incident, idx) => (

        <div
          key={idx}
          className="
            border
            border-red-500
            bg-red-950
            rounded-lg
            p-4
            text-white
          "
        >

          <p>
            <strong>Type:</strong>
            {" "}
            {incident.incident_type}
          </p>

          <p>
            <strong>Source IP:</strong>
            {" "}
            {incident.source_ip}
          </p>

          <p>
            <strong>Severity:</strong>
            {" "}
            {incident.severity}
          </p>

          <p>
            <strong>MITRE:</strong>
            {" "}
            {incident.mitre_attack}
          </p>

          <p>
            <strong>Count:</strong>
            {" "}
            {incident.count}
          </p>

        </div>

      ))}

    </div>
  );
}
