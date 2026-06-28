"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
<<<<<<< HEAD

export function SigmaStudio() {

  const [rules, setRules] =
    useState<any[]>([]);

  const [alerts, setAlerts] =
    useState<any[]>([]);

  useEffect(() => {

    const loadData =
      async () => {

        try {

          const rulesRes =
            await fetch(
              "http://localhost:8050/rules"
            );

          const rulesData =
            await rulesRes.json();

          setRules(rulesData);

          const alertsRes =
            await fetch(
              "http://localhost:8050/alerts"
            );

          const alertsData =
            await alertsRes.json();

          setAlerts(alertsData);

        } catch (e) {

          console.error(e);
        }
      };

    loadData();

    const interval =
      setInterval(
        loadData,
        3000
      );

    return () =>
      clearInterval(interval);

  }, []);

  return (

    <div className="
      bg-zinc-900
      border
      border-zinc-800
      rounded-xl
      p-6
    ">

      <h2 className="
        text-white
        text-2xl
        font-bold
        mb-6
      ">
        Sigma Studio
      </h2>

      <div className="space-y-4">

        {rules.map(
          (
            rule,
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
              className="
                bg-slate-950
                border
                border-zinc-800
                rounded-xl
                p-5
              "
            >

              <div className="
                flex
                justify-between
                items-center
              ">

                <div>

                  <h3 className="
                    text-white
                    font-bold
                    text-lg
                  ">
                    {rule.title}
                  </h3>

                  <p className="
                    text-zinc-400
                    text-sm
                    mt-1
                  ">
                    {rule.description}
                  </p>

                </div>

                <span className="
                  text-red-400
                  font-semibold
                  uppercase
                ">
                  {rule.severity}
                </span>

=======
import { useEventStore } from "@/store/live-events";

function classifyAlert(event: any) {
  const attackType = event.attack_type || "";
  const msg = (event.message || "").toLowerCase();
  const severity = event.severity || "medium";

  const rules: Record<string, { title: string; mitre: string }> = {
    ransomware:          { title: "Ransomware Detection",           mitre: "T1486" },
    brute_force:         { title: "Brute Force Detection",          mitre: "T1110" },
    phishing:            { title: "Phishing Detection",             mitre: "T1566" },
    lateral_movement:    { title: "Lateral Movement Detection",     mitre: "T1021" },
    exfiltration:        { title: "Data Exfiltration Detection",    mitre: "T1048" },
    credential_dumping:  { title: "Credential Dumping Detection",   mitre: "T1003" },
    privilege_escalation:{ title: "Privilege Escalation Detection", mitre: "T1068" },
  };

  if (attackType && rules[attackType]) {
    return { ...rules[attackType], severity, event };
  }

  if (msg.includes("encrypt"))     return { title: "Ransomware Detection",           mitre: "T1486", severity, event };
  if (msg.includes("login") || msg.includes("failed")) return { title: "Brute Force Detection", mitre: "T1110", severity, event };
  if (msg.includes("phish"))       return { title: "Phishing Detection",             mitre: "T1566", severity, event };
  if (msg.includes("exfil") || msg.includes("transfer")) return { title: "Data Exfiltration Detection", mitre: "T1048", severity, event };
  if (msg.includes("remote") || msg.includes("psexec"))  return { title: "Lateral Movement Detection", mitre: "T1021", severity, event };
  if (msg.includes("mimikatz") || msg.includes("credential")) return { title: "Credential Dumping Detection", mitre: "T1003", severity, event };
  if (msg.includes("sudo") || msg.includes("privilege"))  return { title: "Privilege Escalation Detection", mitre: "T1068", severity, event };

  return null;
}

export function SigmaStudio() {
  const [rules, setRules] = useState<any[]>([]);
  const events = useEventStore((state) => state.events);
  const [alerts, setAlerts] = useState<any[]>([]);

  useEffect(() => {
    const loadRules = async () => {
      try {
        const res = await fetch("http://localhost:8050/rules");
        const data = await res.json();
        setRules(data);
      } catch {}
    };
    loadRules();
    const interval = setInterval(loadRules, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const seen = new Set<string>();
    const result = (events ?? [])
      .map(classifyAlert)
      .filter((a): a is NonNullable<typeof a> => {
        if (!a) return false;
        const key = a.title;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .slice(0, 100);
    setAlerts(result);
  }, [events]);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">

      <h2 className="text-white text-2xl font-bold mb-6">Sigma Studio</h2>

      <div className="space-y-4">
        {rules.map((rule, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-950 border border-zinc-800 rounded-xl p-5"
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-white font-bold text-lg">{rule.title}</h3>
                <p className="text-zinc-400 text-sm mt-1">{rule.description}</p>
>>>>>>> 1f84238 (redesign SOC interface, fix sigma→correlation pipeline, enhance UEBA analytics & MITRE heatmap)
              </div>
              <span className="text-red-400 font-semibold uppercase">{rule.severity}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-8">
<<<<<<< HEAD

        <h3 className="
          text-red-400
          text-xl
          font-semibold
          mb-4
        ">
          Triggered Alerts ({alerts.length})
        </h3>

        <div className="space-y-3">

          {alerts.map(
            (
              alert,
              index
            ) => (

              <div
                key={index}
                className="
                  bg-slate-950
                  border
                  border-red-900/20
                  rounded-lg
                  p-4
                "
              >

                <div className="
                  flex
                  justify-between
                  items-center
                ">

                  <div>

                    <p className="
                      text-white
                      font-bold
                    ">
                      {alert.title}
                    </p>

                    <p className="
                      text-zinc-400
                      text-xs
                    ">
                      {alert.event?.message}
                    </p>

                  </div>

                  <span className="
                    text-red-400
                    font-bold
                    uppercase
                  ">
                    {alert.severity}
                  </span>

=======
        <h3 className="text-red-400 text-xl font-semibold mb-4">
          Triggered Alerts ({alerts.length}) - Events in store: {events?.length ?? 0}
        </h3>

        <div className="space-y-3">
          {alerts.map((alert, index) => (
            <div
              key={index}
              className="bg-slate-950 border border-red-900/20 rounded-lg p-4"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-white font-bold">{alert.title}</p>
                  <p className="text-zinc-400 text-xs">{alert.event?.message}</p>
                  <p className="text-zinc-500 text-xs mt-1">MITRE: {alert.mitre}</p>
>>>>>>> 1f84238 (redesign SOC interface, fix sigma→correlation pipeline, enhance UEBA analytics & MITRE heatmap)
                </div>
                <span className="text-red-400 font-bold uppercase">{alert.severity}</span>
              </div>
            </div>
          ))}

          {alerts.length === 0 && (
            <div>
              <p className="text-zinc-500 text-sm">No alerts triggered yet. Launch an attack or upload telemetry.</p>
              <div className="mt-4 p-4 bg-zinc-800 rounded-lg">
                <p className="text-zinc-400 text-xs font-mono">Raw events in store ({events?.length ?? 0}):</p>
                {events?.slice(0, 10).map((ev: any, i: number) => (
                  <p key={i} className="text-zinc-500 text-xs font-mono mt-1">
                    [{ev.attack_type}] {ev.message?.substring(0, 80)}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
