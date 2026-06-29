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

interface AttackContext {
  type: string;
  label: string;
  username: string;
  host: string;
  source_ip: string;
}

const attacks: Record<string, AttackMeta> = {
  ransomware: {
    label: "Ransomware",
    mitre: "T1486",
    description: "File encryption via malicious macro on Finance workstation",
  },
  phishing: {
    label: "Phishing",
    mitre: "T1566",
    description: "Spear-phishing link targeting Executive via Outlook",
  },
  brute_force: {
    label: "Brute Force",
    mitre: "T1110",
    description: "10 failed RDP attempts against domain controller",
  },
  lateral_movement: {
    label: "Lateral Movement",
    mitre: "T1021",
    description: "PsExec from Engineering → IT server",
  },
  exfiltration: {
    label: "Exfiltration",
    mitre: "T1048",
    description: "Large DNS-tunneled data transfer from Finance",
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

const CONFIG_USERS = [
  { value: "", label: "Auto (department random)" },
  { value: "admin", label: "admin (IT, Domain Admin)" },
  { value: "lisa.anderson", label: "lisa.anderson (IT, Security Analyst)" },
  { value: "bob.johnson", label: "bob.johnson (Finance, CFO)" },
  { value: "carol.davis", label: "carol.davis (Finance, Accountant)" },
  { value: "ceo", label: "ceo (Executive, Chief Executive)" },
  { value: "john.doe", label: "john.doe (Engineering, DevOps Lead)" },
];

const CONFIG_HOSTS = [
  { value: "", label: "Auto (department random)" },
  { value: "DC-01", label: "DC-01 (IT, Domain Controller)" },
  { value: "SIEM-01", label: "SIEM-01 (IT, Log Collector)" },
  { value: "FINANCE-PC-01", label: "FINANCE-PC-01 (Finance, Workstation)" },
  { value: "EXEC-LAP-01", label: "EXEC-LAP-01 (Executive, Laptop)" },
  { value: "DEV-OPS-01", label: "DEV-OPS-01 (Engineering, Build Server)" },
];

const CONFIG_IPS = [
  { value: "", label: "Auto (attack-default)" },
  { value: "10.0.0.45", label: "10.0.0.45 (FINANCE-PC-01)" },
  { value: "10.0.0.55", label: "10.0.0.55 (DEV-OPS-01)" },
  { value: "10.0.0.100", label: "10.0.0.100 (EXEC-LAP-01)" },
  { value: "10.0.1.5", label: "10.0.1.5 (DC-01)" },
  { value: "192.168.1.100", label: "192.168.1.100 (External Attacker)" },
  { value: "185.220.101.20", label: "185.220.101.20 (C2 Server)" },
];

type BlockedEntity = "ip" | "host" | "user";

function BlockedBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded bg-red-950/40 border border-red-500/20 px-1.5 py-0.5 text-[10px] font-mono text-red-400">
      {label}
    </span>
  );
}

export function SOCCommandCenter() {
  const [logs, setLogs] = useState<string[]>([]);
  const [activeAttack, setActiveAttack] = useState<string | null>(null);
  const [pipelineStage, setPipelineStage] = useState<PipelineStage>("idle");
  const [attackLogCount, setAttackLogCount] = useState(0);
  const [lastCtx, setLastCtx] = useState<AttackContext | null>(null);

  const [cfgUser, setCfgUser] = useState("");
  const [cfgHost, setCfgHost] = useState("");
  const [cfgIP, setCfgIP] = useState("");

  const blockedIPs = useSecurityStore((s) => s.blockedIPs);
  const blockedHosts = useSecurityStore((s) => s.blockedHosts);
  const blockedUsers = useSecurityStore((s) => s.blockedUsers);
  const addBlockedIP = useSecurityStore((s) => s.addBlockedIP);
  const addBlockedHost = useSecurityStore((s) => s.addBlockedHost);
  const addBlockedUser = useSecurityStore((s) => s.addBlockedUser);

  const ipBlocked = cfgIP && blockedIPs.includes(cfgIP);
  const hostBlocked = cfgHost && blockedHosts.includes(cfgHost);
  const userBlocked = cfgUser && blockedUsers.includes(cfgUser);
  const anyBlocked = ipBlocked || hostBlocked || userBlocked;

  const addLog = useCallback((msg: string) => {
    setLogs((prev) => [msg, ...prev].slice(0, 100));
  }, []);

  const advancePipeline = useCallback(async (attack: string, logCount: number) => {
    const delays = [400, 600, 800, 1000];
    setPipelineStage("launched");
    addLog(`[${new Date().toLocaleTimeString()}] [INIT] ${attacks[attack].label} attack sequence started`);
    await new Promise((r) => setTimeout(r, delays[0]));
    setPipelineStage("simulating");
    addLog(`[${new Date().toLocaleTimeString()}] [SIMULATE] Generating ${logCount} realistic log events`);
    await new Promise((r) => setTimeout(r, delays[1]));
    setPipelineStage("kafka");
    addLog(`[${new Date().toLocaleTimeString()}] [STREAM] ${logCount} events published to Kafka topic "cruxdr-logs"`);
    await new Promise((r) => setTimeout(r, delays[2]));
    setPipelineStage("detecting");
    addLog(`[${new Date().toLocaleTimeString()}] [DETECT] Sigma scanning events against ${attacks[attack].mitre} rule set`);
    await new Promise((r) => setTimeout(r, delays[3]));
    setPipelineStage("complete");
    addLog(`[${new Date().toLocaleTimeString()}] [ALERT] ${attacks[attack].label} — ${attacks[attack].mitre} — severity escalated`);
    addLog(`[${new Date().toLocaleTimeString()}] [STATUS] Attack simulation complete`);
    setAttackLogCount(0);
    setActiveAttack(null);
    setPipelineStage("idle");
  }, [addLog]);

  const blockedReasons = (): string[] => {
    const reasons: string[] = [];
    if (ipBlocked) reasons.push(`source IP ${cfgIP} is blocked by SOAR policy`);
    if (hostBlocked) reasons.push(`host ${cfgHost} is quarantined by SOAR policy`);
    if (userBlocked) reasons.push(`user ${cfgUser} is disabled by SOAR policy`);
    return reasons;
  };

  const launchAttack = async (attack: string) => {
    if (activeAttack) {
      addLog(`[${new Date().toLocaleTimeString()}] [BUSY] Previous attack still in progress`);
      return;
    }

    const reasons = blockedReasons();
    if (reasons.length > 0) {
      addLog(`[${new Date().toLocaleTimeString()}] [BLOCKED] Attack denied by SOAR policy:`);
      for (const r of reasons) {
        addLog(`[${new Date().toLocaleTimeString()}] [BLOCKED]   → ${r}`);
      }
      return;
    }

    setActiveAttack(attack);
    try {
      const body: Record<string, string> = {};
      if (cfgUser) body.username = cfgUser;
      if (cfgHost) body.host = cfgHost;
      if (cfgIP) body.source_ip = cfgIP;

      const desc = [cfgUser || "auto", cfgHost || "auto", cfgIP || "auto"].join(" · ");
      addLog(`[${new Date().toLocaleTimeString()}] [LAUNCH] POST /${attack} (${desc})`);

      const response = await fetch(`http://localhost:8010/${attack}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await response.json();

      const logCount = data.logs_generated || 0;
      setAttackLogCount(logCount);
      addLog(`[${new Date().toLocaleTimeString()}] [RESPONSE] ${logCount} logs — ${data.username} @ ${data.host} (${data.source_ip})`);

      setLastCtx({
        type: attack,
        label: attacks[attack].label,
        username: data.username || "unknown",
        host: data.host || "unknown",
        source_ip: data.source_ip || "unknown",
      });

      await advancePipeline(attack, logCount);
    } catch (err: any) {
      addLog(`[${new Date().toLocaleTimeString()}] [ERROR] ${err.message}`);
      setActiveAttack(null);
      setPipelineStage("idle");
    }
  };

  const executeResponse = async (action: string) => {
    const ctx = lastCtx;
    if (!ctx) {
      addLog(`[${new Date().toLocaleTimeString()}] [SOAR WARN] Launch an attack first`);
      return;
    }

    const blocked: BlockedEntity[] = [];
    const labels: Record<string, string> = {
      "block-ip": `Block IP — ${ctx.source_ip} added to deny list`,
      "isolate-host": `Isolate Host — ${ctx.host} quarantined from network`,
      "disable-user": `Disable User — ${ctx.username} account suspended`,
    };
    const targets: Record<string, string> = {
      "block-ip": ctx.source_ip,
      "isolate-host": ctx.host,
      "disable-user": ctx.username,
    };

    if (action === "block-ip") { addBlockedIP(ctx.source_ip); blocked.push("ip"); }
    if (action === "isolate-host") { addBlockedHost(ctx.host); blocked.push("host"); }
    if (action === "disable-user") { addBlockedUser(ctx.username); blocked.push("user"); }

    try {
      await fetch("http://localhost:8061/responses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          target: targets[action],
          timestamp: new Date().toISOString(),
          attack_type: ctx.type,
          title: `${ctx.label} — ${ctx.username} @ ${ctx.host}`,
          user: ctx.username,
          host: ctx.host,
          source_ip: ctx.source_ip,
          iocs: [ctx.source_ip],
        }),
      });
      addLog(`[${new Date().toLocaleTimeString()}] [SOAR] ${labels[action]}`);
      addLog(`[${new Date().toLocaleTimeString()}] [MITIGATED] Active threats neutralized`);
    } catch (err: any) {
      addLog(`[${new Date().toLocaleTimeString()}] [SOAR ERROR] ${err.message}`);
    }
  };

  const soarActions = [
    {
      id: "block-ip",
      label: "Block IP",
      desc: lastCtx ? `Add ${lastCtx.source_ip} to firewall deny list` : "Launch attack first",
      icon: "shield",
    },
    {
      id: "isolate-host",
      label: "Isolate Host",
      desc: lastCtx ? `Quarantine ${lastCtx.host} from network` : "Launch attack first",
      icon: "lock",
    },
    {
      id: "disable-user",
      label: "Disable User",
      desc: lastCtx ? `Suspend ${lastCtx.username} account` : "Launch attack first",
      icon: "user",
    },
  ];

  const selectClass = "w-full rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-xs text-zinc-300 font-mono focus:border-zinc-600 focus:outline-none cursor-pointer appearance-none";

  return (
    <div className="glass-panel rounded-xl">
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
        <div className="flex items-center gap-3">
          {(blockedIPs.length > 0 || blockedHosts.length > 0 || blockedUsers.length > 0) && (
            <div className="flex items-center gap-1.5 rounded-md border border-red-500/20 bg-red-950/30 px-2.5 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
              <span className="text-[10px] font-mono text-red-400">
                {blockedIPs.length + blockedHosts.length + blockedUsers.length} blocked
              </span>
            </div>
          )}
          {lastCtx && !activeAttack && (
            <div className="flex items-center gap-2 rounded-md border border-zinc-700/50 bg-zinc-800/40 px-3 py-1.5">
              <span className="h-2 w-2 rounded-full bg-zinc-500" />
              <span className="text-[10px] font-mono text-zinc-400">{lastCtx.label} &middot; {lastCtx.username} @ {lastCtx.host}</span>
            </div>
          )}
          {activeAttack && (
            <div className="flex items-center gap-2 rounded-md border border-amber-500/30 bg-amber-950/30 px-3 py-1.5">
              <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-xs font-mono text-amber-400">{attacks[activeAttack]?.label} in progress</span>
            </div>
          )}
        </div>
      </div>

      <div className="p-6">
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
              {pipelineStages.map((stage) => {
                const order: PipelineStage[] = ["idle", "launched", "simulating", "kafka", "detecting", "complete"];
                const ci = order.indexOf(pipelineStage);
                const si = order.indexOf(stage.key);
                const active = si <= ci && pipelineStage !== "idle";
                const current = stage.key === pipelineStage;
                return (
                  <div key={stage.key} className="flex-1 flex flex-col items-center gap-1.5">
                    <div className="relative w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: active ? "100%" : "0%" }}
                        transition={{ duration: 0.4 }}
                        className={`absolute inset-y-0 left-0 rounded-full ${stageColors[stage.key]}`}
                      />
                    </div>
                    <motion.span
                      animate={{ color: current ? "#fbbf24" : active ? "#a1a1aa" : "#52525b", scale: current ? 1.05 : 1 }}
                      className="text-[10px] font-mono font-semibold text-center"
                    >
                      {stage.label}
                    </motion.span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-2 gap-6">
          <div>
            {/* ── Attack Configuration ── */}
            <div className="mb-4 rounded-lg border border-zinc-800/80 bg-zinc-900/40 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-5 w-5 items-center justify-center rounded bg-zinc-800">
                    <svg className="h-3 w-3 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-semibold text-zinc-200">Attack Configuration</h3>
                </div>
                {anyBlocked && (
                  <div className="flex items-center gap-1 rounded border border-red-500/30 bg-red-950/30 px-2 py-0.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-[9px] font-mono text-red-400">SOAR ENFORCED</span>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-mono text-zinc-600 mb-1.5 uppercase tracking-wider">User</label>
                  <select
                    value={cfgUser}
                    onChange={(e) => setCfgUser(e.target.value)}
                    className={`${selectClass} ${cfgUser && blockedUsers.includes(cfgUser) ? "border-red-500/40 text-red-400" : ""}`}
                  >
                    {CONFIG_USERS.map((u) => (
                      <option key={u.value} value={u.value}>{u.label}</option>
                    ))}
                  </select>
                  {cfgUser && blockedUsers.includes(cfgUser) && (
                    <p className="mt-0.5 text-[10px] text-red-500 font-mono">disabled by SOAR</p>
                  )}
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-zinc-600 mb-1.5 uppercase tracking-wider">Host</label>
                  <select
                    value={cfgHost}
                    onChange={(e) => setCfgHost(e.target.value)}
                    className={`${selectClass} ${cfgHost && blockedHosts.includes(cfgHost) ? "border-red-500/40 text-red-400" : ""}`}
                  >
                    {CONFIG_HOSTS.map((h) => (
                      <option key={h.value} value={h.value}>{h.label}</option>
                    ))}
                  </select>
                  {cfgHost && blockedHosts.includes(cfgHost) && (
                    <p className="mt-0.5 text-[10px] text-red-500 font-mono">quarantined by SOAR</p>
                  )}
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-zinc-600 mb-1.5 uppercase tracking-wider">Source IP</label>
                  <select
                    value={cfgIP}
                    onChange={(e) => setCfgIP(e.target.value)}
                    className={`${selectClass} ${cfgIP && blockedIPs.includes(cfgIP) ? "border-red-500/40 text-red-400" : ""}`}
                  >
                    {CONFIG_IPS.map((ip) => (
                      <option key={ip.value} value={ip.value}>{ip.label}</option>
                    ))}
                  </select>
                  {cfgIP && blockedIPs.includes(cfgIP) && (
                    <p className="mt-0.5 text-[10px] text-red-500 font-mono">blocked by SOAR</p>
                  )}
                </div>
              </div>
              {(blockedIPs.length > 0 || blockedHosts.length > 0 || blockedUsers.length > 0) && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {blockedIPs.map((ip) => <BlockedBadge key={`ip-${ip}`} label={ip} />)}
                  {blockedHosts.map((h) => <BlockedBadge key={`host-${h}`} label={`host:${h}`} />)}
                  {blockedUsers.map((u) => <BlockedBadge key={`user-${u}`} label={`user:${u}`} />)}
                </div>
              )}
            </div>

            {/* ── Attack Launchers ── */}
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
                const running = activeAttack === key;
                const disabled = activeAttack !== null && !running;
                return (
                  <motion.button
                    key={key}
                    whileHover={disabled ? {} : { scale: 1.02 }}
                    whileTap={disabled ? {} : { scale: 0.98 }}
                    onClick={() => launchAttack(key)}
                    disabled={disabled}
                    className={`relative overflow-hidden rounded-lg border p-4 text-left transition-all ${
                      running
                        ? "border-amber-500/50 bg-amber-950/40"
                        : disabled
                          ? "border-zinc-800 bg-zinc-900/30 opacity-40 cursor-not-allowed"
                          : anyBlocked
                            ? "border-red-500/30 bg-red-950/20 hover:border-red-500/40"
                            : "border-zinc-800 bg-zinc-900/60 hover:border-zinc-700 hover:bg-zinc-900"
                    }`}
                  >
                    {running && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/5 to-transparent"
                        animate={{ x: ["-100%", "100%"] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                      />
                    )}
                    <div className="relative">
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-sm font-bold uppercase tracking-wider ${running ? "text-amber-300" : "text-zinc-100"}`}>
                          {meta.label}
                        </span>
                        <span className={`text-[10px] font-mono ${running ? "text-amber-500" : "text-zinc-600"}`}>
                          {meta.mitre}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-500 leading-relaxed">{meta.description}</p>
                      {anyBlocked && !running && (
                        <div className="mt-1.5 flex flex-col gap-0.5 text-[10px] text-red-400 font-mono">
                          {ipBlocked && <span>⛔ IP blocked by SOAR policy</span>}
                          {hostBlocked && <span>⛔ Host quarantined by SOAR</span>}
                          {userBlocked && <span>⛔ User disabled by SOAR</span>}
                        </div>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

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
              {soarActions.map((action) => {
                const disabled = !lastCtx;
                return (
                  <button
                    key={action.id}
                    onClick={() => executeResponse(action.id)}
                    disabled={disabled}
                    className={`group flex items-center gap-3 rounded-lg border px-4 py-3 text-left transition-colors ${
                      disabled
                        ? "border-zinc-800/50 bg-zinc-900/20 opacity-40 cursor-not-allowed"
                        : "border-zinc-800 bg-zinc-900/40 hover:border-zinc-700 hover:bg-zinc-900/60"
                    }`}
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
                );
              })}
            </div>
          </div>
        </div>

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
                <p>Configure user, host & IP above, then launch an attack</p>
                <p className="text-zinc-800 mt-0.5">SOAR actions appear after an attack completes</p>
              </div>
            ) : (
              logs.map((log, i) => {
                const isBlocked = log.includes("[BLOCKED]");
                const isError = log.includes("[ERROR]") || log.includes("[SOAR WARN]");
                const isAlert = log.includes("[ALERT]") || log.includes("[MITIGATED]");
                const isStatus = log.includes("[STATUS]");
                const isSim = log.includes("[SIMULATE]") || log.includes("[STREAM]") || log.includes("[DETECT]");
                const isSoar = log.includes("[SOAR]");
                const isInit = log.includes("[INIT]") || log.includes("[LAUNCH]") || log.includes("[RESPONSE]");

                let color = "text-zinc-400";
                if (isBlocked) color = "text-red-400 font-bold";
                else if (isError) color = "text-red-400";
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
