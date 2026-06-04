"use client";

import SigmaAlertSync from "@/components/sigma/sigma-alert-sync";
import SigmaUpload from "@/components/sigma/sigma-upload";
import { useState, useEffect, useRef } from "react";
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
import { useUIStore } from "@/store/ui-store";

/* ─────────────────────────────────────────────
   Severity config
───────────────────────────────────────────── */
const severityConfig: Record<string, { color: string; glow: string; bg: string; dot: string }> = {
  critical: {
    color: "text-red-400",
    glow: "shadow-[0_0_12px_rgba(239,68,68,0.4)]",
    bg: "bg-red-950/60",
    dot: "bg-red-500",
  },
  high: {
    color: "text-orange-400",
    glow: "shadow-[0_0_12px_rgba(251,146,60,0.3)]",
    bg: "bg-orange-950/50",
    dot: "bg-orange-500",
  },
  medium: {
    color: "text-amber-400",
    glow: "shadow-[0_0_12px_rgba(251,191,36,0.25)]",
    bg: "bg-amber-950/40",
    dot: "bg-amber-400",
  },
  low: {
    color: "text-cyan-400",
    glow: "shadow-[0_0_8px_rgba(34,211,238,0.2)]",
    bg: "bg-cyan-950/30",
    dot: "bg-cyan-500",
  },
};

/* ─────────────────────────────────────────────
   Alert Card
───────────────────────────────────────────── */
function AlertCard({ alert, idx }: { alert: any; idx: number }) {
  const sev = (alert.severity || "low").toLowerCase();
  const cfg = severityConfig[sev] ?? severityConfig.low;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), idx * 80);
    return () => clearTimeout(t);
  }, [idx]);

  return (
    <div
      className={`
        relative overflow-hidden rounded-xl border border-zinc-700/50
        ${cfg.bg} ${cfg.glow}
        p-4 mb-3 backdrop-blur-sm
        transition-all duration-500
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
        hover:border-zinc-500/60 hover:scale-[1.01]
        group
      `}
    >
      {/* Accent left bar */}
      <div className={`absolute left-0 top-0 bottom-0 w-[3px] ${cfg.dot}`} />

      {/* Header row */}
      <div className="flex items-center justify-between mb-3 pl-2">
        <div className="flex items-center gap-2">
          <span className={`inline-flex h-2 w-2 rounded-full ${cfg.dot} animate-pulse`} />
          <span className={`text-xs font-mono font-semibold uppercase tracking-widest ${cfg.color}`}>
            {sev}
          </span>
        </div>
        <span className="text-[10px] text-zinc-500 font-mono">
          {alert.mitre_attack && (
            <span className="px-2 py-0.5 rounded bg-zinc-800/80 border border-zinc-700 text-cyan-400/70">
              {alert.mitre_attack}
            </span>
          )}
        </span>
      </div>

      {/* Content */}
      <div className="pl-2 grid grid-cols-2 gap-x-6 gap-y-1">
        {[
          ["Type", alert.alert_type],
          ["Source IP", alert.source_ip],
        ].map(([label, value]) => (
          <div key={label}>
            <span className="text-[11px] text-zinc-500 font-mono uppercase tracking-wider">{label}</span>
            <p className="text-white text-sm font-medium mt-0.5 truncate">{value}</p>
          </div>
        ))}
      </div>

      {/* Hover shimmer */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent" />
    </div>
  );
}

/* ─────────────────────────────────────────────
   Event Row
───────────────────────────────────────────── */
function EventRow({ event, idx }: { event: any; idx: number }) {
  return (
    <div
      className="
        font-mono text-xs text-zinc-400 py-2 px-3 rounded-lg
        border border-transparent hover:border-zinc-700/60
        hover:bg-zinc-800/40 hover:text-cyan-300
        transition-all duration-200 cursor-default
      "
      style={{ animationDelay: `${idx * 40}ms` }}
    >
      <span className="text-zinc-600 mr-2 select-none">{String(idx + 1).padStart(3, "0")}</span>
      {event.raw}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Upload Zone
───────────────────────────────────────────── */
function UploadZone({ onFile }: { onFile: (file: File) => void }) {
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) { setFileName(file.name); onFile(file); }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { setFileName(file.name); onFile(file); }
  };

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      className={`
        relative cursor-pointer rounded-xl border-2 border-dashed
        transition-all duration-300 p-8 text-center select-none
        ${dragging
          ? "border-cyan-400 bg-cyan-950/20 shadow-[0_0_30px_rgba(34,211,238,0.2)]"
          : "border-zinc-700 bg-zinc-900/50 hover:border-zinc-500 hover:bg-zinc-800/50"
        }
      `}
    >
      <input ref={inputRef} type="file" onChange={handleChange} className="hidden" />

      {/* Icon */}
      <div className={`
        mx-auto mb-3 w-12 h-12 rounded-lg flex items-center justify-center
        transition-colors duration-300
        ${dragging ? "bg-cyan-500/20 text-cyan-400" : "bg-zinc-800 text-zinc-400"}
      `}>
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
        </svg>
      </div>

      {fileName ? (
        <>
          <p className="text-cyan-400 font-mono text-sm font-semibold">{fileName}</p>
          <p className="text-zinc-500 text-xs mt-1">File loaded — drop another to replace</p>
        </>
      ) : (
        <>
          <p className="text-zinc-300 font-medium text-sm">Drop telemetry file here</p>
          <p className="text-zinc-500 text-xs mt-1">or click to browse · EVTX, JSON, CSV, PCAP</p>
        </>
      )}

      {/* Animated corner accents when dragging */}
      {dragging && (
        <>
          <span className="absolute top-1.5 left-1.5 w-3 h-3 border-t-2 border-l-2 border-cyan-400 rounded-tl" />
          <span className="absolute top-1.5 right-1.5 w-3 h-3 border-t-2 border-r-2 border-cyan-400 rounded-tr" />
          <span className="absolute bottom-1.5 left-1.5 w-3 h-3 border-b-2 border-l-2 border-cyan-400 rounded-bl" />
          <span className="absolute bottom-1.5 right-1.5 w-3 h-3 border-b-2 border-r-2 border-cyan-400 rounded-br" />
        </>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Section Heading
───────────────────────────────────────────── */
function SectionHeading({ label, count, color = "cyan" }: { label: string; count?: number; color?: "cyan" | "red" }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className={`h-px flex-1 ${color === "red" ? "bg-gradient-to-r from-red-500/50 to-transparent" : "bg-gradient-to-r from-cyan-500/50 to-transparent"}`} />
      <span className={`text-xs font-mono font-bold uppercase tracking-[0.2em] ${color === "red" ? "text-red-400" : "text-cyan-400"}`}>
        {label}
      </span>
      {count !== undefined && (
        <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${color === "red" ? "bg-red-950 text-red-400 border border-red-800" : "bg-cyan-950 text-cyan-400 border border-cyan-800"}`}>
          {count}
        </span>
      )}
      <div className={`h-px flex-1 ${color === "red" ? "bg-gradient-to-l from-red-500/50 to-transparent" : "bg-gradient-to-l from-cyan-500/50 to-transparent"}`} />
    </div>
  );
}

/* ─────────────────────────────────────────────
   Tab Wrapper — fade + slide animation
───────────────────────────────────────────── */
function TabPane({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { requestAnimationFrame(() => setMounted(true)); }, []);
  return (
    <div className={`transition-all duration-400 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}>
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Background Layer
   Five stacked layers rendered as a fixed base:
   1. Near-black base  2. Aurora orbs (animated)
   3. Hex grid (SVG)   4. Grain (SVG noise)
   5. Radar sweep beam 6. Vignette
───────────────────────────────────────────── */
function BackgroundLayer() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 overflow-hidden"
      style={{ zIndex: 0, pointerEvents: "none" }}
    >
      {/* ① Base */}
      <div className="absolute inset-0 bg-[#020508]" />

      {/* ② Aurora orb — cyan, top-right */}
      <div
        className="absolute rounded-full"
        style={{
          width: 760, height: 760,
          top: -280, right: -200,
          background: "radial-gradient(circle, rgba(34,211,238,0.17) 0%, rgba(6,182,212,0.06) 45%, transparent 70%)",
          filter: "blur(72px)",
          animation: "bgDriftA 32s ease-in-out infinite",
          willChange: "transform",
        }}
      />

      {/* ② Aurora orb — sky-blue, bottom-left */}
      <div
        className="absolute rounded-full"
        style={{
          width: 680, height: 680,
          bottom: -240, left: -200,
          background: "radial-gradient(circle, rgba(56,189,248,0.13) 0%, rgba(14,165,233,0.05) 45%, transparent 70%)",
          filter: "blur(90px)",
          animation: "bgDriftB 26s ease-in-out infinite",
          willChange: "transform",
        }}
      />

      {/* ② Aurora orb — indigo, center (threat depth) */}
      <div
        className="absolute rounded-full"
        style={{
          width: 520, height: 520,
          top: "35%", left: "48%",
          transform: "translate(-50%, -50%)",
          background: "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 68%)",
          filter: "blur(100px)",
          animation: "bgBreathe 20s ease-in-out infinite",
          willChange: "transform, opacity",
        }}
      />

      {/* ② Aurora orb — rose, far bottom-right (subtle threat indicator) */}
      <div
        className="absolute rounded-full"
        style={{
          width: 420, height: 420,
          bottom: -120, right: -80,
          background: "radial-gradient(circle, rgba(244,63,94,0.06) 0%, transparent 65%)",
          filter: "blur(80px)",
          animation: "bgDriftC 38s ease-in-out infinite",
          willChange: "transform",
        }}
      />

      {/* ③ Hexagonal SVG grid */}
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        style={{ opacity: 1 }}
      >
        <defs>
          {/*
            Flat-top hex, circumradius R = 32
            Width = 2R = 64, Height = √3·R ≈ 55.4
            Tile: 3 hexes per row repetition = width 96, height 55.4
            Centers: col 1 at x=32, col 2 at x=80 (offset up half-row)
          */}
          <pattern
            id="soc-hex"
            x="0" y="0"
            width="96" height="55.4"
            patternUnits="userSpaceOnUse"
          >
            {/* Col A hex */}
            <polygon
              points="64,27.7 48,55.4 16,55.4 0,27.7 16,0 48,0"
              fill="none"
              stroke="rgba(34,211,238,0.07)"
              strokeWidth="0.8"
            />
            {/* Col B hex (right column, half-row offset — wraps top & bottom) */}
            <polygon
              points="112,0 128,27.7 112,55.4 80,55.4 64,27.7 80,0"
              fill="none"
              stroke="rgba(34,211,238,0.07)"
              strokeWidth="0.8"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#soc-hex)" />
      </svg>

      {/* ④ SVG fractal noise grain */}
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        style={{ opacity: 0.55, mixBlendMode: "overlay" as React.CSSProperties["mixBlendMode"] }}
      >
        <defs>
          <filter id="soc-grain">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.68"
              numOctaves="4"
              stitchTiles="stitch"
            />
          </filter>
        </defs>
        <rect width="100%" height="100%" filter="url(#soc-grain)" opacity="0.09" />
      </svg>

      {/* ⑤ Radar sweep beam */}
      <div
        className="absolute top-0 bottom-0"
        style={{
          width: 280,
          background: "linear-gradient(90deg, transparent 0%, rgba(34,211,238,0.025) 50%, transparent 100%)",
          animation: "bgRadarSweep 9s ease-in-out infinite",
          animationDelay: "3s",
          willChange: "transform",
        }}
      />

      {/* ⑥ Top edge glow */}
      <div
        className="absolute top-0 left-0 right-0"
        style={{
          height: 1,
          background: "linear-gradient(90deg, transparent 5%, rgba(34,211,238,0.35) 35%, rgba(34,211,238,0.5) 50%, rgba(34,211,238,0.35) 65%, transparent 95%)",
          boxShadow: "0 0 40px 6px rgba(34,211,238,0.07)",
        }}
      />

      {/* ⑥ Vignette — darkens edges so content pops */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 90% 85% at 60% 48%, transparent 0%, rgba(2,5,8,0.72) 100%)",
        }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main Page
───────────────────────────────────────────── */
export default function DashboardPage() {
  const { activeTab } = useUIStore();
  const [alerts, setAlerts] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);

  const uploadFile = async (file: File) => {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await fetch("http://localhost:8080/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setAlerts(data.alerts || []);
      setEvents(data.events || []);
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      {/* Global styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&family=Syne:wght@400;600;700;800&display=swap');

        :root {
          --cyan: #22d3ee;
          --cyan-dim: rgba(34,211,238,0.15);
          --red-glow: rgba(239,68,68,0.3);
          --panel-bg: rgba(4,8,14,0.82);
        }

        * { box-sizing: border-box; }

        /* ── Scanlines (fixed, above everything except modals) ── */
        body::after {
          content: '';
          position: fixed;
          inset: 0;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 3px,
            rgba(0,0,0,0.035) 3px,
            rgba(0,0,0,0.035) 4px
          );
          pointer-events: none;
          z-index: 9999;
        }

        /* ── Scrollbar ── */
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #020508; }
        ::-webkit-scrollbar-thumb { background: #1e2a35; border-radius: 2px; }
        ::-webkit-scrollbar-thumb:hover { background: #2d3f4f; }

        /* ── Tab enter ── */
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .tab-enter { animation: fadeSlideUp 0.35s ease forwards; }

        /* ── Shimmer skeleton ── */
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        .shimmer-loading {
          background: linear-gradient(90deg, #0d1117 25%, #161f2a 50%, #0d1117 75%);
          background-size: 200% 100%;
          animation: shimmer 1.4s infinite;
        }

        /* ── Aurora orb animations ── */
        @keyframes bgDriftA {
          0%   { transform: translate(0px,   0px)   scale(1);    }
          20%  { transform: translate(-55px, 90px)  scale(1.06); }
          45%  { transform: translate(35px,  150px) scale(0.95); }
          70%  { transform: translate(90px,  50px)  scale(1.05); }
          100% { transform: translate(0px,   0px)   scale(1);    }
        }

        @keyframes bgDriftB {
          0%   { transform: translate(0px,  0px)   scale(1);    }
          35%  { transform: translate(75px, -95px) scale(1.1);  }
          65%  { transform: translate(-40px, 60px) scale(0.93); }
          100% { transform: translate(0px,  0px)   scale(1);    }
        }

        @keyframes bgBreathe {
          0%, 100% { opacity: 0.7; transform: translate(-50%, -50%) scale(1);    }
          50%       { opacity: 1;   transform: translate(-50%, -50%) scale(1.35); }
        }

        @keyframes bgDriftC {
          0%   { transform: translate(0px, 0px)    scale(1);    }
          50%  { transform: translate(-60px, -80px) scale(1.12); }
          100% { transform: translate(0px,  0px)   scale(1);    }
        }

        /* ── Radar sweep ── */
        @keyframes bgRadarSweep {
          0%   { transform: translateX(-320px); opacity: 0;   }
          8%   { opacity: 1; }
          92%  { opacity: 1; }
          100% { transform: translateX(100vw);  opacity: 0;   }
        }

        .font-display     { font-family: 'Syne', sans-serif; }
        .font-mono-custom { font-family: 'JetBrains Mono', monospace; }
      `}</style>

      <div className="flex min-h-screen font-mono-custom" style={{ background: "transparent" }}>
        {/* ── Fixed atmospheric background ── */}
        <BackgroundLayer />

        {/* ── Sidebar (sits above background) ── */}
        <div className="relative" style={{ zIndex: 10 }}>
          <Sidebar />
        </div>

        {/* ── Main content ── */}
        <main
          className="flex-1 overflow-y-auto relative"
          style={{ zIndex: 5, background: "transparent" }}
        >
          <div className="relative p-6 md:p-8">

            {/* ══════════════════════ DASHBOARD ══════════════════════ */}
            {activeTab === "dashboard" && (
              <div key="dashboard" className="tab-enter space-y-6">
                <SOCCommandCenter />
                <ThreatTrends />
                <LiveAttackGraph />

                {/* ── Telemetry Analysis Card ── */}
                <div
                  className="rounded-2xl border border-zinc-800/80 backdrop-blur-sm overflow-hidden"
                  style={{ background: "var(--panel-bg)" }}
                >
                  {/* Card header */}
                  <div className="px-6 py-4 border-b border-zinc-800/80 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {/* Animated status dot */}
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-60" />
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500" />
                      </span>
                      <h2 className="font-display text-white text-lg font-bold tracking-tight">
                        Telemetry Analysis
                      </h2>
                    </div>
                    <div className="flex items-center gap-2">
                      {alerts.length > 0 && (
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-red-950/80 text-red-400 border border-red-900/60">
                          {alerts.length} alert{alerts.length !== 1 ? "s" : ""}
                        </span>
                      )}
                      {events.length > 0 && (
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-cyan-950/80 text-cyan-400 border border-cyan-900/60">
                          {events.length} event{events.length !== 1 ? "s" : ""}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-6 space-y-8">
                    {/* Upload zone */}
                    {uploading ? (
                      <div className="rounded-xl border border-zinc-700 p-8 text-center shimmer-loading">
                        <p className="text-zinc-500 text-sm font-mono">Processing telemetry…</p>
                      </div>
                    ) : (
                      <UploadZone onFile={uploadFile} />
                    )}

                    {/* Alerts section */}
                    {alerts.length > 0 && (
                      <div>
                        <SectionHeading label="Alerts" count={alerts.length} color="red" />
                        <div>
                          {alerts.map((alert, idx) => (
                            <AlertCard key={idx} alert={alert} idx={idx} />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Events section */}
                    {events.length > 0 && (
                      <div>
                        <SectionHeading label="Parsed Events" count={events.length} color="cyan" />
                        <div
                          className="rounded-xl border border-zinc-800 bg-black/40 p-3 max-h-64 overflow-y-auto"
                          style={{ fontFamily: "'JetBrains Mono', monospace" }}
                        >
                          {events.map((event, idx) => (
                            <EventRow key={idx} event={event} idx={idx} />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Empty state */}
                    {alerts.length === 0 && events.length === 0 && !uploading && (
                      <div className="text-center py-6">
                        <p className="text-zinc-600 text-xs font-mono">
                          No data ingested yet — upload a telemetry file above
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <LogExplorer />
              </div>
            )}

            {/* ══════════════════════ ALERTS ══════════════════════ */}
            {activeTab === "alerts" && (
              <div key="alerts" className="tab-enter space-y-6">
                <SigmaStudio />
                <UEBADashboard />
              </div>
            )}

            {/* ══════════════════════ INCIDENTS ══════════════════════ */}
            {activeTab === "incidents" && (
              <div key="incidents" className="tab-enter">
                <CorrelatedIncidents />
              </div>
            )}

            {/* ══════════════════════ THREAT HUNTING ══════════════════════ */}
            {activeTab === "threat-hunting" && (
              <div key="threat-hunting" className="tab-enter">
                <ThreatHunting />
              </div>
            )}

            {/* ══════════════════════ MITRE ══════════════════════ */}
            {activeTab === "mitre" && (
              <div key="mitre" className="tab-enter">
                <MitreHeatmap />
              </div>
            )}

            {/* ══════════════════════ AI ASSISTANT ══════════════════════ */}
            {activeTab === "ai-assistant" && (
              <div key="ai-assistant" className="tab-enter">
                <AIPanel />
              </div>
            )}

            {/* ══════════════════════ SETTINGS ══════════════════════ */}
            {activeTab === "settings" && (
              <div key="settings" className="tab-enter">
                <div className="rounded-2xl border border-zinc-800/80 backdrop-blur-sm overflow-hidden"
                  style={{ background: "var(--panel-bg)" }}>
                  <div className="px-6 py-4 border-b border-zinc-800/80">
                    <h2 className="font-display text-white text-lg font-bold tracking-tight">
                      Rule Management
                    </h2>
                    <p className="text-zinc-500 text-xs mt-0.5">Upload and manage Sigma detection rules</p>
                  </div>
                  <div className="p-6">
                    <SigmaUpload />
                  </div>
                </div>
              </div>
            )}

          </div>
        </main>
      </div>
    </>
  );
}
