"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
<<<<<<< HEAD

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
=======
import { useEventStore } from "@/store/live-events";

const mitreTechniques = [
  { id: "T1486", name: "Data Encrypted for Impact", tactic: "Impact" },
  { id: "T1110", name: "Brute Force", tactic: "Credential Access" },
  { id: "T1021", name: "Remote Services", tactic: "Lateral Movement" },
  { id: "T1003", name: "Credential Dumping", tactic: "Credential Access" },
  { id: "T1566", name: "Phishing", tactic: "Initial Access" },
  { id: "T1068", name: "Privilege Escalation", tactic: "Privilege Escalation" },
  { id: "T1048", name: "Exfiltration Over Alternative Protocol", tactic: "Exfiltration" },
  { id: "T1059", name: "Command and Scripting Interpreter", tactic: "Execution" },
  { id: "T1078", name: "Valid Accounts", tactic: "Defense Evasion" },
  { id: "T1047", name: "Windows Management Instrumentation", tactic: "Execution" },
  { id: "T1053", name: "Scheduled Task/Job", tactic: "Persistence" },
  { id: "T1547", name: "Boot or Logon Autostart Execution", tactic: "Persistence" },
  { id: "T1543", name: "Create or Modify System Process", tactic: "Persistence" },
  { id: "T1548", name: "Abuse Elevation Control Mechanism", tactic: "Privilege Escalation" },
  { id: "T1134", name: "Access Token Manipulation", tactic: "Privilege Escalation" },
  { id: "T1574", name: "Hijack Execution Flow", tactic: "Persistence" },
  { id: "T1562", name: "Impair Defenses", tactic: "Defense Evasion" },
  { id: "T1055", name: "Process Injection", tactic: "Defense Evasion" },
  { id: "T1070", name: "Indicator Removal", tactic: "Defense Evasion" },
  { id: "T1572", name: "Protocol Tunneling", tactic: "Command and Control" },
>>>>>>> 1f84238 (redesign SOC interface, fix sigma→correlation pipeline, enhance UEBA analytics & MITRE heatmap)
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
  const events = useEventStore((state) => state.events);

<<<<<<< HEAD
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
=======
  const activeTechniques = mitreTechniques.map((technique) => {
    const techId = technique.id.toLowerCase();
    const matched = (events ?? []).filter((event: any) => {
      const val = (event.mitre_technique || event.mitre || "").toLowerCase();
      return val === techId || val.startsWith(techId + ".");
    });
>>>>>>> 1f84238 (redesign SOC interface, fix sigma→correlation pipeline, enhance UEBA analytics & MITRE heatmap)

    return {
      ...technique,
      count: matched.length,
    };
  });

<<<<<<< HEAD
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
=======
  const totalDetections = activeTechniques.reduce(
    (acc, item) => acc + item.count,
    0
  );

  const detected = activeTechniques.filter((t) => t.count > 0);
  const undetected = activeTechniques.filter((t) => t.count === 0);

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950/80 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-950/60 border border-red-500/30">
            <svg className="h-4 w-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17.25v-.75a3 3 0 015.25-2.25M9.75 17.25H6.75a3 3 0 01-3-3v-.75m16.5 3.75v-.75a3 3 0 00-3-3h-1.5M9.75 17.25v3m0-3H6.75m3.75 0h4.5M12 3.75a3 3 0 100 6 3 3 0 000-6z" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">MITRE ATT&CK Heatmap</h2>
            <p className="text-[11px] text-zinc-500 font-mono">Active techniques detected &bull; {totalDetections} matches</p>
          </div>
        </div>
        <div className="text-3xl font-bold text-red-400 font-mono">{totalDetections}</div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {detected.map((technique, index) => (
          <motion.div
            key={technique.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
            className="rounded-lg border border-red-800/40 bg-red-950/20 p-3 hover:bg-red-950/40 transition-colors"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold text-red-400 font-mono">{technique.id}</span>
              <span className="text-sm font-bold text-white font-mono">{technique.count}</span>
            </div>
            <h3 className="text-xs text-zinc-300 font-medium leading-tight">{technique.name}</h3>
            <p className="text-[10px] text-zinc-600 mt-1 font-mono">{technique.tactic}</p>
          </motion.div>
        ))}
        {undetected.length > 0 && (
          <details className="col-span-full mt-2">
            <summary className="text-[11px] text-zinc-600 cursor-pointer hover:text-zinc-400 font-mono">
              {undetected.length} inactive techniques
            </summary>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 mt-2">
              {undetected.map((technique) => (
                <div key={technique.id} className="rounded border border-zinc-800/40 bg-zinc-950/20 p-2 opacity-50">
                  <div className="text-[10px] font-bold text-zinc-600 font-mono">{technique.id}</div>
                  <div className="text-[10px] text-zinc-700">{technique.name}</div>
                </div>
              ))}
            </div>
          </details>
>>>>>>> 1f84238 (redesign SOC interface, fix sigma→correlation pipeline, enhance UEBA analytics & MITRE heatmap)
        )}
      </div>
    </div>
  );
}
