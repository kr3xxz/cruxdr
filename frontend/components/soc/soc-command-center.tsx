"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useEventStore } from "@/store/live-events";
import { useSecurityStore } from "@/store/security-store";

interface AttackMeta {
  label: string;
  mitre: string;
  description: string;
}

const attacks: Record<string, AttackMeta> = {
  ransomware: {
    label: "Ransomware",
    mitre: "T1486",
    description: "File encryption via malicious macro → PowerShell → ransomware payload",
  },
  phishing: {
    label: "Phishing",
    mitre: "T1566",
    description: "Spear-phishing link delivering remote access trojan",
  },
  brute_force: {
    label: "Brute Force",
    mitre: "T1110",
    description: "10 failed authentication attempts against domain controller",
  },
  lateral_movement: {
    label: "Lateral Movement",
    mitre: "T1021",
    description: "PsExec service creation for remote code execution",
  },
  exfiltration: {
    label: "Exfiltration",
    mitre: "T1048",
    description: "Large outbound data transfer to external IP",
  },
};

type PipelineStage = "idle" | "launched" | "simulating" | "kafka" | "detecting" | "complete";

const pipelineStages: { key: PipelineStage; label: string }[] = [
  { key: "launched", label: "Attack Launched" },
  { key: "simulating", label: "Simulation Engine" },
  { key: "kafka", label: "Kafka Pipeline" },
  { key: "detecting", label: "Sigma Detection" },
  { key: "complete", label: "Alert" },
];

const stageColors: Record<PipelineStage, string> = {
  idle: "bg-zinc-800",
  launched: "bg-amber-500",
  simulating: "bg-amber-500",
  kafka: "bg-emerald-500",
  detecting: "bg-emerald-500",
  complete: "bg-red-500",
};

export function SOCCommandCenter() {
  const [logs, setLogs] = useState<string[]>([]);
  const [activeAttack, setActiveAttack] = useState<string | null>(null);
  const [pipelineStage, setPipelineStage] = useState<PipelineStage>("idle");
  const [attackLogCount, setAttackLogCount] = useState(0);

  const blockedIPs = useSecurityStore((state) => state.blockedIPs);
  const addBlockedIP = useSecurityStore((state) => state.addBlockedIP);
  const clearEvents = useEventStore((state) => state.clearEvents);
  const sourceIP = "192.168.1.100";

  const addLog = useCallback((msg: string) => {
    setLogs((prev) => [msg, ...prev].slice(0, 100));
  }, []);

  const advancePipeline = useCallback(async (attack: string, logCount: number) => {
    const delays = [400, 600, 800, 1000];

    setPipelineStage("launched");
    addLog(`[${new Date().toLocaleTimeString()}] [INIT] ${attacks[attack].label} attack sequence started`);

    await new Promise((r) => setTimeout(r, delays[0]));
    setPipelineStage("simulating");
    addLog(`[${new Date().toLocaleTimeString()}] [SIMULATE] Generating ${logCount} realistic log events (process, network, file)`);

    await new Promise((r) => setTimeout(r, delays[1]));
    setPipelineStage("kafka");
    addLog(`[${new Date().toLocaleTimeString()}] [STREAM] ${logCount} events published to Kafka topic "cruxdr-logs"`);

    await new Promise((r) => setTimeout(r, delays[2]));
    setPipelineStage("detecting");
    addLog(`[${new Date().toLocaleTimeString()}] [DETECT] Sigma engine scanning events against ${attacks[attack].mitre} rule set`);

    await new Promise((r) => setTimeout(r, delays[3]));
    setPipelineStage("complete");
    addLog(`[${new Date().toLocaleTimeString()}] [ALERT] ${attacks[attack].label} — ${attacks[attack].mitre} — severity escalated`);
    addLog(`[${new Date().toLocaleTimeString()}] [STATUS] Attack simulation complete — monitoring for IOCs`);

    setAttackLogCount(0);
    setActiveAttack(null);
    setPipelineStage("idle");
  }, [addLog]);

  const launchAttack = async (attack: string) => {
    if (blockedIPs.includes(sourceIP)) {
      addLog(`[${new Date().toLocaleTimeString()}] [BLOCKED] ${sourceIP} denied by SOAR policy — IP on deny list`);
      return;
    }

    if (activeAttack) {
      addLog(`[${new Date().toLocaleTimeString()}] [BUSY] Previous attack仍然在处理中。请等待完成`);
      return;
    }

    setActiveAttack(attack);

    try {
      addLog(`[${new Date().toLocaleTimeString()}] [LAUNCH] POST http://localhost:8010/${attack}`);

      const response = await fetch(`http://localhost:8010/${attack}`, { method: "POST" });
      const data = await response.json();

      const logCount = data.logs_generated || 0;
      setAttackLogCount(logCount);
      addLog(`[${new Date().toLocaleTimeString()}] [RESPONSE] Simulation service — ${logCount} logs generated, status: ${data.status}`);

      await advancePipeline(attack, logCount);
    } catch (err: any) {
      addLog(`[${new Date().toLocaleTimeString()}] [ERROR] ${err.message}`);
      setActiveAttack(null);
      setPipelineStage("idle");
    }
  };

  const executeResponse = async (action: string) => {
    clearEvents?.();
    addBlockedIP(sourceIP);

    const actionLabels: Record<string, string> = {
      "block-ip": "Block IP — 192.168.1.100 added to deny list",
      "isolate-host": "Isolate Host — FINANCE-PC-01 quarantined from network",
      "disable-user": "Disable User — john.doe account suspended",
    };

    addLog(`[${new Date().toLocaleTimeString()}] [SOAR] ${actionLabels[action] || action}`);
    addLog(`[${new Date().toLocaleTimeString()}] [MITIGATED] Active threats neutralized`);
  };

  return (
    <div className="glass-panel rounded-xl">

      {/* ── Header ── */}
      <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-950/60 border border-red-500/30">
            <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">SOC Command Center</h2>
            <p className="text-[11px] text-zinc-500 font-mono">Red Team Simulation &bull; SOAR Orchestration</p>
          </div>
        </div>

        {activeAttack && (
          <div className="flex items-center gap-2 rounded-md border border-amber-500/30 bg-amber-950/30 px-3 py-1.5">
            <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs font-mono text-amber-400 uppercase tracking-wider">
              {attacks[activeAttack]?.label} in progress
            </span>
          </div>
        )}
      </div>

      <div className="p-6">

        {/* ── Pipeline Status ── */}
        {activeAttack && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mb-6 rounded-lg border border-zinc-800 bg-zinc-900/60 p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Detection Pipeline</span>
              <span className="text-[10px] text-zinc-600 font-mono">
                {attacks[activeAttack]?.mitre} &bull; {attackLogCount > 0 ? `${attackLogCount} events` : "pending"}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              {pipelineStages.map((stage, i) => {
                const stageOrder: PipelineStage[] = ["idle", "launched", "simulating", "kafka", "detecting", "complete"];
                const currentIdx = stageOrder.indexOf(pipelineStage);
                const stageIdx = stageOrder.indexOf(stage.key);
                const isActive = stageIdx <= currentIdx && pipelineStage !== "idle";
                const isCurrent = stage.key === pipelineStage;

                return (
                  <div key={stage.key} className="flex-1 flex flex-col items-center gap-1.5">
                    <div className="relative w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: isActive ? "100%" : "0%" }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className={`absolute inset-y-0 left-0 rounded-full ${stageColors[stage.key]}`}
                      />
                    </div>
                    <motion.span
                      animate={{
                        color: isCurrent ? "#fbbf24" : isActive ? "#a1a1aa" : "#52525b",
                        scale: isCurrent ? 1.05 : 1,
                      }}
                      className="text-[10px] font-mono font-semibold leading-tight text-center"
                    >
                      {stage.label}
                    </motion.span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* ── Main Grid ── */}
        <div className="grid grid-cols-2 gap-6">

          {/* Attack Launchers */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-5 w-5 items-center justify-center rounded bg-red-950/60">
                <svg className="h-3 w-3 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-zinc-200 uppercase tracking-wider">Attack Launchers</h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {Object.entries(attacks).map(([key, meta]) => {
                const isRunning = activeAttack === key;
                const isDisabled = activeAttack !== null && !isRunning;
                return (
                  <motion.button
                    key={key}
                    whileHover={isDisabled ? {} : { scale: 1.02 }}
                    whileTap={isDisabled ? {} : { scale: 0.98 }}
                    onClick={() => launchAttack(key)}
                    disabled={isDisabled}
                    className={`
                      relative overflow-hidden rounded-lg border p-4 text-left transition-all
                      ${isRunning
                        ? "border-amber-500/50 bg-amber-950/40"
                        : isDisabled
                          ? "border-zinc-800 bg-zinc-900/30 opacity-40 cursor-not-allowed"
                          : "border-zinc-800 bg-zinc-900/60 hover:border-zinc-700 hover:bg-zinc-900"
                      }
                    `}
                  >
                    {isRunning && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/5 to-transparent"
                        animate={{ x: ["-100%", "100%"] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                      />
                    )}
                    <div className="relative">
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-sm font-bold uppercase tracking-wider ${isRunning ? "text-amber-300" : "text-zinc-100"}`}>
                          {meta.label}
                        </span>
                        <span className={`text-[10px] font-mono ${isRunning ? "text-amber-500" : "text-zinc-600"}`}>
                          {meta.mitre}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-500 leading-relaxed">{meta.description}</p>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* SOAR + Activity Log */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-5 w-5 items-center justify-center rounded bg-emerald-950/60">
                <svg className="h-3 w-3 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-zinc-200 uppercase tracking-wider">SOAR Response Actions</h3>
            </div>

            <div className="grid gap-2 mb-5">
              {[
                { id: "block-ip", label: "Block IP", desc: "Add 192.168.1.100 to firewall deny list", icon: "shield" },
                { id: "isolate-host", label: "Isolate Host", desc: "Quarantine FINANCE-PC-01 from network", icon: "lock" },
                { id: "disable-user", label: "Disable User", desc: "Suspend john.doe account immediately", icon: "user" },
              ].map((action) => (
                <button
                  key={action.id}
                  onClick={() => executeResponse(action.id)}
                  className="group flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900/40 px-4 py-3 text-left transition-colors hover:border-zinc-700 hover:bg-zinc-900/60"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-md border border-zinc-700 bg-zinc-800/60 group-hover:border-zinc-600">
                    {action.icon === "shield" ? (
                      <svg className="h-3.5 w-3.5 text-zinc-400 group-hover:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                      </svg>
                    ) : action.icon === "lock" ? (
                      <svg className="h-3.5 w-3.5 text-zinc-400 group-hover:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                      </svg>
                    ) : (
                      <svg className="h-3.5 w-3.5 text-zinc-400 group-hover:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-zinc-200 group-hover:text-white transition-colors">{action.label}</p>
                    <p className="text-[11px] text-zinc-500">{action.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* ── Live SOC Activity ── */}
        <div className="mt-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="flex h-5 w-5 items-center justify-center rounded bg-zinc-800">
                <svg className="h-3 w-3 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-zinc-200">Event Log</h3>
            </div>
            <span className="text-[10px] text-zinc-600 font-mono">{logs.length} entries</span>
          </div>

          <div className="h-[280px] overflow-y-auto rounded-lg border border-zinc-800 bg-black/40 p-3 font-mono text-xs leading-relaxed">
            {logs.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-zinc-700">
                <svg className="h-6 w-6 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                <p>Select an attack to begin simulation</p>
                <p className="text-zinc-800 mt-0.5">Events will stream through the detection pipeline</p>
              </div>
            ) : (
              logs.map((log, i) => {
                const isError = log.includes("[ERROR]") || log.includes("[BLOCKED]");
                const isAlert = log.includes("[ALERT]") || log.includes("[MITIGATED]");
                const isStatus = log.includes("[STATUS]");
                const isSim = log.includes("[SIMULATE]") || log.includes("[STREAM]") || log.includes("[DETECT]");
                const isSoar = log.includes("[SOAR]");
                const isInit = log.includes("[INIT]") || log.includes("[LAUNCH]") || log.includes("[RESPONSE]");

                let color = "text-zinc-400";
                if (isError) color = "text-red-400";
                else if (isAlert) color = "text-emerald-400";
                else if (isSoar) color = "text-cyan-400";
                else if (isInit) color = "text-amber-400";
                else if (isSim) color = "text-blue-400";
                else if (isStatus) color = "text-zinc-500";

                return (
                  <motion.div
                    key={logs.length - i}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`${color} py-0.5`}
                  >
                    {log}
                  </motion.div>
                );
              })
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
