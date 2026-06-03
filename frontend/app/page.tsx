"use client";

import LogExplorer from "@/components/logs/log-explorer";

import { Sidebar } from "@/components/layout/sidebar";

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

          <div className="
            text-white
            text-2xl
            font-bold
          ">
            AI Assistant
          </div>
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
