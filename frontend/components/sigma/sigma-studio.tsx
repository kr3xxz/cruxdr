"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useEventStore } from "@/store/live-events";
import { useUIStore } from "@/store/ui-store";
import { SectionHeader } from "@/components/ui/section-header";
import { SeverityPill } from "@/components/ui/severity-badge";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.04 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

function classifyAlert(event: any) {
  const attackType = event.attack_type || "";
  const msg = (event.message || "").toLowerCase();
  const severity = event.severity || "medium";

  const rules: Record<string, { title: string; mitre: string }> = {
    ransomware:          { title: "Ransomware Detection",              mitre: "T1486" },
    brute_force:         { title: "Brute Force Detection",             mitre: "T1110" },
    phishing:            { title: "Phishing Detection",                mitre: "T1566" },
    lateral_movement:    { title: "Lateral Movement Detection",        mitre: "T1021" },
    exfiltration:        { title: "Data Exfiltration Detection",       mitre: "T1048" },
    credential_dumping:  { title: "Credential Dumping Detection",      mitre: "T1003" },
    privilege_escalation:{ title: "Privilege Escalation Detection",    mitre: "T1068" },
    scheduled_task:      { title: "Scheduled Task Persistence",        mitre: "T1053.005" },
    malicious_file_execution: { title: "Malicious File Execution Detection", mitre: "T1204.002" },
    local_admin_creation: { title: "Local Admin Account Creation via Net.EXE", mitre: "T1136.001" },
    impact:              { title: "Impact Detection",                  mitre: "T1486" },
    execution:           { title: "Execution Detection",               mitre: "T1204" },
    persistence:         { title: "Persistence Detection",             mitre: "T1547" },
    defense_evasion:     { title: "Defense Evasion Detection",         mitre: "T1562" },
    discovery:           { title: "Discovery Detection",               mitre: "T1087" },
    collection:          { title: "Collection Detection",              mitre: "T1005" },
    command_and_control: { title: "C2 Communication Detection",       mitre: "T1071" },
  };

  if (attackType && rules[attackType]) {
    return { ...rules[attackType], severity, event };
  }

  if (msg.includes("encrypt"))      return { title: "Ransomware Detection",           mitre: "T1486",    severity, event };
  if (msg.includes("download") || msg.includes("backdoor")) return { title: "Malicious File Execution Detection", mitre: "T1204.002", severity, event };
  if (msg.includes("login") || msg.includes("failed")) return { title: "Brute Force Detection", mitre: "T1110", severity, event };
  if (msg.includes("phish"))        return { title: "Phishing Detection",             mitre: "T1566",    severity, event };
  if (msg.includes("exfil") || msg.includes("transfer")) return { title: "Data Exfiltration Detection", mitre: "T1048", severity, event };
  if (msg.includes("remote") || msg.includes("psexec")) return { title: "Lateral Movement Detection", mitre: "T1021", severity, event };
  if (msg.includes("mimikatz") || msg.includes("credential")) return { title: "Credential Dumping Detection", mitre: "T1003", severity, event };
  if (msg.includes("sudo") || msg.includes("privilege")) return { title: "Privilege Escalation Detection", mitre: "T1068", severity, event };
  if (msg.includes("scheduled") || msg.includes("task") || msg.includes("schtasks")) return { title: "Scheduled Task Persistence", mitre: "T1053.005", severity, event };
  if (msg.includes("ransom"))       return { title: "Ransomware Detection",           mitre: "T1486",    severity, event };
  if (msg.includes("powershell") || msg.includes("ps1")) return { title: "Malicious PowerShell Remote Download", mitre: "T1059.001", severity, event };
  if (msg.includes("outlook") || msg.includes("email") || msg.includes("mail")) return { title: "Phishing Detection", mitre: "T1566", severity, event };
  if (msg.includes("dns") || msg.includes("tunnel")) return { title: "Data Exfiltration via DNS Tunneling", mitre: "T1048.003", severity, event };
  if (msg.includes("smb") || msg.includes("admin share")) return { title: "SMB Admin Share Access for Lateral Movement", mitre: "T1021.002", severity, event };
  if (msg.includes("rdp") || msg.includes("3389")) return { title: "RDP Brute Force Authentication Attempts", mitre: "T1110", severity, event };
  if (msg.includes("wmi") || msg.includes("win32")) return { title: "WMI Process Creation via Win32_Process", mitre: "T1047", severity, event };
  if (msg.includes("lsass") || msg.includes("procdump")) return { title: "LSASS Memory Dumping via procdump.exe", mitre: "T1003.001", severity, event };

  const sev = (severity + "").toLowerCase();
  if (attackType && !rules[attackType] && (sev === "critical" || sev === "high")) {
    return {
      title: (attackType.replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase()) + " Detection"),
      mitre: event.mitre_technique || "",
      severity,
      event,
    };
  }
  if (!attackType && event.mitre_technique) {
    return { title: `Technique ${event.mitre_technique} Detected`, mitre: event.mitre_technique, severity, event };
  }

  return null;
}

export function SigmaStudio() {
  const [rules, setRules] = useState<any[]>([]);
  const events = useEventStore((state) => state.events);
  const [alerts, setAlerts] = useState<any[]>([]);
  const { setActiveTab } = useUIStore();

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
    const result = (events ?? [])
      .map(classifyAlert)
      .filter((a): a is NonNullable<typeof a> => a !== null)
      .slice(0, 100);
    setAlerts(result);
  }, [events]);

  return (
    <div className="glass-panel rounded-xl overflow-hidden">
      <div className="border-b border-zinc-800/60 px-6 py-4">
        <SectionHeader
          title="Sigma Studio"
          subtitle={`${rules.length} rules loaded`}
          icon={
            <svg className="h-4 w-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
            </svg>
          }
        />
      </div>

      <div className="p-6">
        <div className="max-h-[300px] overflow-y-auto space-y-3 pr-1">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-3"
          >
            {rules.map((rule, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="card-depth rounded-xl p-5 group"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="h-2 w-2 rounded-full bg-cyan-500/60" />
                      <h3 className="text-white font-bold text-sm">{rule.title}</h3>
                    </div>
                    <p className="text-zinc-400 text-xs mt-1">{rule.description}</p>
                  </div>
                  <SeverityPill severity={rule.severity} />
                </div>
              </motion.div>
            ))}
            {rules.length === 0 && (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <svg className="h-8 w-8 text-zinc-700 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                </svg>
                <p className="text-sm text-zinc-600 font-mono">No rules loaded. Upload Sigma rules in Settings.</p>
              </div>
            )}
          </motion.div>
        </div>

        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-amber-400 uppercase tracking-[0.12em]">
              Triggered Alerts ({alerts.length})
            </h3>
            <span className="text-[10px] text-zinc-500 font-mono">{events?.length ?? 0} events in store</span>
          </div>

          <div className="max-h-[400px] overflow-y-auto space-y-2 pr-1">
            <AnimatePresence>
              {alerts.map((alert, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="flex items-start justify-between gap-4 rounded-lg border border-red-900/20 bg-red-950/10 p-4 hover:border-red-800/30 hover:bg-red-950/20 transition-all duration-200 group"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                      <p className="text-sm font-bold text-white">{alert.title}</p>
                    </div>
                    <p className="text-xs text-zinc-400 mt-0.5">{alert.event?.message}</p>
                    <p className="text-[10px] text-violet-400/70 mt-1 font-mono">MITRE: {alert.mitre}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <SeverityPill severity={alert.severity} />
                    <button
                      onClick={() => setActiveTab("incidents")}
                      className="text-[10px] text-zinc-600 font-mono hover:text-cyan-400 transition-colors whitespace-nowrap"
                    >
                      View →
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {alerts.length === 0 && (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <svg className="h-8 w-8 text-zinc-700 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
                <p className="text-sm text-zinc-600 font-mono">No alerts triggered yet.</p>
                <p className="text-[10px] text-zinc-700 mt-1 font-mono">Upload telemetry or run an attack simulation</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
