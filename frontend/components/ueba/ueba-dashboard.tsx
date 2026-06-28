"use client";

import { useEffect, useState } from "react";
<<<<<<< HEAD
import { motion } from "framer-motion";

export function UEBADashboard() {

  const [risks, setRisks] =
    useState<any[]>([]);

  const [anomalies, setAnomalies] =
    useState<any[]>([]);

  useEffect(() => {

    const load = async () => {

      try {

        const riskRes =
          await fetch(
            "http://localhost:8060/risks"
          );

        const riskData =
          await riskRes.json();

        setRisks(riskData);

        const anomalyRes =
          await fetch(
            "http://localhost:8060/anomalies"
          );

        const anomalyData =
          await anomalyRes.json();

        setAnomalies(anomalyData);

      } catch (err) {

        console.error(err);
      }
    };

    load();

    const interval =
      setInterval(load, 5000);

    return () =>
      clearInterval(interval);

  }, []);
=======

const UEBA_API = process.env.NEXT_PUBLIC_UEBA_API || "http://localhost:8060";

const SEVERITY_COLORS: Record<string, string> = {
  critical: "text-red-400 border-red-500/30 bg-red-950/20",
  high: "text-orange-400 border-orange-500/30 bg-orange-950/20",
  medium: "text-yellow-400 border-yellow-500/30 bg-yellow-950/20",
  low: "text-blue-400 border-blue-500/30 bg-blue-950/20",
  info: "text-zinc-400 border-zinc-600/30 bg-zinc-800/20",
};

const SEVERITY_BAR: Record<string, string> = {
  critical: "bg-red-500",
  high: "bg-orange-500",
  medium: "bg-yellow-500",
  low: "bg-blue-500",
  info: "bg-zinc-500",
};

function riskBarColor(score: number): string {
  if (score >= 70) return "bg-red-500";
  if (score >= 40) return "bg-orange-500";
  if (score >= 20) return "bg-yellow-500";
  return "bg-green-500";
}
>>>>>>> 1f84238 (redesign SOC interface, fix sigma→correlation pipeline, enhance UEBA analytics & MITRE heatmap)

function RiskScoreCard({ risk }: { risk: any }) {
  const barColor = riskBarColor(risk.risk_score);
  return (
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
        text-3xl
        font-bold
        mb-8
      ">
        UEBA Analytics
      </h2>

      <div className="
        grid
        grid-cols-2
        gap-8
      ">

        <div>

          <h3 className="
            text-red-400
            text-2xl
            font-semibold
            mb-6
          ">
            User Risk Scores
          </h3>

          <div className="space-y-4">

            {risks.map((risk, index) => (

              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="
                  bg-zinc-950
                  border
                  border-slate-700/20
                  rounded-xl
                  p-4
                "
              >

                <div className="
                  flex
                  justify-between
                ">

                  <span className="text-white">
                    {risk.user}
                  </span>

                  <span className="
                    text-red-400
                    font-bold
                  ">
                    {risk.risk_score}
                  </span>

                </div>

              </motion.div>

            ))}

          </div>

        </div>

        <div>

          <h3 className="
            text-red-400
            text-2xl
            font-semibold
            mb-6
          ">
            Behavioral Anomalies
          </h3>

          <div className="space-y-4">

            {anomalies.map(
              (anomaly, index) => (

                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="
                    bg-zinc-950
                    border
                    border-slate-700/20
                    rounded-xl
                    p-4
                  "
                >

                  <div className="
                    flex
                    justify-between
                  ">

                    <span className="text-white">
                      {anomaly.user}
                    </span>

                    <span className="
                      text-red-400
                      font-bold
                    ">
                      {anomaly.anomaly}
                    </span>

                  </div>

                </motion.div>

              )
            )}

          </div>

        </div>

=======
    <div className="flex items-center gap-4 rounded-lg border border-zinc-800 bg-zinc-950/60 p-4 hover:border-zinc-700 transition-colors">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-900 border border-zinc-700">
        <span className="text-xs font-bold text-zinc-400">
          {risk.user.charAt(0).toUpperCase()}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-semibold text-white truncate">
            {risk.user}
          </span>
          <span className="text-2xl font-bold font-mono shrink-0" style={{ color: risk.risk_score >= 70 ? "#ef4444" : risk.risk_score >= 40 ? "#f97316" : risk.risk_score >= 20 ? "#eab308" : "#22c55e" }}>
            {risk.risk_score}
          </span>
        </div>
        <div className="mt-1.5 h-1.5 w-full rounded-full bg-zinc-800">
          <div
            className={`h-full rounded-full transition-all duration-500 ${barColor}`}
            style={{ width: `${risk.risk_score}%` }}
          />
        </div>
        <div className="mt-1.5 flex flex-wrap gap-1.5 items-center text-[11px] text-zinc-500">
          <span>{risk.event_count} events</span>
          {risk.attack_types?.length > 0 && (
            <>
              <span className="text-zinc-700">|</span>
              {risk.attack_types.slice(0, 3).map((at: string) => (
                <span key={at} className="rounded bg-zinc-900 px-1.5 py-0.5 text-[10px] font-mono text-zinc-400 border border-zinc-800">
                  {at}
                </span>
              ))}
            </>
          )}
          {risk.anomaly_count > 0 && (
            <>
              <span className="text-zinc-700">|</span>
              <span className="text-red-500/80 font-semibold">{risk.anomaly_count} anomaly</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function AnomalyCard({ anomaly }: { anomaly: any }) {
  const sevClass = SEVERITY_COLORS[anomaly.severity] || SEVERITY_COLORS.medium;
  return (
    <div className={`rounded-lg border ${sevClass} p-4`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-semibold text-white truncate">
              {anomaly.user}
            </span>
            <span className={`text-[10px] font-bold uppercase tracking-wider ${SEVERITY_COLORS[anomaly.severity]?.split(" ")[0] || "text-zinc-400"}`}>
              {anomaly.severity}
            </span>
          </div>
          <p className="text-xs text-zinc-400 font-mono leading-relaxed">
            {anomaly.type}
          </p>
          {anomaly.details && (
            <p className="text-[11px] text-zinc-500 mt-1 leading-relaxed">
              {anomaly.details}
            </p>
          )}
        </div>
      </div>
      {anomaly.timestamp && (
        <div className="mt-2 text-[10px] text-zinc-600 font-mono">
          {new Date(anomaly.timestamp).toLocaleTimeString()}
        </div>
      )}
    </div>
  );
}

export function UEBADashboard() {
  const [risks, setRisks] = useState<any[]>([]);
  const [anomalies, setAnomalies] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [riskRes, anomalyRes, summaryRes] = await Promise.all([
          fetch(`${UEBA_API}/risks`),
          fetch(`${UEBA_API}/anomalies`),
          fetch(`${UEBA_API}/summary`),
        ]);
        const riskData = await riskRes.json();
        const anomalyData = await anomalyRes.json();
        const summaryData = await summaryRes.json();
        setRisks(riskData.risks || []);
        setAnomalies(anomalyData.anomalies || []);
        setSummary(summaryData);
      } catch {
        // silently fail — data will populate on next poll
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950/80 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-950/60 border border-violet-500/30">
            <svg className="h-4 w-4 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">UEBA Risk Analytics</h2>
            <p className="text-[11px] text-zinc-500 font-mono">
              User & Entity Behavior Analytics &bull; Real-time risk scoring
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[11px] text-zinc-500 font-mono">Live</span>
        </div>
      </div>

      {/* Summary bar */}
      {summary && (
        <div className="grid grid-cols-4 gap-3 mb-6">
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-3 text-center">
            <div className="text-2xl font-bold text-white font-mono">{summary.total_users}</div>
            <div className="text-[10px] text-zinc-500 font-mono mt-0.5">USERS TRACKED</div>
          </div>
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-3 text-center">
            <div className="text-2xl font-bold text-violet-400 font-mono">{summary.avg_risk}</div>
            <div className="text-[10px] text-zinc-500 font-mono mt-0.5">AVG RISK SCORE</div>
          </div>
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-3 text-center">
            <div className="text-2xl font-bold text-orange-400 font-mono">{summary.high_risk_users}</div>
            <div className="text-[10px] text-zinc-500 font-mono mt-0.5">HIGH RISK USERS</div>
          </div>
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-3 text-center">
            <div className="text-2xl font-bold text-yellow-400 font-mono">{summary.total_anomalies}</div>
            <div className="text-[10px] text-zinc-500 font-mono mt-0.5">ANOMALIES</div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-6">
        {/* Risk Scores */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">Risk Scores</h3>
            <span className="text-[10px] text-zinc-600 font-mono">({risks.length})</span>
          </div>
          {loading && risks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-500 border-t-transparent mb-3" />
              <p className="text-sm text-zinc-600">Loading UEBA data...</p>
            </div>
          ) : risks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <svg className="h-8 w-8 text-zinc-700 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
              </svg>
              <p className="text-sm text-zinc-600">No risk data yet</p>
              <p className="text-xs text-zinc-700 mt-1">Launch attacks or upload telemetry to generate UEBA scores</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
              {risks.map((risk, i) => (
                <RiskScoreCard key={`${risk.user}-${i}`} risk={risk} />
              ))}
            </div>
          )}
        </div>

        {/* Anomalies */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">Behavioral Anomalies</h3>
            <span className="text-[10px] text-zinc-600 font-mono">({anomalies.length})</span>
          </div>
          {loading && anomalies.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-500 border-t-transparent mb-3" />
              <p className="text-sm text-zinc-600">Loading anomalies...</p>
            </div>
          ) : anomalies.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <svg className="h-8 w-8 text-zinc-700 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
              </svg>
              <p className="text-sm text-zinc-600">No anomalies detected</p>
              <p className="text-xs text-zinc-700 mt-1">Normal behavior across all monitored users</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
              {anomalies.map((anomaly, i) => (
                <AnomalyCard key={`${anomaly.user}-${anomaly.type}-${i}`} anomaly={anomaly} />
              ))}
            </div>
          )}
        </div>
>>>>>>> 1f84238 (redesign SOC interface, fix sigma→correlation pipeline, enhance UEBA analytics & MITRE heatmap)
      </div>
    </div>
  );
}
