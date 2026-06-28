"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

<<<<<<< HEAD
=======
import { useEventStore } from "@/store/live-events";

const severityColor: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  critical: {
    bg: "bg-red-950/40",
    text: "text-red-400",
    border: "border-red-500/30",
    dot: "bg-red-500",
  },
  high: {
    bg: "bg-orange-950/40",
    text: "text-orange-400",
    border: "border-orange-500/30",
    dot: "bg-orange-500",
  },
  medium: {
    bg: "bg-yellow-950/40",
    text: "text-yellow-400",
    border: "border-yellow-500/30",
    dot: "bg-yellow-500",
  },
  low: {
    bg: "bg-blue-950/40",
    text: "text-blue-400",
    border: "border-blue-500/30",
    dot: "bg-blue-500",
  },
};

const recommendations: Record<string, { title: string; steps: string[] }> = {
  critical: {
    title: "Immediate Response Required",
    steps: [
      "Isolate affected hosts from the network immediately",
      "Block all malicious IPs and domains at the firewall",
      "Initiate incident response playbook IR-001",
      "Preserve forensic artifacts for analysis",
      "Escalate to senior SOC analyst",
    ],
  },
  high: {
    title: "Priority Investigation Needed",
    steps: [
      "Correlate alerts across endpoints and network logs",
      "Check for lateral movement indicators",
      "Review authentication logs for compromised credentials",
      "Engage threat intelligence for IOC enrichment",
    ],
  },
  medium: {
    title: "Standard Review",
    steps: [
      "Monitor affected systems for further suspicious activity",
      "Update detection rules if applicable",
      "Document findings in incident ticket",
    ],
  },
  low: {
    title: "Informational",
    steps: [
      "Log for future reference",
      "No immediate action required",
    ],
  },
};

function SeverityBadge({ severity, size = "sm" }: { severity: string; size?: "sm" | "lg" }) {
  const colors = severityColor[severity] || severityColor.medium;
  const s = size === "lg" ? "px-4 py-1.5 text-sm" : "px-2.5 py-0.5 text-xs";
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-md ${colors.bg} ${colors.text} ${colors.border} border font-mono font-semibold ${s} uppercase tracking-wider`}>
      <span className={`h-1.5 w-1.5 rounded-full ${colors.dot} ${severity === "critical" ? "animate-pulse" : ""}`} />
      {severity}
    </span>
  );
}

>>>>>>> 1f84238 (redesign SOC interface, fix sigma→correlation pipeline, enhance UEBA analytics & MITRE heatmap)
export function AIPanel() {
  const events = useEventStore((state) => state.events);
  const latest = events[0];
  const severity = latest?.severity || "medium";
  const attack = latest?.attack_type || "Suspicious activity";
  const rec = recommendations[severity] || recommendations.medium;

<<<<<<< HEAD
  const [alerts, setAlerts] =
    useState<any[]>([]);

  useEffect(() => {

    const loadAlerts =
      async () => {

        try {

          const res =
            await fetch(
              "http://localhost:8050/alerts"
            );

          const data =
            await res.json();

          setAlerts(data);

        } catch (err) {

          console.error(err);
        }
      };

    loadAlerts();

    const interval =
      setInterval(
        loadAlerts,
        3000
      );

    return () =>
      clearInterval(interval);

  }, []);

  const latest =
    alerts[0];

  const severity =
    latest?.severity ||
    "none";

  const title =
    latest?.title ||
    "No Active Threats";

  const getRecommendation =
    () => {

      if (!latest)
        return "No active threats detected.";

      if (
        title.includes(
          "Ransomware"
        )
      ) {

        return `
• Isolate affected endpoint
• Block malicious processes
• Investigate encrypted files
• Restore from backup
`;
      }

      if (
        title.includes(
          "Lateral Movement"
        )
      ) {

        return `
• Investigate remote execution
• Review PsExec activity
• Audit privileged accounts
• Rotate credentials
`;
      }

      if (
        title.includes(
          "Phishing"
        )
      ) {

        return `
• Quarantine malicious emails
• Reset impacted accounts
• Review email gateway logs
• Block malicious domains
`;
      }

      if (
        title.includes(
          "Exfiltration"
        )
      ) {

        return `
• Block outbound connection
• Inspect transferred files
• Review firewall logs
• Monitor data access
`;
      }

      if (
        title.includes(
          "Mimikatz"
        )
      ) {

        return `
• Reset privileged credentials
• Review LSASS access
• Hunt for credential dumping
• Isolate affected hosts
`;
      }

      return `
• Investigate alert source
• Review host telemetry
• Monitor affected assets
`;
    };
=======
  const totalEvents = events.length;
  const criticalCount = events.filter((e) => e.severity === "critical").length;
  const highCount = events.filter((e) => e.severity === "high").length;
  const mediumCount = events.filter((e) => e.severity === "medium").length;
  const colors = severityColor[severity] || severityColor.medium;
>>>>>>> 1f84238 (redesign SOC interface, fix sigma→correlation pipeline, enhance UEBA analytics & MITRE heatmap)

  return (
    <div className="space-y-5">

<<<<<<< HEAD
    <div className="
      bg-slate-950
      border
      border-zinc-800
      rounded-xl
      p-6
    ">

      <h2 className="
        text-white
        text-4xl
        font-bold
        mb-8
      ">
        AI SOC Assistant
      </h2>

      <div className="
        grid
        grid-cols-2
        gap-8
      ">

        <motion.div

          initial={{
            opacity: 0,
            y: 10,
          }}

          animate={{
            opacity: 1,
            y: 0,
          }}

          className="
            bg-zinc-950
            border
            border-slate-700/30
            rounded-xl
            p-6
          "
        >

          <h3 className="
            text-red-400
            text-2xl
            font-bold
            mb-6
          ">
            Threat Analysis
          </h3>

          <div className="space-y-4">

            <div>

              <p className="
                text-zinc-400
                mb-2
              ">
                Threat Severity
              </p>

              <p className="
                text-white
                text-4xl
                font-bold
                uppercase
              ">
                {severity}
              </p>

            </div>

            <div>

              <p className="
                text-zinc-400
                mb-2
              ">
                AI Summary
              </p>

              <p className="
                text-white
                text-lg
              ">
                {title}
              </p>

            </div>

          </div>

        </motion.div>

        <motion.div

          initial={{
            opacity: 0,
            y: 10,
          }}

          animate={{
            opacity: 1,
            y: 0,
          }}

          className="
            bg-zinc-950
            border
            border-slate-700/30
            rounded-xl
            p-6
          "
        >

          <h3 className="
            text-red-400
            text-2xl
            font-bold
            mb-6
          ">
            AI Recommendations
          </h3>

          <div className="
            bg-slate-950
            rounded-xl
            p-5
            text-zinc-200
            whitespace-pre-line
          ">
            {getRecommendation()}
          </div>

        </motion.div>

      </div>

      <div className="mt-10">

        <h3 className="
          text-white
          text-3xl
          font-bold
          mb-6
        ">
          Live Security Telemetry
        </h3>

        <div className="space-y-4">

          {alerts.map(
            (
              alert,
              index
            ) => (

              <motion.div

                key={index}

                initial={{
                  opacity: 0,
                  x: -10,
                }}

                animate={{
                  opacity: 1,
                  x: 0,
                }}

                className="
                  bg-zinc-950
                  border
                  border-zinc-800
                  rounded-xl
                  p-5
                  flex
                  justify-between
                  items-start
                "
              >

                <div>

                  <h4 className="
                    text-white
                    text-xl
                    font-bold
                    mb-2
                  ">
                    {alert.title}
                  </h4>

                  <p className="
                    text-zinc-400
                  ">
                    Host: {alert.event?.host || "N/A"}
                  </p>

                  <p className="
                    text-zinc-400
                  ">
                    User: {alert.event?.user || "N/A"}
                  </p>

                  <p className="
                    text-zinc-400
                  ">
                    {alert.event?.message || ""}
                  </p>

                </div>

                <div className="
                  text-red-400
                  font-bold
                  text-xl
                  uppercase
                ">
                  {alert.severity}
                </div>

              </motion.div>

            )
          )}

=======
      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950/80 px-6 py-4"
      >
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-950/60 border border-emerald-500/30">
            <svg className="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              AI SOC Assistant
            </h2>
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <span className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live
              </span>
              <span className="text-zinc-700">|</span>
              <span>{totalEvents} events monitored</span>
            </div>
          </div>
>>>>>>> 1f84238 (redesign SOC interface, fix sigma→correlation pipeline, enhance UEBA analytics & MITRE heatmap)
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 text-xs font-mono">
            {criticalCount > 0 && (
              <span className="flex items-center gap-1.5 text-red-400">
                <span className="h-2 w-2 rounded-full bg-red-500" />
                {criticalCount} critical
              </span>
            )}
            {highCount > 0 && (
              <span className="flex items-center gap-1.5 text-orange-400">
                <span className="h-2 w-2 rounded-full bg-orange-500" />
                {highCount} high
              </span>
            )}
            <span className="flex items-center gap-1.5 text-yellow-400">
              <span className="h-2 w-2 rounded-full bg-yellow-500" />
              {mediumCount} medium
            </span>
          </div>
        </div>
      </motion.div>

      {/* ── Main Grid ── */}
      <div className="grid grid-cols-3 gap-5">

        {/* Threat Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="col-span-1 rounded-xl border border-zinc-800 bg-zinc-950/60 p-5"
        >
          <div className="flex items-center gap-2 mb-5">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-red-950/60">
              <svg className="h-3.5 w-3.5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-zinc-200 uppercase tracking-wider">Threat Analysis</h3>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-xs text-zinc-500 mb-1.5 font-mono">Severity Classification</p>
              <SeverityBadge severity={severity} size="lg" />
            </div>

            <div>
              <p className="text-xs text-zinc-500 mb-1.5 font-mono">Attack Type</p>
              <p className="text-sm font-semibold text-white">{attack.replace(/_/g, " ").toUpperCase()}</p>
            </div>

            <div className={`rounded-lg border ${colors.border} ${colors.bg} p-3`}>
              <p className="text-xs text-zinc-500 mb-1 font-mono">AI Summary</p>
              <p className="text-sm text-zinc-200 leading-relaxed">
                {attack.replace(/_/g, " ")} activity detected across monitored assets. {severity === "critical" ? "Immediate containment measures are recommended." : severity === "high" ? "Investigation should be prioritized." : "Standard monitoring procedures apply."}
              </p>
            </div>

            {latest?.mitre_technique || latest?.mitre ? (
              <div>
                <p className="text-xs text-zinc-500 mb-1.5 font-mono">MITRE ATT&CK</p>
                <span className="inline-flex items-center gap-1.5 rounded-md border border-violet-500/30 bg-violet-950/40 px-2.5 py-1 text-xs font-mono font-semibold text-violet-400">
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                  </svg>
                  {latest.mitre_technique || latest.mitre}
                </span>
              </div>
            ) : null}
          </div>
        </motion.div>

        {/* AI Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="col-span-1 rounded-xl border border-zinc-800 bg-zinc-950/60 p-5"
        >
          <div className="flex items-center gap-2 mb-5">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-emerald-950/60">
              <svg className="h-3.5 w-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-zinc-200 uppercase tracking-wider">AI Recommendations</h3>
          </div>

          <div className="space-y-3">
            <p className={`text-xs font-semibold uppercase tracking-wider ${colors.text}`}>
              {rec.title}
            </p>
            <ul className="space-y-2">
              {rec.steps.map((step, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <span className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${colors.bg} ${colors.border} border text-[10px] font-bold ${colors.text}`}>
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* Telemetry Overview */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="col-span-1 rounded-xl border border-zinc-800 bg-zinc-950/60 p-5"
        >
          <div className="flex items-center gap-2 mb-5">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-blue-950/60">
              <svg className="h-3.5 w-3.5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6h16.5M3.75 12h16.5m-16.5 6h16.5" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-zinc-200 uppercase tracking-wider">Telemetry Overview</h3>
          </div>

          <div className="space-y-2.5">
            {[
              { label: "Total Events", value: totalEvents, color: "text-zinc-100" },
              { label: "Critical", value: criticalCount, color: "text-red-400" },
              { label: "High", value: highCount, color: "text-orange-400" },
              { label: "Medium", value: mediumCount, color: "text-yellow-400" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between rounded-lg border border-zinc-800/60 bg-zinc-900/40 px-3.5 py-2">
                <span className="text-xs text-zinc-500 font-mono">{item.label}</span>
                <span className={`text-sm font-bold font-mono ${item.color}`}>{item.value}</span>
              </div>
            ))}
          </div>
        </motion.div>

      </div>

      {/* ── Live Security Telemetry ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-xl border border-zinc-800 bg-zinc-950/60"
      >
        <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-3.5">
          <div className="flex items-center gap-2">
            <div className="flex h-5 w-5 items-center justify-center rounded bg-zinc-800">
              <svg className="h-3 w-3 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75L16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-zinc-200">Event Feed</h3>
          </div>
          <span className="text-[11px] text-zinc-600 font-mono">{events.length} events</span>
        </div>

        <div className="divide-y divide-zinc-800/60">
          {events.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <svg className="h-8 w-8 text-zinc-700 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
              </svg>
              <p className="text-sm text-zinc-600">No telemetry data available</p>
              <p className="text-xs text-zinc-700 mt-1">Events will appear here as they are detected</p>
            </div>
          ) : (
            events.map((event, index) => {
              const c = severityColor[event.severity] || severityColor.medium;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="group flex items-start gap-4 px-5 py-3.5 transition-colors hover:bg-zinc-900/40"
                >
                  {/* Severity indicator */}
                  <div className="flex flex-col items-center gap-1 pt-0.5">
                    <span className={`h-2 w-2 rounded-full ${c.dot} ${event.severity === "critical" ? "animate-pulse" : ""}`} />
                  </div>

                  {/* Event details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={`text-xs font-bold font-mono uppercase tracking-wider ${c.text}`}>
                        {event.attack_type?.replace(/_/g, " ")}
                      </span>
                      {event.mitre_technique || event.mitre ? (
                        <span className="text-[10px] text-violet-500 font-mono">
                          {event.mitre_technique || event.mitre}
                        </span>
                      ) : null}
                    </div>
                    <p className="text-sm text-zinc-400 truncate">{event.message}</p>
                    <p className="text-[11px] text-zinc-600 font-mono mt-0.5">
                      {event.source_ip || event.source || event.host || "unknown"}
                    </p>
                  </div>

                  {/* Severity badge */}
                  <div className="shrink-0">
                    <SeverityBadge severity={event.severity} />
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </motion.div>

    </div>
  );
}
