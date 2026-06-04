"use client";

import { useEffect, useState } from "react";

export default function LiveSigmaAlerts() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const load = async () => {
      const res = await fetch("http://localhost:8050/alerts");
      const data = await res.json();
      setAlerts(data.reverse());
    };

    load();

    const interval = setInterval(load, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="rounded-xl border p-4">
      <h2 className="text-lg font-bold mb-4">
        Sigma Alerts
      </h2>

      <div className="space-y-2">
        {alerts.map((alert: any, idx) => (
          <div
            key={idx}
            className="border rounded p-3"
          >
            <div className="font-semibold">
              {alert.title}
            </div>

            <div className="text-sm">
              Severity: {alert.severity}
            </div>

            <div className="text-xs opacity-70">
              {alert.event?.raw}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
