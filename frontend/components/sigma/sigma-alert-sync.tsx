"use client";

import { useEffect } from "react";
import { useAlertStore } from "@/store/alert-store";

export default function SigmaAlertSync() {

  const addAlert =
    useAlertStore((s) => s.addAlert);

  useEffect(() => {

    let known = new Set();

    const load = async () => {

      const res =
        await fetch(
          "http://localhost:8050/alerts"
        );

      const data =
        await res.json();

      data.forEach((alert:any) => {

        const id =
          JSON.stringify(alert);

        if (!known.has(id)) {

          known.add(id);

          addAlert(alert);
        }
      });
    };

    load();

    const interval =
      setInterval(load, 5000);

    return () =>
      clearInterval(interval);

  }, [addAlert]);

  return null;
}
