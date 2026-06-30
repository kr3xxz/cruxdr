"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionHeader } from "@/components/ui/section-header";
import { SeverityPill } from "@/components/ui/severity-badge";

const UEBA_API = process.env.NEXT_PUBLIC_UEBA_API || "http://localhost:8060";

const SEVERITY_COLORS: Record<string, string> = {
  critical: "text-red-400 border-red-500/30 bg-red-950/20",
  high: "text-orange-400 border-orange-500/30 bg-orange-950/20",
  medium: "text-yellow-400 border-yellow-500/30 bg-yellow-950/20",
  low: "text-blue-400 border-blue-500/30 bg-blue-950/20",
  info: "text-zinc-400 border-zinc-600/30 bg-zinc-800/20",
};

function riskBarColor(score: number): string {
  if (score >= 70) return "bg-red-500";
  if (score >= 40) return "bg-orange-500";
  if (score >= 20) return "bg-yellow-500";
  return "bg-green-500";
}

function riskTextColor(score: number): string {
  if (score >= 70) return "#ef4444";
  if (score >= 40) return "#f97316";
  if (score >= 20) return "#eab308";
  return "#22c55e";
}

function formatTime(ts: string): string {
  try {
    return new Date(ts).toLocaleTimeString();
  } catch {
    return ts;
  }
}

function formatDate(ts: string): string {
  try {
    return new Date(ts).toLocaleString();
  } catch {
    return ts;
  }
}

function RiskFactorBar({ label, value, maxVal, color }: { label: string; value: number; maxVal: number; color: string }) {
  const pct = maxVal > 0 ? Math.min(100, (value / maxVal) * 100) : 0;
  return (
    <div className="flex items-center gap-3 text-xs">
      <span className="w-32 text-zinc-400 font-mono shrink-0">{label}</span>
      <div className="flex-1 h-2 rounded-full bg-zinc-800 overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-700 ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="w-12 text-right font-mono text-zinc-300">{value}</span>
    </div>
  );
}

function ExpandedRiskPanel({ risk, onClose }: { risk: any; onClose: () => void }) {
  const [details, setDetails] = useState<any>(null);
  const [peers, setPeers] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const [dRes, pRes] = await Promise.all([
          fetch(`${UEBA_API}/user/${risk.user}/risk-breakdown`),
          fetch(`${UEBA_API}/peer-comparison/${risk.user}`),
        ]);
        const dData = await dRes.json();
        const pData = await pRes.json();
        setDetails(dData);
        setPeers(pData);
      } catch {
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [risk.user]);

  const atkValues: number[] = Object.values(details?.by_attack_type || {}).filter((v): v is number => typeof v === "number");
  const sevValues: number[] = Object.values(details?.by_severity || {}).filter((v): v is number => typeof v === "number");
  const maxAttackVal = atkValues.length > 0 ? Math.max(...atkValues, 1) : 1;
  const maxSevVal = sevValues.length > 0 ? Math.max(...sevValues, 1) : 1;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="overflow-hidden"
    >
      <div className="mt-3 rounded-lg border border-zinc-800/80 bg-zinc-900/60 p-5 space-y-5">
        {loading ? (
          <div className="flex items-center justify-center py-6">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
            <span className="ml-2 text-xs text-zinc-500 font-mono">Loading breakdown...</span>
          </div>
        ) : details ? (
          <>
            <div className="grid grid-cols-4 gap-3">
              <div className="rounded-lg bg-zinc-900/80 border border-zinc-800/60 p-3 text-center">
                <div className="text-lg font-bold font-mono text-white">{details.total_events}</div>
                <div className="text-[10px] text-zinc-500 font-mono mt-0.5">Total Events</div>
              </div>
              <div className="rounded-lg bg-zinc-900/80 border border-zinc-800/60 p-3 text-center">
                <div className="text-lg font-bold font-mono text-violet-400">{details.frequency_multiplier}x</div>
                <div className="text-[10px] text-zinc-500 font-mono mt-0.5">Freq Multiplier</div>
              </div>
              <div className="rounded-lg bg-zinc-900/80 border border-zinc-800/60 p-3 text-center">
                <div className="text-lg font-bold font-mono" style={{ color: riskTextColor(peers?.department_average || 0) }}>
                  {peers?.department_average || "—"}
                </div>
                <div className="text-[10px] text-zinc-500 font-mono mt-0.5">Dept Average</div>
              </div>
              <div className="rounded-lg bg-zinc-900/80 border border-zinc-800/60 p-3 text-center">
                <div className="text-lg font-bold font-mono text-amber-400">{peers?.total_in_department || "—"}</div>
                <div className="text-[10px] text-zinc-500 font-mono mt-0.5">Dept Users</div>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">Risk Contribution by Attack Type</h4>
              {Object.entries(details.by_attack_type || {}).map(([k, v]) => (
                <RiskFactorBar key={k} label={k} value={v as number} maxVal={maxAttackVal} color="bg-violet-500" />
              ))}
              {Object.keys(details.by_attack_type || {}).length === 0 && (
                <p className="text-xs text-zinc-600 font-mono">No attack type contributions</p>
              )}
            </div>

            <div>
              <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">Risk Contribution by Severity</h4>
              {Object.entries(details.by_severity || {}).map(([k, v]) => (
                <RiskFactorBar key={k} label={k} value={v as number} maxVal={maxSevVal} color="bg-orange-500" />
              ))}
            </div>

            {peers && peers.peers && peers.peers.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">Peer Comparison — {peers.department}</h4>
                <div className="space-y-1.5">
                  {peers.peers.map((p: any) => (
                    <div key={p.user} className="flex items-center gap-3 rounded bg-zinc-900/40 px-3 py-2 border border-zinc-800/40">
                      <span className="text-xs font-semibold text-white w-28 truncate">{p.user}</span>
                      <span className="text-[10px] text-zinc-500 w-24 truncate">{p.role}</span>
                      <div className="flex-1 h-1.5 rounded-full bg-zinc-800">
                        <div className={`h-full rounded-full ${riskBarColor(p.risk_score)}`} style={{ width: `${p.risk_score}%` }} />
                      </div>
                      <span className="text-xs font-mono font-bold" style={{ color: riskTextColor(p.risk_score) }}>{p.risk_score}</span>
                      <span className="text-[10px] text-zinc-600 w-16 text-right">{p.event_count} ev</span>
                      {p.anomaly_count > 0 && (
                        <span className="text-[10px] text-red-400/80">{p.anomaly_count}a</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {details.events && details.events.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">Recent Events ({details.events.length})</h4>
                <div className="max-h-48 overflow-y-auto space-y-1">
                  {details.events.map((ev: any, i: number) => (
                    <div key={i} className="flex items-center gap-2 rounded bg-zinc-900/30 px-3 py-1.5 text-[11px] font-mono">
                      <SeverityPill severity={ev.severity} />
                      <span className="text-zinc-400 w-20 shrink-0">{ev.attack_type || "—"}</span>
                      <span className="text-zinc-500 truncate">{ev.message || ev.event_type}</span>
                      <span className="text-zinc-700 shrink-0 ml-auto">{formatTime(ev.timestamp)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <p className="text-xs text-zinc-600 font-mono text-center py-4">Could not load breakdown data</p>
        )}
      </div>
    </motion.div>
  );
}

function RiskScoreCard({ risk }: { risk: any }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-4 rounded-lg border border-zinc-800 bg-zinc-950/60 p-4 hover:border-zinc-700 hover:bg-zinc-950/80 transition-all duration-200 group cursor-pointer"
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700 group-hover:border-zinc-600 transition-colors">
          <span className="text-xs font-bold text-zinc-400">
            {risk.user.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-sm font-semibold text-white truncate">{risk.user}</span>
              {risk.department && (
                <span className="text-[10px] text-zinc-600 font-mono hidden sm:inline">{risk.department}</span>
              )}
              {risk.role && (
                <span className="text-[10px] text-zinc-700 font-mono hidden lg:inline truncate max-w-[120px]">{risk.role}</span>
              )}
            </div>
            <span className="text-2xl font-bold font-mono shrink-0" style={{ color: riskTextColor(risk.risk_score) }}>
              {risk.risk_score}
            </span>
          </div>
          <div className="mt-1.5 h-1.5 w-full rounded-full bg-zinc-800">
            <div
              className={`h-full rounded-full transition-all duration-500 ${riskBarColor(risk.risk_score)}`}
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
                    {at.replace(/_/g, " ")}
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
            <span className="ml-auto text-[10px] text-zinc-700 font-mono">
              {expanded ? "▲ less" : "▼ analyze"}
            </span>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {expanded && <ExpandedRiskPanel risk={risk} onClose={() => setExpanded(false)} />}
      </AnimatePresence>
    </motion.div>
  );
}

function AnomalyCard({ anomaly, onAnalyze }: { anomaly: any; onAnalyze: () => void }) {
  const sevClass = SEVERITY_COLORS[anomaly.severity] || SEVERITY_COLORS.medium;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-lg border ${sevClass} p-4 hover:brightness-110 transition-all duration-200 cursor-pointer`}
      onClick={onAnalyze}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-semibold text-white truncate">{anomaly.user}</span>
            <SeverityPill severity={anomaly.severity} />
          </div>
          <p className="text-xs text-zinc-400 font-mono leading-relaxed">{anomaly.type}</p>
          {anomaly.details && (
            <p className="text-[11px] text-zinc-500 mt-1 leading-relaxed">{anomaly.details}</p>
          )}
        </div>
        <svg className="h-4 w-4 text-zinc-700 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
        </svg>
      </div>
      {anomaly.timestamp && (
        <div className="mt-2 text-[10px] text-zinc-600 font-mono">{formatTime(anomaly.timestamp)}</div>
      )}
    </motion.div>
  );
}

function AnomalyAnalysisPanel({ anomaly, onClose }: { anomaly: any; onClose: () => void }) {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${UEBA_API}/user/${anomaly.user}`);
        const data = await res.json();
        setUserData(data);
      } catch {
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [anomaly.user]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-4 rounded-lg border border-violet-500/20 bg-violet-950/15 p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-white">{anomaly.user}</span>
          <SeverityPill severity={anomaly.severity} />
          <span className="text-xs font-mono text-zinc-400">{anomaly.type}</span>
        </div>
        <button onClick={onClose} className="text-[10px] text-zinc-600 font-mono hover:text-zinc-400 transition-colors">
          ✕ close
        </button>
      </div>

      {anomaly.details && (
        <div className="mb-4 rounded bg-zinc-900/50 border border-zinc-800/60 px-4 py-3">
          <p className="text-xs text-zinc-300 leading-relaxed">{anomaly.details}</p>
        </div>
      )}

      {loading ? (
        <div className="flex items-center gap-2 py-3">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
          <span className="text-xs text-zinc-500 font-mono">Loading user context...</span>
        </div>
      ) : userData ? (
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded bg-zinc-900/40 border border-zinc-800/50 px-3 py-2 text-center">
              <div className="text-sm font-bold font-mono text-white">{userData.event_count}</div>
              <div className="text-[10px] text-zinc-500 font-mono">Events</div>
            </div>
            <div className="rounded bg-zinc-900/40 border border-zinc-800/50 px-3 py-2 text-center">
              <div className="text-sm font-bold font-mono" style={{ color: riskTextColor(userData.risk_score) }}>{userData.risk_score}</div>
              <div className="text-[10px] text-zinc-500 font-mono">Risk Score</div>
            </div>
            <div className="rounded bg-zinc-900/40 border border-zinc-800/50 px-3 py-2 text-center">
              <div className="text-sm font-bold font-mono text-violet-400">{userData.anomalies?.length || 0}</div>
              <div className="text-[10px] text-zinc-500 font-mono">Anomalies</div>
            </div>
          </div>

          {userData.events && userData.events.length > 0 && (
            <div>
              <h5 className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-2">Recent Events</h5>
              <div className="max-h-40 overflow-y-auto space-y-1">
                {userData.events.slice(0, 10).map((ev: any, i: number) => (
                  <div key={i} className="flex items-center gap-2 rounded bg-zinc-900/30 px-3 py-1.5 text-[11px] font-mono">
                    <SeverityPill severity={ev.severity} />
                    <span className="text-zinc-400 w-20 shrink-0">{ev.attack_type || ev.event_type || "—"}</span>
                    <span className="text-zinc-600 truncate">{(ev.message || "").slice(0, 80)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {userData.anomalies && userData.anomalies.length > 0 && (
            <div>
              <h5 className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-2">Anomaly History</h5>
              <div className="space-y-1">
                {userData.anomalies.map((a: any, i: number) => (
                  <div key={i} className="flex items-center gap-2 rounded bg-zinc-900/30 px-3 py-1.5 text-[11px] font-mono">
                    <span className={`h-1.5 w-1.5 rounded-full ${a.severity === "critical" ? "bg-red-500" : a.severity === "high" ? "bg-orange-500" : "bg-yellow-500"}`} />
                    <span className="text-zinc-400">{a.type}</span>
                    <span className="text-zinc-600 ml-auto">{formatTime(a.timestamp)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <p className="text-xs text-zinc-600 font-mono py-3 text-center">Could not load user data</p>
      )}
    </motion.div>
  );
}

type UEBATab = "overview" | "users" | "anomalies" | "timeline";

const UEBA_TABS: { key: UEBATab; label: string; icon: string }[] = [
  { key: "overview", label: "Overview", icon: "M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6z" },
  { key: "users", label: "Users", icon: "M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" },
  { key: "anomalies", label: "Anomalies", icon: "M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" },
  { key: "timeline", label: "Timeline", icon: "M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" },
];

export function UEBADashboard() {
  const [uebaTab, setUebaTab] = useState<UEBATab>("overview");
  const [risks, setRisks] = useState<any[]>([]);
  const [anomalies, setAnomalies] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [selectedAnomaly, setSelectedAnomaly] = useState<any>(null);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
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
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const filteredAnomalies = severityFilter === "all"
    ? anomalies
    : anomalies.filter((a) => a.severity === severityFilter);

  const severityCounts = anomalies.reduce((acc: Record<string, number>, a: any) => {
    acc[a.severity] = (acc[a.severity] || 0) + 1;
    return acc;
  }, {});

  const sortedRisks = [...risks].sort((a, b) => b.risk_score - a.risk_score);

  return (
    <div className="glass-panel rounded-xl p-6">

      {/* ── Header ── */}
      <div className="mb-6">
        <SectionHeader
          title="UEBA Risk Analytics"
          subtitle="User & Entity Behavior Analytics · Real-time risk scoring & anomaly detection"
          size="lg"
          icon={
            <svg className="h-4 w-4 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
            </svg>
          }
          action={
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] text-zinc-500 font-mono">Live</span>
            </div>
          }
        />
      </div>

      {/* ── Summary Stats ── */}
      {summary && (
        <div className="grid grid-cols-5 gap-3 mb-5">
          {[
            { label: "USERS TRACKED", value: summary.total_users, color: "text-white" },
            { label: "AVG RISK SCORE", value: summary.avg_risk, color: "text-violet-400" },
            { label: "HIGH RISK USERS", value: summary.high_risk_users, color: "text-orange-400", desc: "score ≥ 70" },
            { label: "TOTAL ANOMALIES", value: summary.total_anomalies, color: "text-yellow-400" },
            { label: "TOTAL RISKS", value: summary.total_risks, color: "text-cyan-400" },
          ].map((stat) => (
            <div key={stat.label} className="card-depth rounded-lg p-3 text-center group hover:border-zinc-700 transition-all">
              <div className={`text-2xl font-bold font-mono ${stat.color}`}>{stat.value}</div>
              <div className="text-[10px] text-zinc-500 font-mono mt-0.5">{stat.label}</div>
              {stat.desc && <div className="text-[9px] text-zinc-700 font-mono">{stat.desc}</div>}
            </div>
          ))}
        </div>
      )}

      {/* ── In-page Tabs ── */}
      <div className="flex items-center gap-1 mb-5 border-b border-zinc-800/60 pb-0">
        {UEBA_TABS.map((tab) => {
          const active = uebaTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setUebaTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-mono transition-all duration-200 border-b-2 ${
                active
                  ? "text-violet-400 border-violet-500 bg-violet-950/20"
                  : "text-zinc-600 border-transparent hover:text-zinc-400 hover:border-zinc-700"
              }`}
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d={tab.icon} />
              </svg>
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ── Tab Content ── */}

      {uebaTab === "overview" && (
        <div className="grid grid-cols-2 gap-6">
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
              <div className="space-y-2 max-h-[700px] overflow-y-auto pr-1">
                {sortedRisks.map((risk, i) => (
                  <RiskScoreCard key={`${risk.user}-${i}`} risk={risk} />
                ))}
              </div>
            )}
          </div>

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
              <>
                {selectedAnomaly && (
                  <AnomalyAnalysisPanel anomaly={selectedAnomaly} onClose={() => setSelectedAnomaly(null)} />
                )}
                <div className="space-y-2 max-h-[550px] overflow-y-auto pr-1">
                  {filteredAnomalies.map((anomaly, i) => (
                    <AnomalyCard
                      key={`${anomaly.user}-${anomaly.type}-${i}`}
                      anomaly={anomaly}
                      onAnalyze={() => setSelectedAnomaly(anomaly)}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {uebaTab === "users" && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Search users..."
                onChange={(e) => {
                  const q = e.target.value.toLowerCase();
                  setSelectedUser(q || null);
                }}
                className="rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-xs font-mono text-zinc-300 focus:border-zinc-600 focus:outline-none w-48"
              />
            </div>
            <span className="text-[10px] text-zinc-600 font-mono">{sortedRisks.length} users</span>
          </div>
          <div className="overflow-x-auto rounded-lg border border-zinc-800/60">
            <table className="w-full text-xs font-mono">
              <thead>
                <tr className="border-b border-zinc-800/80 bg-zinc-900/50">
                  <th className="text-left px-4 py-3 text-zinc-500 font-semibold tracking-wide">User</th>
                  <th className="text-left px-4 py-3 text-zinc-500 font-semibold tracking-wide">Department</th>
                  <th className="text-left px-4 py-3 text-zinc-500 font-semibold tracking-wide">Role</th>
                  <th className="text-right px-4 py-3 text-zinc-500 font-semibold tracking-wide">Risk Score</th>
                  <th className="text-right px-4 py-3 text-zinc-500 font-semibold tracking-wide">Events</th>
                  <th className="text-right px-4 py-3 text-zinc-500 font-semibold tracking-wide">Anomalies</th>
                  <th className="text-right px-4 py-3 text-zinc-500 font-semibold tracking-wide">Attack Types</th>
                  <th className="text-right px-4 py-3 text-zinc-500 font-semibold tracking-wide">Anomalies</th>
                </tr>
              </thead>
              <tbody>
                {sortedRisks.map((risk, i) => (
                  <tr
                    key={i}
                    className="border-b border-zinc-800/40 hover:bg-zinc-900/40 transition-colors cursor-pointer"
                    onClick={() => setSelectedUser(risk.user)}
                  >
                    <td className="px-4 py-3 text-white font-semibold">{risk.user}</td>
                    <td className="px-4 py-3 text-zinc-400">{risk.department || "—"}</td>
                    <td className="px-4 py-3 text-zinc-500">{risk.role || "—"}</td>
                    <td className="px-4 py-3 text-right font-bold" style={{ color: riskTextColor(risk.risk_score) }}>{risk.risk_score}</td>
                    <td className="px-4 py-3 text-right text-zinc-400">{risk.event_count}</td>
                    <td className="px-4 py-3 text-right">
                      {risk.anomaly_count > 0 ? (
                        <span className="text-red-400">{risk.anomaly_count}</span>
                      ) : (
                        <span className="text-zinc-600">0</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex gap-1 justify-end">
                        {(risk.attack_types || []).slice(0, 2).map((at: string) => (
                          <span key={at} className="rounded bg-zinc-900 px-1.5 py-0.5 text-[10px] text-zinc-400 border border-zinc-800">
                            {at.replace(/_/g, " ")}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right text-zinc-500">{(risk.anomalies || []).slice(0, 2).join(", ")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {uebaTab === "anomalies" && (
        <div>
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mr-2">Filter:</span>
            {["all", "critical", "high", "medium", "low", "info"].map((sev) => {
              const count = sev === "all" ? anomalies.length : severityCounts[sev] || 0;
              return (
                <button
                  key={sev}
                  onClick={() => setSeverityFilter(sev)}
                  className={`rounded-lg px-3 py-1.5 text-[10px] font-mono transition-all border ${
                    severityFilter === sev
                      ? "bg-violet-950/40 border-violet-500/40 text-violet-300"
                      : "bg-zinc-900/40 border-zinc-800/60 text-zinc-500 hover:border-zinc-700"
                  }`}
                >
                  {sev.toUpperCase()} <span className="text-zinc-600">({count})</span>
                </button>
              );
            })}
          </div>
          {selectedAnomaly && (
            <AnomalyAnalysisPanel anomaly={selectedAnomaly} onClose={() => setSelectedAnomaly(null)} />
          )}
          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {filteredAnomalies.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <svg className="h-8 w-8 text-zinc-700 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-zinc-600">No anomalies match this filter</p>
              </div>
            ) : (
              filteredAnomalies.map((anomaly, i) => (
                <AnomalyCard
                  key={`${anomaly.user}-${anomaly.type}-${i}`}
                  anomaly={anomaly}
                  onAnalyze={() => setSelectedAnomaly(anomaly)}
                />
              ))
            )}
          </div>
        </div>
      )}

      {uebaTab === "timeline" && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">Event & Anomaly Timeline</h3>
            <span className="text-[10px] text-zinc-600 font-mono">
              {anomalies.length} anomalies · {risks.reduce((s, r) => s + r.event_count, 0)} events
            </span>
          </div>
          <div className="space-y-1 max-h-[650px] overflow-y-auto pr-2">
            {anomalies.length === 0 && risks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <svg className="h-8 w-8 text-zinc-700 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-zinc-600">No timeline data yet</p>
              </div>
            ) : (
              [...anomalies.map((a: any) => ({ ...a, _type: "anomaly" as const })), ...risks.flatMap((r: any) => 
                (r.anomalies || []).map((at: string) => ({
                  user: r.user,
                  type: at,
                  severity: "medium",
                  details: `Anomaly detected for ${r.user}`,
                  timestamp: r.timestamp,
                  _type: "anomaly" as const,
                }))
              )]
                .sort((a: any, b: any) => (b.timestamp || "").localeCompare(a.timestamp || ""))
                .slice(0, 100)
                .map((entry: any, i: number) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 rounded-lg border border-zinc-800/50 bg-zinc-900/30 px-4 py-3 hover:bg-zinc-900/50 transition-colors cursor-pointer"
                    onClick={() => {
                      if (entry._type === "anomaly") setSelectedAnomaly(entry);
                      else setSelectedUser(entry.user);
                    }}
                  >
                    <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${
                      entry._type === "anomaly"
                        ? "bg-red-500"
                        : "bg-cyan-500"
                    }`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-white">{entry.user}</span>
                        <SeverityPill severity={entry.severity} />
                        {entry._type === "anomaly" && (
                          <span className="text-[10px] text-red-400/80 font-mono">ANOMALY</span>
                        )}
                        <span className="text-xs text-zinc-400 font-mono">{entry.type}</span>
                      </div>
                      {entry.details && (
                        <p className="text-[11px] text-zinc-500 mt-0.5">{entry.details}</p>
                      )}
                    </div>
                    <span className="text-[10px] text-zinc-700 font-mono shrink-0">{formatDate(entry.timestamp)}</span>
                  </div>
                ))
            )}
          </div>
        </div>
      )}

    </div>
  );
}
