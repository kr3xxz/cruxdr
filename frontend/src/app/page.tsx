"use client";

import { useState } from "react";

import LogExplorer from "@/components/logs/log-explorer";

import { Sidebar } from "@/components/layout/sidebar";
import { AIPanel } from "@/components/incidents/ai-panel";

import { SOCCommandCenter } from "@/components/soc/soc-command-center";

import { ThreatTrends } from "@/components/analytics/threat-trends";

import { MitreHeatmap } from "@/components/mitre/mitre-heatmap";

import { CorrelatedIncidents } from "@/components/incidents/correlated-incidents";

import { ThreatHunting } from "@/components/hunting/threat-hunting";

import { SigmaStudio } from "@/components/sigma/sigma-studio";

import { UEBADashboard } from "@/components/ueba/ueba-dashboard";

import { LiveAttackGraph } from "@/components/graph/live-attack-graph";

import { useUIStore } from "@/store/ui-store";


export default function DashboardPage() {

  const { activeTab } =
    useUIStore();

  const [alerts, setAlerts] =
    useState<any[]>([]);

  const [events, setEvents] =
    useState<any[]>([]);

  const uploadFile = async (
    e: any
  ) => {

    const file =
      e.target.files[0];

    if (!file) return;

    const formData =
      new FormData();

    formData.append(
      "file",
      file
    );

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

    setAlerts(
      data.alerts || []
    );

    setEvents(
      data.events || []
    );
  };

  return (

    <div className="
      flex
      bg-black
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

              <input
                type="file"
                onChange={uploadFile}
                className="
                  text-white
                  mb-6
                "
              />

              <div className="mb-6">

                <h3 className="
                  text-red-400
                  text-xl
                  font-semibold
                  mb-2
                ">
                  Alerts
                </h3>

                {alerts.map(
                  (alert, idx) => (

                  <div
                    key={idx}
                    className="
                      border
                      border-red-500
                      bg-red-950
                      text-white
                      p-4
                      rounded-lg
                      mb-4
                    "
                  >

                    <p>
                      <strong>
                        Type:
                      </strong>{" "}
                      {alert.alert_type}
                    </p>

                    <p>
                      <strong>
                        Severity:
                      </strong>{" "}
                      {alert.severity}
                    </p>

                    <p>
                      <strong>
                        Source IP:
                      </strong>{" "}
                      {alert.source_ip}
                    </p>

                    <p>
                      <strong>
                        MITRE:
                      </strong>{" "}
                      {alert.mitre_attack}
                    </p>

                  </div>

                ))}

              </div>

              <div>

                <h3 className="
                  text-cyan-400
                  text-xl
                  font-semibold
                  mb-2
                ">
                  Parsed Events
                </h3>

                {events.map(
                  (event, idx) => (

                  <div
                    key={idx}
                    className="
                      border
                      border-zinc-700
                      bg-zinc-950
                      text-white
                      p-3
                      rounded-lg
                      mb-2
                    "
                  >
                    <p>
                      {event.raw}
                    </p>
                  </div>

                ))}

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
            text-white
            text-2xl
            font-bold
          ">
            CruXDR Settings
          </div>
        )}

      </main>

    </div>
  );
}
