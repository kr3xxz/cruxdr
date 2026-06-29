"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import SigmaUpload from "@/components/sigma/sigma-upload";
import LogExplorer from "@/components/logs/log-explorer";
import { Sidebar } from "@/components/layout/sidebar";
import { AIPanel } from "@/components/incidents/ai-panel";
import { SOCCommandCenter } from "@/components/soc/soc-command-center";
import { ThreatTrends } from "@/components/analytics/threat-trends";
import { MitreHeatmap } from "@/components/mitre/mitre-heatmap";
import { CorrelatedIncidents } from "@/components/incidents/correlated-incidents";
import ThreatHunting from "@/components/hunting/threat-hunting";
import { SigmaStudio } from "@/components/sigma/sigma-studio";
import { UEBADashboard } from "@/components/ueba/ueba-dashboard";
import { LiveAttackGraph } from "@/components/graph/live-attack-graph";
import { KPICards } from "@/components/dashboard/kpi-cards";

import { useLiveEvents } from "@/hooks/use-live-events";
import { useEventStore } from "@/store/live-events";
import { useAlertStore } from "@/store/alert-store";
import { useSecurityStore } from "@/store/security-store";
import { useGraphStore } from "@/store/graph-store";
import { useUIStore } from "@/store/ui-store";
import { SectionHeader } from "@/components/ui/section-header";
import { SeverityBadge } from "@/components/ui/severity-badge";

const TAB_META: Record<string, { title: string; subtitle: string }> = {
  dashboard: { title: "Security Overview", subtitle: "Real-time threat monitoring & security posture" },
  alerts: { title: "Detection Center", subtitle: "Sigma rule engine & triggered alerts" },
  incidents: { title: "Incident Response", subtitle: "Correlated incidents & investigation workspace" },
  "threat-hunting": { title: "Threat Hunting", subtitle: "Proactive search for IOCs and suspicious activity" },
  mitre: { title: "MITRE ATT&CK", subtitle: "Adversary technique coverage & detection mapping" },
  "ai-assistant": { title: "AI SOC Assistant", subtitle: "AI-powered threat analysis & recommendations" },
  settings: { title: "Settings", subtitle: "Platform configuration & rule management" },
};

const TAB_ICONS: Record<string, React.ReactNode> = {
  dashboard: (
    <svg className="h-5 w-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
    </svg>
  ),
  alerts: (
    <svg className="h-5 w-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
    </svg>
  ),
  incidents: (
    <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
  ),
  "threat-hunting": (
    <svg className="h-5 w-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
  ),
  mitre: (
    <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17.25v-.75a3 3 0 015.25-2.25M9.75 17.25H6.75a3 3 0 01-3-3v-.75m16.5 3.75v-.75a3 3 0 00-3-3h-1.5M9.75 17.25v3m0-3H6.75m3.75 0h4.5M12 3.75a3 3 0 100 6 3 3 0 000-6z" />
    </svg>
  ),
  "ai-assistant": (
    <svg className="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
    </svg>
  ),
  settings: (
    <svg className="h-5 w-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
};

const pageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2, ease: [0.25, 0.1, 0.25, 1] } },
};

export default function DashboardPage() {
  useLiveEvents();
  const { activeTab } = useUIStore();

  const addEvent = useEventStore((state) => state.addEvent);
  const storedEvents = useEventStore((state) => state.events);
  const [uploadStatus, setUploadStatus] = useState("");
  const [storeCount, setStoreCount] = useState(0);

  const numCritical = storedEvents.filter((e: any) => e.severity === "critical").length;
  const numHigh = storedEvents.filter((e: any) => e.severity === "high").length;

  useEffect(() => {
    setStoreCount(storedEvents.length);
  }, [storedEvents]);

  const clearEvents = useEventStore((state) => state.clearEvents);
  const clearAlerts = useAlertStore((state) => state.clearAlerts);
  const clearBlockedIPs = useSecurityStore((state) => state.clearBlockedIPs);
  const clearGraph = useGraphStore((state) => state.clearGraph);

  const clearAll = () => {
    clearEvents();
    clearAlerts();
    clearBlockedIPs();
    clearGraph();
    fetch("http://localhost:8030/incidents", { method: "DELETE" }).catch(() => {});
    fetch("http://localhost:8030/graph", { method: "DELETE" }).catch(() => {});
    fetch("http://localhost:8080/logs", { method: "DELETE" }).catch(() => {});
    fetch("http://localhost:8060/reset", { method: "DELETE" }).catch(() => {});
  };

  const uploadFile = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadStatus("Uploading...");
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await fetch("http://localhost:8080/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      const parsedSigmaAlerts = data.sigma_alerts || [];
      const alertTypeToAttack: Record<string, string> = {
        "SSH Brute Force": "brute_force",
        "Account Compromise": "brute_force",
        "Credential Dumping": "credential_dumping",
        "Mimikatz Credential Dumping Detection": "credential_dumping",
        "Credential Access Detection": "credential_dumping",
        "Privilege Escalation": "privilege_escalation",
        "Privilege Escalation Detection": "privilege_escalation",
        "Lateral Movement": "lateral_movement",
        "Lateral Movement Detection": "lateral_movement",
        "Data Exfiltration": "exfiltration",
        "Data Exfiltration Detection": "exfiltration",
        "Ransomware Activity": "ransomware",
        "Ransomware Detection": "ransomware",
        "Failed Login Detection": "brute_force",
        "Phishing Activity Detection": "phishing",
        "PowerShell Download Detection": "credential_dumping",
        "LSASS Memory Dumping via procdump.exe": "credential_dumping",
        "SAM Registry Access via reg.exe": "credential_dumping",
        "DCSync Attack via Mimikatz": "credential_dumping",
        "Kerberos Ticket Extraction from LSASS Memory": "credential_dumping",
        "Malicious PowerShell Remote Download": "privilege_escalation",
        "WMI Process Creation via Win32_Process": "privilege_escalation",
        "Scheduled Task Malicious Creation via schtasks.exe": "privilege_escalation",
        "Registry Run Key Modification for Persistence": "ransomware",
        "Malicious Windows Service Installation via sc.exe": "ransomware",
        "Startup Folder Modification for Persistence": "ransomware",
        "UAC Bypass via Fodhelper.exe Registry Manipulation": "privilege_escalation",
        "Token Manipulation via SeDebugPrivilege Enable": "privilege_escalation",
        "DLL Search Order Hijacking Detection": "privilege_escalation",
        "Windows Defender Disable via Registry Modification": "credential_dumping",
        "Process Hollowing Detection via CreateRemoteThread": "credential_dumping",
        "Event Log Clearing via wevtutil.exe": "credential_dumping",
        "PsExec Service Creation for Lateral Movement": "lateral_movement",
        "RDP Brute Force Authentication Attempts": "lateral_movement",
        "SMB Admin Share Access for Lateral Movement": "lateral_movement",
        "Data Exfiltration via DNS Tunneling": "exfiltration",
      };
      for (const alert of parsedSigmaAlerts) {
        const ev = alert.event || {};
        addEvent({
          attack_type: alertTypeToAttack[alert.alert_type] || alert.alert_type?.toLowerCase().replace(/\s+/g, "_") || "unknown",
          severity: alert.severity || "high",
          message: alert.title || `${alert.alert_type} detected`,
          mitre_technique: alert.mitre_attack || "",
          source_ip: ev.source_ip || "",
          host: ev.host || "",
          user: ev.username || ev.user || "",
          timestamp: new Date().toISOString(),
        });
      }
      setUploadStatus(
        parsedSigmaAlerts.length > 0
          ? `Uploaded: ${parsedSigmaAlerts.length} sigma matches detected`
          : `Uploaded: 0 sigma matches — no rules loaded for this log`
      );
    } catch (err: any) {
      setUploadStatus(`Upload failed: ${err.message}`);
    }
  };

  const liveAlerts = storedEvents.filter((e: any) => e.attack_type || e.severity).slice(0, 20);
  const meta = TAB_META[activeTab] || TAB_META.dashboard;
  const tabIcon = TAB_ICONS[activeTab];

  return (
    <div className="flex bg-background min-h-screen bg-grid">
      <Sidebar />
      <main className="flex-1 overflow-y-auto relative z-[1]">
        {/* Top Header Bar */}
        <div className="sticky top-0 z-20 flex items-center justify-between header-glass px-6 py-3 relative">
          <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/15 to-transparent" />
          <div className="flex items-center gap-3">
            {tabIcon && (
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-zinc-800/80 to-zinc-900/80 border border-zinc-700/40 shadow-sm">
                {tabIcon}
              </div>
            )}
            <div>
              <h1 className="text-base font-bold text-foreground tracking-tight">{meta.title}</h1>
              <p className="text-[11px] text-muted-foreground/60 font-mono tracking-wide">{meta.subtitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {activeTab === "dashboard" && (
              <>
                <button
                  onClick={clearAll}
                  className="flex items-center gap-1.5 rounded-md border border-red-900/20 bg-red-950/15 px-3 py-1.5 text-xs text-red-400/80 hover:text-red-400 hover:bg-red-950/30 hover:border-red-800/30 transition-all duration-200"
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                  Clear All
                </button>
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="flex items-center gap-1.5 text-zinc-500">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/60" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                    </span>
                    Live
                  </span>
                  <span className="text-zinc-700">|</span>
                  <span className="text-zinc-500 tabular-nums">{storeCount} events</span>
                  {numCritical > 0 && (
                    <>
                      <span className="text-zinc-700">|</span>
                      <span className="text-red-400 tabular-nums">{numCritical} critical</span>
                    </>
                  )}
                  {numHigh > 0 && (
                    <>
                      <span className="text-zinc-700">|</span>
                      <span className="text-orange-400 tabular-nums">{numHigh} high</span>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 relative z-[1]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              {activeTab === "dashboard" && (
                <div className="space-y-6">
                  <KPICards />
                  <SOCCommandCenter />
                  <div className="space-y-6">
                    <ThreatTrends />
                    <LiveAttackGraph />
                  </div>
                  <div className="glass-panel rounded-xl overflow-hidden">
                    <div className="flex items-center justify-between border-b border-zinc-800/60 px-6 py-4">
                      <SectionHeader
                        title="Telemetry Analysis"
                        subtitle="Upload log files for analysis"
                        icon={
                          <svg className="h-4 w-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6h16.5M3.75 12h16.5m-16.5 6h16.5" />
                          </svg>
                        }
                      />
                      <div className="flex items-center gap-3">
                        <label className="cursor-pointer rounded-md border border-zinc-700/40 bg-zinc-900/50 px-3 py-1.5 text-xs text-zinc-400 hover:border-zinc-600/60 hover:text-zinc-300 hover:bg-zinc-800/50 transition-all duration-200">
                          Upload File
                          <input type="file" onChange={uploadFile} className="hidden" />
                        </label>
                        {uploadStatus && (
                          <span className={`text-xs font-mono ${uploadStatus.includes("failed") ? "text-red-400" : "text-emerald-400"}`}>
                            {uploadStatus}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="mb-6">
                        <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-[0.12em] mb-3">
                          Live Alerts ({liveAlerts.length})
                        </h3>
                        <div className="max-h-[400px] overflow-y-auto space-y-2 custom-scrollbar">
                          {liveAlerts.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                              <svg className="h-8 w-8 text-zinc-700 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                              </svg>
                              <p className="text-sm text-zinc-600 font-mono">No alerts yet. Launch an attack or upload telemetry.</p>
                            </div>
                          )}
                          {liveAlerts.map((alert: any, idx: number) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, x: -8 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.03 }}
                              className="flex items-start gap-3 rounded-lg border border-red-900/15 bg-red-950/15 p-4 hover:border-red-800/25 hover:bg-red-950/25 transition-all duration-200"
                            >
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-sm font-bold text-white">
                                    {(alert.attack_type || "unknown").replace(/_/g, " ").toUpperCase()}
                                  </span>
                                  {alert.mitre_technique && (
                                    <span className="text-[10px] text-violet-400/80 font-mono">{alert.mitre_technique}</span>
                                  )}
                                </div>
                                <p className="text-xs text-zinc-400">{alert.message}</p>
                                <p className="text-[10px] text-zinc-600 mt-1 font-mono">
                                  {[alert.host, alert.source_ip, alert.user].filter(Boolean).join(" | ") || "unknown"}
                                </p>
                              </div>
                              <SeverityBadge severity={alert.severity} />
                            </motion.div>
                          ))}
                        </div>
                      </div>
                      <LogExplorer />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "alerts" && (
                <div className="space-y-6">
                  <SigmaStudio />
                  <UEBADashboard />
                </div>
              )}

              {activeTab === "incidents" && (
                <CorrelatedIncidents />
              )}

              {activeTab === "threat-hunting" && (
                <ThreatHunting />
              )}

              {activeTab === "mitre" && (
                <MitreHeatmap />
              )}

              {activeTab === "ai-assistant" && (
                <AIPanel />
              )}

              {activeTab === "settings" && (
                <div className="space-y-6">
                  <div className="glass-panel rounded-xl p-6">
                    <SectionHeader
                      title="CruXDR Settings"
                      subtitle="Platform configuration & rule management"
                      icon={
                        <svg className="h-4 w-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      }
                    />
                    <div className="border-t border-zinc-800/40 my-6" />
                    <SigmaUpload />
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
