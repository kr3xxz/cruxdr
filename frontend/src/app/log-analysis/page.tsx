"use client";

import { useState } from "react";

export default function LogAnalysisPage() {

  const [alerts, setAlerts] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);

  const uploadFile = async (e: any) => {

    const file = e.target.files[0];

    if (!file) return;

    const formData = new FormData();

    formData.append("file", file);

    const response = await fetch("http://localhost:8080/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    setAlerts(data.alerts || []);
    setEvents(data.events || []);
  };

  return (
    <div className="p-6">

      <h1 className="text-3xl font-bold mb-6">
        CruxDR Telemetry Analysis
      </h1>

      <input
        type="file"
        onChange={uploadFile}
        className="mb-6"
      />

      <div className="mb-8">

        <h2 className="text-2xl font-semibold mb-4">
          Alerts
        </h2>

        {alerts.map((alert, idx) => (
          <div
            key={idx}
            className="border border-red-500 bg-red-100 p-4 rounded mb-4"
          >
            <p><strong>Type:</strong> {alert.alert_type}</p>
            <p><strong>Severity:</strong> {alert.severity}</p>
            <p><strong>Source IP:</strong> {alert.source_ip}</p>
            <p><strong>MITRE:</strong> {alert.mitre_attack}</p>
          </div>
        ))}

      </div>

      <div>

        <h2 className="text-2xl font-semibold mb-4">
          Parsed Events
        </h2>

        {events.map((event, idx) => (
          <div
            key={idx}
            className="border p-3 rounded mb-2"
          >
            <p>{event.raw}</p>
          </div>
        ))}

      </div>

    </div>
  );
}
