"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useEventStore } from "@/store/live-events";

const TACTIC_ORDER = [
  "Initial Access",
  "Execution",
  "Persistence",
  "Privilege Escalation",
  "Defense Evasion",
  "Credential Access",
  "Discovery",
  "Lateral Movement",
  "Collection",
  "Command and Control",
  "Exfiltration",
  "Impact",
];

const mitreTechniques = [
  { id: "T1566", name: "Phishing", tactic: "Initial Access", description: "Adversaries may send phishing messages to gain access to victim systems.", severity: "high" },
  { id: "T1078", name: "Valid Accounts", tactic: "Initial Access", description: "Adversaries may steal or use credentials of existing accounts.", severity: "medium" },
  { id: "T1190", name: "Exploit Public-Facing Application", tactic: "Initial Access", description: "Attackers exploit vulnerabilities in internet-facing systems.", severity: "critical" },

  { id: "T1059", name: "Command and Scripting Interpreter", tactic: "Execution", description: "Adversaries may abuse command interpreters to execute commands.", severity: "high" },
  { id: "T1204", name: "User Execution", tactic: "Execution", description: "An adversary relies on user action to execute a malicious payload.", severity: "medium" },
  { id: "T1047", name: "Windows Management Instrumentation", tactic: "Execution", description: "Adversaries may use WMI for execution of commands.", severity: "high" },
  { id: "T1053", name: "Scheduled Task/Job", tactic: "Execution", description: "Adversaries may schedule tasks to execute malicious code.", severity: "medium" },
  { id: "T1059.001", name: "PowerShell", tactic: "Execution", description: "Adversaries may abuse PowerShell for malicious execution.", severity: "high" },

  { id: "T1547", name: "Boot or Logon Autostart Execution", tactic: "Persistence", description: "Adversaries may configure system settings to automatically execute.", severity: "medium" },
  { id: "T1543", name: "Create or Modify System Process", tactic: "Persistence", description: "Adversaries may create or modify system-level processes.", severity: "medium" },
  { id: "T1574", name: "Hijack Execution Flow", tactic: "Persistence", description: "Adversaries may execute their own malicious payloads by hijacking.", severity: "high" },
  { id: "T1505", name: "Server Software Component", tactic: "Persistence", description: "Adversaries may abuse legitimate server applications for persistence.", severity: "medium" },
  { id: "T1133", name: "External Remote Services", tactic: "Persistence", description: "Adversaries may use external remote services for persistent access.", severity: "medium" },

  { id: "T1068", name: "Abuse Elevation Control Mechanism", tactic: "Privilege Escalation", description: "Adversaries may exploit vulnerabilities to elevate privileges.", severity: "critical" },
  { id: "T1548", name: "Privilege Escalation via UAC Bypass", tactic: "Privilege Escalation", description: "Adversaries may bypass UAC to gain elevated privileges.", severity: "high" },
  { id: "T1134", name: "Access Token Manipulation", tactic: "Privilege Escalation", description: "Adversaries may manipulate access tokens to escalate privileges.", severity: "high" },
  { id: "T1055", name: "Process Injection", tactic: "Privilege Escalation", description: "Adversaries may inject code into processes to escalate privileges.", severity: "critical" },

  { id: "T1562", name: "Impair Defenses", tactic: "Defense Evasion", description: "Adversaries may disable security tools to avoid detection.", severity: "critical" },
  { id: "T1070", name: "Indicator Removal", tactic: "Defense Evasion", description: "Adversaries may clear logs to cover their tracks.", severity: "high" },
  { id: "T1036", name: "Masquerading", tactic: "Defense Evasion", description: "Adversaries may rename or manipulate file metadata to evade defenses.", severity: "medium" },
  { id: "T1027", name: "Obfuscated Files or Information", tactic: "Defense Evasion", description: "Adversaries may obfuscate payloads to bypass detection.", severity: "medium" },
  { id: "T1012", name: "Query Registry", tactic: "Discovery", description: "Adversaries may interact with the Windows Registry to gather information.", severity: "low" },

  { id: "T1110", name: "Brute Force", tactic: "Credential Access", description: "Adversaries may use brute force to gain access to accounts.", severity: "high" },
  { id: "T1003", name: "Credential Dumping", tactic: "Credential Access", description: "Adversaries may dump credentials from system memory.", severity: "critical" },
  { id: "T1003.001", name: "LSASS Memory", tactic: "Credential Access", description: "Adversaries may access LSASS memory for credential theft.", severity: "critical" },
  { id: "T1003.002", name: "SAM Registry Hive", tactic: "Credential Access", description: "Adversaries may extract credentials from the SAM registry.", severity: "critical" },
  { id: "T1003.006", name: "DCSync", tactic: "Credential Access", description: "Adversaries may use DCSync to replicate domain controller credentials.", severity: "critical" },
  { id: "T1003.008", name: "Kerberos Ticket Extraction", tactic: "Credential Access", description: "Adversaries may extract Kerberos tickets from LSASS.", severity: "high" },
  { id: "T1555", name: "Credentials from Password Stores", tactic: "Credential Access", description: "Adversaries may extract credentials from password managers.", severity: "high" },

  { id: "T1021", name: "Remote Services", tactic: "Lateral Movement", description: "Adversaries may use remote services to move laterally.", severity: "high" },
  { id: "T1021.002", name: "SMB/Windows Admin Shares", tactic: "Lateral Movement", description: "Adversaries may use SMB for lateral movement via admin shares.", severity: "high" },
  { id: "T1021.001", name: "Remote Desktop Protocol", tactic: "Lateral Movement", description: "Adversaries may use RDP to move laterally.", severity: "high" },
  { id: "T1570", name: "Lateral Tool Transfer", tactic: "Lateral Movement", description: "Adversaries may transfer tools between systems laterally.", severity: "medium" },

  { id: "T1041", name: "Exfiltration Over C2 Channel", tactic: "Exfiltration", description: "Adversaries may exfiltrate data through the command and control channel.", severity: "high" },
  { id: "T1048", name: "Exfiltration Over Alternative Protocol", tactic: "Exfiltration", description: "Adversaries may exfiltrate data using a different protocol.", severity: "high" },
  { id: "T1048.003", name: "DNS Tunneling", tactic: "Exfiltration", description: "Adversaries may use DNS queries to exfiltrate data.", severity: "high" },

  { id: "T1572", name: "Protocol Tunneling", tactic: "Command and Control", description: "Adversaries may tunnel network traffic to bypass defenses.", severity: "high" },
  { id: "T1071", name: "Application Layer Protocol", tactic: "Command and Control", description: "Adversaries may use application layer protocols for C2.", severity: "medium" },
  { id: "T1090", name: "Proxy", tactic: "Command and Control", description: "Adversaries may use a proxy to hide C2 traffic.", severity: "medium" },

  { id: "T1486", name: "Data Encrypted for Impact", tactic: "Impact", description: "Adversaries may encrypt data to disrupt availability (ransomware).", severity: "critical" },
  { id: "T1485", name: "Data Destruction", tactic: "Impact", description: "Adversaries may destroy data to disrupt operations.", severity: "critical" },
  { id: "T1490", name: "Inhibit System Recovery", tactic: "Impact", description: "Adversaries may delete backups to prevent recovery.", severity: "critical" },
];

const TACTIC_COLORS: Record<string, string> = {
  "Initial Access": "from-orange-600/20 to-orange-900/10",
  "Execution": "from-yellow-600/20 to-yellow-900/10",
  "Persistence": "from-blue-600/20 to-blue-900/10",
  "Privilege Escalation": "from-purple-600/20 to-purple-900/10",
  "Defense Evasion": "from-green-600/20 to-green-900/10",
  "Credential Access": "from-red-600/20 to-red-900/10",
  "Discovery": "from-cyan-600/20 to-cyan-900/10",
  "Lateral Movement": "from-pink-600/20 to-pink-900/10",
  "Collection": "from-indigo-600/20 to-indigo-900/10",
  "Command and Control": "from-violet-600/20 to-violet-900/10",
  "Exfiltration": "from-rose-600/20 to-rose-900/10",
  "Impact": "from-red-700/30 to-red-950/20",
};

function getHeatColor(count: number, maxCount: number): string {
  if (count === 0) return "bg-zinc-800/30 border-zinc-800/20 text-zinc-600";
  const ratio = count / maxCount;
  if (ratio >= 0.8) return "bg-red-950/50 border-red-500/40 text-red-300 shadow-sm shadow-red-500/10";
  if (ratio >= 0.5) return "bg-orange-950/40 border-orange-500/30 text-orange-300";
  if (ratio >= 0.3) return "bg-yellow-950/30 border-yellow-500/20 text-yellow-300";
  return "bg-blue-950/25 border-blue-500/15 text-blue-300";
}

function getCoverageLabel(count: number, maxCount: number): string {
  if (count === 0) return "No Detection";
  const ratio = count / maxCount;
  if (ratio >= 0.8) return "Highly Detected";
  if (ratio >= 0.5) return "Moderate Detection";
  if (ratio >= 0.3) return "Low Detection";
  return "Minimal Detection";
}

const techniqueSeverityColor: Record<string, string> = {
  critical: "text-red-400",
  high: "text-orange-400",
  medium: "text-yellow-400",
  low: "text-blue-400",
};

export function MitreHeatmap() {
  const events = useEventStore((state) => state.events);
  const [selectedTech, setSelectedTech] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [filterTactic, setFilterTactic] = useState<string | null>(null);
  const [sigmaRules, setSigmaRules] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://localhost:8050/rules")
      .then((r) => r.json())
      .then(setSigmaRules)
      .catch(() => {});
  }, []);

  const { activeTechniques, maxCount, detectedCount, coveragePercent } = useMemo(() => {
    const active = mitreTechniques.map((technique) => {
      const techId = technique.id.toLowerCase();
      const matched = (events ?? []).filter((event: any) => {
        const val = (event.mitre_technique || event.mitre || "").toLowerCase();
        return val === techId || val.startsWith(techId);
      });
      return { ...technique, count: matched.length, events: matched };
    });
    const mx = Math.max(...active.map((t) => t.count), 1);
    const detected = active.filter((t) => t.count > 0).length;
    return {
      activeTechniques: active,
      maxCount: mx,
      detectedCount: detected,
      coveragePercent: Math.round((detected / active.length) * 100),
    };
  }, [events]);

  const groupedByTactic = useMemo(() => {
    const groups: Record<string, typeof activeTechniques> = {};
    for (const tech of activeTechniques) {
      if (!groups[tech.tactic]) groups[tech.tactic] = [];
      groups[tech.tactic].push(tech);
    }
    return groups;
  }, [activeTechniques]);

  const filtered = useMemo(() => {
    return activeTechniques.filter((t) => {
      if (search && !t.id.toLowerCase().includes(search.toLowerCase()) && !t.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (filterTactic && t.tactic !== filterTactic) return false;
      return true;
    });
  }, [activeTechniques, search, filterTactic]);

  const relevantSigmaRules = selectedTech
    ? sigmaRules.filter((r) => {
        const mitre = String(r.mitre_attack || r.mitre || "");
        return mitre.toLowerCase().includes(selectedTech.id.toLowerCase());
      })
    : [];

  const sortedTactics = TACTIC_ORDER.filter((t) => groupedByTactic[t]);

  return (
    <div className="space-y-5">
      {/* ── Header Stats ── */}
      <div className="glass-panel rounded-xl p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-950/60 border border-red-500/30">
              <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17.25v-.75a3 3 0 015.25-2.25M9.75 17.25H6.75a3 3 0 01-3-3v-.75m16.5 3.75v-.75a3 3 0 00-3-3h-1.5M9.75 17.25v3m0-3H6.75m3.75 0h4.5M12 3.75a3 3 0 100 6 3 3 0 000-6z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">MITRE ATT&CK&reg; Navigator</h2>
              <p className="text-[11px] text-zinc-500 font-mono">Detection coverage &bull; technique heatmap &bull; attack surface analysis</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-white font-mono">{coveragePercent}%</div>
              <div className="text-[10px] text-zinc-600 font-mono">Coverage</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-400 font-mono">{detectedCount}</div>
              <div className="text-[10px] text-zinc-600 font-mono">Detected</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-zinc-500 font-mono">{activeTechniques.length}</div>
              <div className="text-[10px] text-zinc-600 font-mono">Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400 font-mono">{activeTechniques.length - detectedCount}</div>
              <div className="text-[10px] text-zinc-600 font-mono">Gaps</div>
            </div>
          </div>
        </div>

        {/* Coverage bar */}
        <div className="h-2 rounded-full bg-zinc-800 overflow-hidden mb-5">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${coveragePercent}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={`h-full rounded-full ${coveragePercent > 70 ? "bg-gradient-to-r from-emerald-500 to-emerald-400" : coveragePercent > 40 ? "bg-gradient-to-r from-yellow-500 to-orange-400" : "bg-gradient-to-r from-red-500 to-red-400"}`}
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 max-w-xs">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search techniques by ID or name..."
              className="w-full bg-zinc-900/80 border border-zinc-800 rounded-lg pl-9 pr-3 py-2 text-xs text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-cyan-500/40 transition-colors font-mono"
            />
          </div>
          <div className="flex gap-1.5 flex-wrap">
            <button
              onClick={() => setFilterTactic(null)}
              className={`px-2.5 py-1.5 rounded-md text-[10px] font-mono transition-all duration-200 border ${!filterTactic ? "bg-cyan-950/30 border-cyan-500/30 text-cyan-400" : "bg-zinc-900/60 border-zinc-800 text-zinc-500 hover:text-zinc-300"}`}
            >
              All Tactics
            </button>
            {sortedTactics.map((tactic) => (
              <button
                key={tactic}
                onClick={() => setFilterTactic(filterTactic === tactic ? null : tactic)}
                className={`px-2.5 py-1.5 rounded-md text-[10px] font-mono transition-all duration-200 border ${filterTactic === tactic ? "bg-cyan-950/30 border-cyan-500/30 text-cyan-400" : "bg-zinc-900/60 border-zinc-800 text-zinc-500 hover:text-zinc-300"}`}
              >
                {tactic}
              </button>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mt-4 text-[10px] font-mono text-zinc-600">
          <span>Heat:</span>
          <span className="flex items-center gap-1"><span className="h-2.5 w-5 rounded bg-red-500/40" /> High</span>
          <span className="flex items-center gap-1"><span className="h-2.5 w-5 rounded bg-orange-500/30" /> Moderate</span>
          <span className="flex items-center gap-1"><span className="h-2.5 w-5 rounded bg-yellow-500/20" /> Low</span>
          <span className="flex items-center gap-1"><span className="h-2.5 w-5 rounded bg-blue-500/15" /> Minimal</span>
          <span className="flex items-center gap-1"><span className="h-2.5 w-5 rounded bg-zinc-800/40" /> None</span>
        </div>
      </div>

      {/* ── Heatmap Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {sortedTactics.map((tactic) => {
          const techs = (filterTactic ? filtered : activeTechniques).filter((t) => t.tactic === tactic);
          if (techs.length === 0) return null;
          return (
            <div key={tactic} className={`glass-panel rounded-xl overflow-hidden border-t ${TACTIC_COLORS[tactic] || "border-zinc-800"}`}>
              <div className="px-4 py-3 border-b border-zinc-800/60 bg-zinc-900/40">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">{tactic}</h3>
                  <span className="text-[10px] font-mono text-zinc-600">{techs.filter((t) => t.count > 0).length}/{techs.length}</span>
                </div>
              </div>
              <div className="p-3 space-y-1.5">
                {techs.map((technique) => {
                  const isSelected = selectedTech?.id === technique.id;
                  return (
                    <motion.button
                      key={technique.id}
                      layout
                      onClick={() => setSelectedTech(isSelected ? null : technique)}
                      className={`w-full text-left rounded-lg border px-3 py-2 transition-all duration-200 ${isSelected ? "ring-1 ring-cyan-500/40 border-cyan-500/30" : ""} ${technique.count > 0 ? getHeatColor(technique.count, maxCount) : "bg-zinc-800/20 border-zinc-800/20"}`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className={`text-[10px] font-bold font-mono shrink-0 ${technique.count > 0 ? "text-inherit" : "text-zinc-600"}`}>{technique.id}</span>
                          <span className={`text-[11px] leading-tight truncate ${technique.count > 0 ? "text-zinc-200" : "text-zinc-600"}`}>{technique.name}</span>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          {technique.count > 0 && (
                            <span className="text-xs font-bold font-mono text-inherit">{technique.count}</span>
                          )}
                          <span className={`h-1.5 w-1.5 rounded-full ${technique.count > 0 ? "bg-red-400" : "bg-zinc-700"}`} />
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Detail Panel (Modal Overlay) ── */}
      <AnimatePresence>
        {selectedTech && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
            onClick={() => setSelectedTech(null)}
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-xl"
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto glass-panel rounded-xl border border-zinc-700/50 shadow-2xl shadow-black/40"
            >
              <div className="border-b border-zinc-800 px-6 py-4 flex items-center justify-between sticky top-0 bg-zinc-900/90 backdrop-blur-md z-10">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-950/60 border border-cyan-500/30">
                    <svg className="h-4 w-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
                    </svg>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-white">{selectedTech.id}</h3>
                      <span className="text-sm text-zinc-400 font-medium">{selectedTech.name}</span>
                    </div>
                    <p className="text-[11px] text-zinc-500 font-mono">{selectedTech.tactic}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-lg font-bold font-mono" style={{ color: selectedTech.count > 0 ? (selectedTech.count / maxCount >= 0.5 ? "#ef4444" : "#f97316") : "#71717a" }}>
                      {selectedTech.count}
                    </div>
                    <div className="text-[10px] text-zinc-600 font-mono">Events</div>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold font-mono ${techniqueSeverityColor[selectedTech.severity] || "text-zinc-500"}`}>
                      {selectedTech.severity.toUpperCase()}
                    </div>
                    <div className="text-[10px] text-zinc-600 font-mono">Severity</div>
                  </div>
                  <button
                    onClick={() => setSelectedTech(null)}
                    className="p-1.5 rounded-md hover:bg-zinc-800 text-zinc-600 hover:text-zinc-300 transition-colors"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Description & metadata */}
                <div className="lg:col-span-1 space-y-4">
                  <div>
                    <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">Description</h4>
                    <p className="text-xs text-zinc-400 leading-relaxed">{selectedTech.description}</p>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">Detection Status</h4>
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${selectedTech.count > 0 ? "bg-emerald-500" : "bg-zinc-700"}`} />
                      <span className={`text-xs font-mono ${selectedTech.count > 0 ? "text-emerald-400" : "text-zinc-600"}`}>
                        {selectedTech.count > 0 ? getCoverageLabel(selectedTech.count, maxCount) : "Not Detected"}
                      </span>
                    </div>
                  </div>
                  {selectedTech.severity && (
                    <div>
                      <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">Inherent Risk</h4>
                      <span className={`text-xs font-bold font-mono ${techniqueSeverityColor[selectedTech.severity]}`}>
                        {selectedTech.severity.toUpperCase()}
                      </span>
                    </div>
                  )}
                  {relevantSigmaRules.length > 0 && (
                    <div>
                      <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">Sigma Rules ({relevantSigmaRules.length})</h4>
                      <div className="space-y-1.5">
                        {relevantSigmaRules.slice(0, 5).map((rule, i) => (
                          <div key={i} className="flex items-center gap-2 rounded border border-zinc-800/60 bg-zinc-900/40 px-2.5 py-1.5">
                            <span className="text-[10px] font-mono text-zinc-600">{rule.title || rule.id || rule.name || "Rule"}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Related events */}
                <div className="lg:col-span-2">
                  <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-3">
                    Recent Events ({selectedTech.events?.length || 0})
                  </h4>
                  {selectedTech.events && selectedTech.events.length > 0 ? (
                    <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                      {selectedTech.events.slice(0, 20).map((ev: any, i: number) => (
                        <div key={i} className="flex items-start gap-3 rounded-lg border border-zinc-800/40 bg-zinc-900/30 p-3">
                          <span className="h-1.5 w-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="text-[11px] font-bold font-mono text-zinc-300">{ev.attack_type?.replace(/_/g, " ").toUpperCase() || "EVENT"}</span>
                              <span className="text-[10px] text-zinc-600 font-mono">{ev.mitre_technique || ev.mitre}</span>
                            </div>
                            <p className="text-[11px] text-zinc-500 truncate">{ev.message || "No message"}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-24 rounded-lg border border-dashed border-zinc-800 bg-zinc-900/20">
                      <p className="text-xs text-zinc-700 font-mono">No matching events detected for this technique</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
