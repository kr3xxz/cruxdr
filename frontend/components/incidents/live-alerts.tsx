"use client";

import { useEffect, useState } from "react";

export default function LiveAlerts() {

  const [alerts, setAlerts] =
    useState<any[]>([]);

  useEffect(() => {

    const load = async () => {

      const res =
        await fetch(
          "http://localhost:8080/alerts"
        );

      const data =
        await res.json();

      setAlerts(data);
    };

    load();

    const interval =
      setInterval(load, 3000);

    return () =>
      clearInterval(interval);

  }, []);

  return (

    <div className="space-y-4">

      {alerts.map((alert, idx) => (

        <div
          key={idx}
          className="
            bg-yellow-950
            border
            border-yellow-500
            p-4
            rounded-lg
            text-white
          "
        >

          {JSON.stringify(alert)}

        </div>

      ))}

    </div>
  );
}
