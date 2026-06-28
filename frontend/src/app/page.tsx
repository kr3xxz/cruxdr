"use client";

import { useState, useEffect } from "react";

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
import { useLiveEvents } from "@/hooks/use-live-events";

import { useEventStore } from "@/store/live-events";
import { useAlertStore } from "@/store/alert-store";
import { useSecurityStore } from "@/store/security-store";
import { useGraphStore } from "@/store/graph-store";
import { useUIStore } from "@/store/ui-store";


export default function DashboardPage() {

  useLiveEvents();

  const { activeTab } =
    useUIStore();

  const addEvent =
    useEventStore(
      (state) => state.addEvent
    );

  const storedEvents =
    useEventStore(
      (state) => state.events
    );

  const [uploadStatus, setUploadStatus] =
    useState<string>("");

  const [storeCount, setStoreCount] = useState(0);
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

  const uploadFile = async (
    e: any
  ) => {

    const file =
      e.target.files[0];

    if (!file) return;

    setUploadStatus("Uploading...");

    const formData =
      new FormData();

    formData.append(
      "file",
      file
    );

    try {

      const response =
        await fetch(
          "http://localhost:8080/upload",
          {
            method: "POST",
            body: formData,
          }
        );

      const data =
        await response.json();

      console.log("[UPLOAD] Response data keys:", Object.keys(data));
      console.log("[UPLOAD] events:", data.events?.length, "alerts:", data.alerts?.length, "sigma_alerts:", data.sigma_alerts?.length);

      const parsedSigmaAlerts =
        data.sigma_alerts || [];

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
          attack_type:
            alertTypeToAttack[alert.alert_type] ||
            alert.alert_type?.toLowerCase().replace(/\s+/g, "_") ||
            "unknown",
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

      setUploadStatus(
        `Upload failed: ${err.message}`
      );
    }
  };

  const liveAlerts =
    storedEvents
      .filter(
        (e: any) =>
          e.attack_type || e.severity
      )
      .slice(0, 20);

  return (

    <div className="
      flex
      bg-slate-950
      min-h-screen
    ">

      <Sidebar />

      <main className="
        flex-1
        p-6
        overflow-y-auto
      ">

        {activeTab ===
          "dashboard" && (

          <div className="
            space-y-6
          ">

            <SOCCommandCenter />

            <ThreatTrends />

            <LiveAttackGraph />

            <div className="
              bg-zinc-900
              border
              border-zinc-700
              rounded-xl
              p-6
            ">

              <h2 className="
                text-white
                text-2xl
                font-bold
                mb-4
              ">
                Telemetry Analysis
              </h2>

              <div className="
                flex
                items-center
                gap-4
                mb-6
              ">

                <input
                  type="file"
                  onChange={uploadFile}
                  className="
                    text-white
                    text-sm
                  "
                />

                {uploadStatus && (
                  <span className={`
                    text-sm
                    ${uploadStatus.includes("failed")
                      ? "text-red-400"
                      : "text-green-400"
                    }
                  `}>
                    {uploadStatus}
                  </span>
                )}
                <span className="text-zinc-500 text-xs">
                  Store: {storeCount} events
                </span>

                <button
                  onClick={clearAll}
                  className="
                    ml-auto
                    px-3
                    py-1
                    text-xs
                    bg-red-900/50
                    border
                    border-red-700/50
                    text-red-300
                    rounded
                    hover:bg-red-800/50
                    transition-colors
                  "
                >
                  Clear All Data
                </button>

              </div>

              <div className="
                mb-6
              ">

                <h3 className="
                  text-red-400
                  text-xl
                  font-semibold
                  mb-2
                ">
                  Live Alerts
                  {" "}
                  ({liveAlerts.length})
                </h3>

                <div className="
                  max-h-[400px]
                  overflow-y-auto
                  space-y-3
                ">

                  {liveAlerts.length ===
                    0 && (
                    <p className="
                      text-zinc-500
                      text-sm
                    ">
                      No alerts yet. Launch an attack or upload telemetry.
                    </p>
                  )}

                  {liveAlerts.map(
                    (alert: any, idx: number) => (

                    <div
                      key={idx}
                      className="
                        border
                        border-red-500/30
                        bg-red-950/50
                        text-white
                        p-4
                        rounded-lg
                      "
                    >

                      <div className="
                        flex
                        justify-between
                        items-center
                      ">

                        <div>

                          <p className="
                            font-bold
                          ">
                            {(
                              alert.attack_type ||
                              "unknown"
                            )
                              .replace(
                                "_",
                                " "
                              )
                              .toUpperCase()}
                          </p>

                          <p className="
                            text-zinc-400
                            text-sm
                            mt-1
                          ">
                            {alert.message}
                          </p>

                          <p className="
                            text-zinc-500
                            text-xs
                            mt-1
                          ">
                            {alert.host ||
                              alert.source_ip ||
                              ""}
                            {alert.user
                              ? ` | ${alert.user}`
                              : ""}
                            {alert
                              .mitre_technique
                              ? ` | MITRE: ${alert.mitre_technique}`
                              : ""}
                          </p>

                        </div>

                        <span className="
                          text-red-400
                          font-bold
                          uppercase
                          text-sm
                        ">
                          {alert.severity}
                        </span>

                      </div>

                    </div>
                  ))}
                </div>

              </div>

            </div>

            <LogExplorer />

          </div>
        )}

        {activeTab ===
          "alerts" && (

          <div className="
            space-y-6
          ">

            <SigmaStudio />

            <UEBADashboard />

          </div>
        )}

        {activeTab ===
          "incidents" && (

          <CorrelatedIncidents />
        )}

        {activeTab ===
          "threat-hunting" && (

          <ThreatHunting />
        )}

        {activeTab ===
          "mitre" && (

          <MitreHeatmap />
        )}

        {activeTab ===
          "ai-assistant" && (

          <AIPanel />
        )}

        {activeTab ===
          "settings" && (

          <div className="
            space-y-6
          ">

            <h1 className="
              text-white
              text-3xl
              font-bold
            ">
              CruXDR Settings
            </h1>

            <SigmaUpload />

          </div>
        )}

      </main>

    </div>
  );
}
