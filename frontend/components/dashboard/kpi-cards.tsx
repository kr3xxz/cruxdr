"use client";

import { useEffect, useState } from "react";
import { KPICard } from "@/components/ui/kpi-card";

export function KPICards() {
  const [stats, setStats] = useState({
    incidents: 0,
    threatScore: 0,
    techniques: 0,
    assets: 0,
  });

  const loadStats = async () => {
    try {
      const res = await fetch("http://localhost:8030/incidents");
      const incidents = await res.json();

      const threatScore = incidents.reduce((score: number, incident: any) => {
        const sev = (incident.severity || "").toUpperCase();
        if (sev === "CRITICAL") return score + 40;
        if (sev === "HIGH") return score + 20;
        if (sev === "MEDIUM") return score + 10;
        return score + 5;
      }, 0);

      const mitre = new Set(incidents.map((i: any) => i.mitre));
      const assets = new Set(incidents.flatMap((i: any) => [i.host, i.user]));

      setStats({
        incidents: incidents.length,
        threatScore,
        techniques: mitre.size,
        assets: assets.size,
      });
    } catch (err) {
      console.error("KPI ERROR", err);
    }
  };

  useEffect(() => {
    loadStats();
    const interval = setInterval(loadStats, 5000);
    return () => clearInterval(interval);
  }, []);

  const criticalAlerts = stats.incidents > 0 ? stats.incidents : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
      <KPICard
        title="Critical Alerts"
        value={criticalAlerts}
        subtitle="Requires immediate attention"
        color="critical"
        icon={
          <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        }
      />
      <KPICard
        title="Active Incidents"
        value={stats.incidents}
        subtitle="Open investigations"
        color="high"
        icon={
          <svg className="h-5 w-5 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
          </svg>
        }
      />
      <KPICard
        title="Threat Score"
        value={stats.threatScore}
        subtitle="Aggregate risk level"
        color={stats.threatScore > 50 ? "critical" : stats.threatScore > 20 ? "high" : "medium"}
        icon={
          <svg className="h-5 w-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
          </svg>
        }
      />
      <KPICard
        title="MITRE Techniques"
        value={stats.techniques}
        subtitle="Unique techniques detected"
        color="primary"
        icon={
          <svg className="h-5 w-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17.25v-.75a3 3 0 015.25-2.25M9.75 17.25H6.75a3 3 0 01-3-3v-.75m16.5 3.75v-.75a3 3 0 00-3-3h-1.5M9.75 17.25v3m0-3H6.75m3.75 0h4.5M12 3.75a3 3 0 100 6 3 3 0 000-6z" />
          </svg>
        }
      />
      <KPICard
        title="Systems Monitored"
        value={stats.assets}
        subtitle="Unique hosts & users"
        color="info"
        icon={
          <svg className="h-5 w-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
          </svg>
        }
      />
    </div>
  );
}
