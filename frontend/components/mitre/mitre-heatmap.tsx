"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const mitreTechniques = [
  {
    id: "T1486",
    name: "Data Encrypted for Impact",
    tactic: "Impact",
  },
  {
    id: "T1110",
    name: "Brute Force",
    tactic: "Credential Access",
  },
  {
    id: "T1021",
    name: "Remote Services",
    tactic: "Lateral Movement",
  },
  {
    id: "T1566",
    name: "Phishing",
    tactic: "Initial Access",
  },
  {
    id: "T1041",
    name: "Exfiltration Over C2 Channel",
    tactic: "Exfiltration",
  },
  {
    id: "T1003",
    name: "Credential Dumping",
    tactic: "Credential Access",
  },
];

const ALERT_TO_MITRE: Record<string, string> = {
  "Ransomware Activity Detection": "T1486",
  "Failed Login Detection": "T1110",
  "SSH Brute Force": "T1110",
  "Lateral Movement Detection": "T1021",
  "Phishing Activity Detection": "T1566",
  "Data Exfiltration Detection": "T1041",
  "Mimikatz Credential Dumping Detection": "T1003",
};

export function MitreHeatmap() {

  const [alerts, setAlerts] =
    useState<any[]>([]);

  useEffect(() => {

    const loadAlerts =
      async () => {

        try {

          const res =
            await fetch(
              "http://localhost:8050/alerts"
            );

          const data =
            await res.json();

          setAlerts(data);

        } catch (err) {

          console.error(err);
        }
      };

    loadAlerts();

    const interval =
      setInterval(
        loadAlerts,
        3000
      );

    return () =>
      clearInterval(interval);

  }, []);

  const activeTechniques =
    mitreTechniques.map(
      (technique) => {

        const count =
          alerts.filter(
            (alert) =>
              ALERT_TO_MITRE[
                alert.title
              ] === technique.id
          ).length;

        return {
          ...technique,
          count,
        };
      }
    );

  const totalDetections =
    activeTechniques.reduce(
      (acc, item) =>
        acc + item.count,
      0
    );

  return (

    <div className="
      bg-slate-950
      border
      border-zinc-800
      rounded-xl
      p-6
    ">

      <h2 className="
        text-white
        text-4xl
        font-bold
        mb-2
      ">
        MITRE ATT&CK Heatmap
      </h2>

      <p className="
        text-zinc-400
        mb-6
      ">
        Active techniques detected
      </p>

      <div className="
        text-red-400
        text-5xl
        font-bold
        mb-10
      ">
        {totalDetections}
      </div>

      <div className="
        grid
        grid-cols-3
        gap-6
      ">

        {activeTechniques.map(
          (
            technique,
            index
          ) => (

            <motion.div
              key={index}

              initial={{
                opacity: 0,
                y: 10,
              }}

              animate={{
                opacity: 1,
                y: 0,
              }}

              className={`
                rounded-xl
                p-5
                border

                ${
                  technique.count > 0
                    ? "bg-red-950 border-red-800"
                    : "bg-zinc-950 border-zinc-800"
                }
              `}
            >

              <div className="
                flex
                justify-between
                items-center
                mb-3
              ">

                <span className="
                  text-red-400
                  font-bold
                ">
                  {technique.id}
                </span>

                <span className="
                  text-white
                  font-bold
                  text-xl
                ">
                  {technique.count}
                </span>

              </div>

              <h3 className="
                text-white
                font-semibold
                mb-2
              ">
                {technique.name}
              </h3>

              <p className="
                text-zinc-400
                text-sm
              ">
                {technique.tactic}
              </p>

            </motion.div>

          )
        )}

      </div>

    </div>
  );
}
