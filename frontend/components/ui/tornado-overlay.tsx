"use client";

import { useEffect, useMemo } from "react";
import { motion } from "framer-motion";

interface Debris {
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
  drift: number;
  color: string;
}

interface SuckLine {
  angle: number;
  delay: number;
  length: number;
}

export function TornadoOverlay({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const debris = useMemo<Debris[]>(
    () =>
      Array.from({ length: 40 }, (_, i) => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 2 + Math.random() * 6,
        delay: Math.random() * 0.8,
        duration: 1 + Math.random() * 1.2,
        drift: (Math.random() - 0.5) * 40,
        color: [
          "bg-cyan-400/60",
          "bg-amber-500/50",
          "bg-red-500/50",
          "bg-violet-400/50",
          "bg-zinc-300/60",
          "bg-emerald-400/50",
          "bg-blue-400/50",
        ][i % 7],
      })),
    []
  );

  const suckLines = useMemo<SuckLine[]>(
    () =>
      Array.from({ length: 16 }, (_, i) => ({
        angle: (i / 16) * 360,
        delay: 0.3 + Math.random() * 1.0,
        length: 20 + Math.random() * 40,
      })),
    []
  );

  useEffect(() => {
    const t = setTimeout(() => onComplete(), 2800);
    return () => clearTimeout(t);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
    >
      <style>{`
        @keyframes tornado-spin {
          0% { transform: translate(-50%, -50%) rotate(0deg) scale(0.6); opacity: 0; }
          15% { opacity: 1; }
          50% { transform: translate(-50%, -50%) rotate(180deg) scale(1.2); }
          100% { transform: translate(-50%, -50%) rotate(360deg) scale(1.4); opacity: 0.8; }
        }
        @keyframes funnel-pulse {
          0%, 100% { transform: scaleY(1) scaleX(1); }
          50% { transform: scaleY(1.08) scaleX(0.95); }
        }
        @keyframes suck-in {
          0% { transform: translate(var(--start-x), var(--start-y)) scale(1); opacity: 0.6; }
          60% { opacity: 0.8; }
          100% { transform: translate(0, 0) scale(0); opacity: 0; }
        }
        @keyframes cloud-roll {
          0% { transform: translateX(0) scale(1); opacity: 0; }
          10% { opacity: 0.5; }
          90% { opacity: 0.5; }
          100% { transform: translateX(80px) scale(1.3); opacity: 0; }
        }
        @keyframes flash {
          0%, 100% { opacity: 0; }
          5% { opacity: 0.6; }
          6% { opacity: 0; }
          7% { opacity: 0.3; }
          8% { opacity: 0; }
        }
        @keyframes shake {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(-4px, 2px); }
          20% { transform: translate(3px, -3px); }
          30% { transform: translate(-2px, 4px); }
          40% { transform: translate(5px, -1px); }
          50% { transform: translate(-3px, 2px); }
          60% { transform: translate(2px, -4px); }
          70% { transform: translate(-5px, 3px); }
          80% { transform: translate(4px, -2px); }
          90% { transform: translate(-1px, 5px); }
        }
        @keyframes debris-orbit {
          0% { transform: rotate(var(--start-angle)) translateX(calc(var(--orbit-radius) * 1px)) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          100% { transform: rotate(calc(var(--start-angle) + 720deg)) translateX(0px) rotate(-360deg); opacity: 0; }
        }
        .tornado-container {
          position: absolute;
          top: 50%;
          left: 50%;
          animation: tornado-spin 2.5s ease-in-out forwards;
          transform-origin: center center;
        }
        .tornado-funnel {
          position: relative;
          width: 60px;
          height: 400px;
          animation: funnel-pulse 0.6s ease-in-out infinite;
        }
        .funnel-layer {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          border-radius: 50%;
          border: 2px solid rgba(6, 182, 212, 0.3);
          background: radial-gradient(
            ellipse at center,
            rgba(6, 182, 212, 0.15) 0%,
            rgba(103, 232, 249, 0.08) 40%,
            transparent 70%
          );
          box-shadow: 0 0 30px rgba(6, 182, 212, 0.1);
        }
        .funnel-layer:nth-child(1) { bottom: 0%; width: 20px; height: 8px; }
        .funnel-layer:nth-child(2) { bottom: 8%; width: 40px; height: 12px; }
        .funnel-layer:nth-child(3) { bottom: 16%; width: 65px; height: 16px; }
        .funnel-layer:nth-child(4) { bottom: 24%; width: 90px; height: 20px; }
        .funnel-layer:nth-child(5) { bottom: 32%; width: 110px; height: 24px; }
        .funnel-layer:nth-child(6) { bottom: 40%; width: 135px; height: 28px; }
        .funnel-layer:nth-child(7) { bottom: 48%; width: 155px; height: 30px; }
        .funnel-layer:nth-child(8) { bottom: 56%; width: 175px; height: 32px; }
        .funnel-layer:nth-child(9) { bottom: 64%; width: 190px; height: 34px; }
        .funnel-layer:nth-child(10) { bottom: 72%; width: 200px; height: 36px; }
        .funnel-layer:nth-child(11) { bottom: 80%; width: 180px; height: 40px; }
        .funnel-layer:nth-child(12) { bottom: 88%; width: 140px; height: 50px; }
        .funnel-layer:nth-child(13) { bottom: 96%; width: 80px; height: 60px; }
        .debris-particle {
          position: absolute;
          border-radius: 2px;
          animation: debris-orbit var(--duration) ease-in-out var(--delay) forwards;
          --start-angle: ${Math.random() * 360}deg;
          --orbit-radius: ${60 + Math.random() * 180};
        }
        .suck-line {
          position: absolute;
          top: 50%;
          left: 50%;
          width: var(--length);
          height: 1.5px;
          background: linear-gradient(90deg, rgba(6, 182, 212, 0.4), transparent);
          transform-origin: left center;
          transform: rotate(calc(var(--angle) * 1deg));
          animation: suck-in 1.2s ease-in var(--delay) forwards;
        }
        .cloud-mass {
          position: absolute;
          top: 5%;
          left: 50%;
          transform: translateX(-50%);
          width: 300px;
          height: 80px;
          background: radial-gradient(
            ellipse at center,
            rgba(30, 30, 50, 0.6) 0%,
            rgba(20, 20, 40, 0.4) 40%,
            transparent 70%
          );
          border-radius: 50%;
          animation: cloud-roll 2.5s ease-in-out forwards;
        }
        .flash-overlay {
          position: absolute;
          inset: 0;
          background: white;
          animation: flash 2.5s ease-in-out forwards;
          pointer-events: none;
        }
        .clear-text {
          position: absolute;
          bottom: 20%;
          left: 50%;
          transform: translateX(-50%);
          font-family: monospace;
          font-size: 14px;
          letter-spacing: 0.3em;
          color: rgba(6, 182, 212, 0.6);
          animation: fade-pulse 1.5s ease-in-out forwards;
        }
        @keyframes fade-pulse {
          0% { opacity: 0; transform: translateX(-50%) scale(0.8); }
          30% { opacity: 1; transform: translateX(-50%) scale(1); }
          70% { opacity: 1; }
          100% { opacity: 0; transform: translateX(-50%) scale(0.9); }
        }
      `}</style>

      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      <div className="flash-overlay" />

      <div className="absolute inset-0 animate-[shake_0.8s_ease-in-out_0.3s]" />

      <div className="cloud-mass" />

      <div className="tornado-container">
        <div className="tornado-funnel">
          {Array.from({ length: 13 }, (_, i) => (
            <div key={i} className="funnel-layer" style={{ animationDelay: `${i * 0.05}s` }} />
          ))}
        </div>
      </div>

      {debris.map((d, i) => (
        <div
          key={i}
          className={`debris-particle ${d.color}`}
          style={
            {
              top: `${d.y}%`,
              left: `${d.x}%`,
              width: d.size,
              height: d.size,
              "--delay": `${d.delay}s`,
              "--duration": `${d.duration}s`,
              "--start-angle": `${Math.random() * 360}deg`,
              "--orbit-radius": `${60 + Math.random() * 180}`,
            } as React.CSSProperties
          }
        />
      ))}

      {suckLines.map((s, i) => (
        <div
          key={i}
          className="suck-line"
          style={
            {
              "--angle": s.angle,
              "--delay": `${s.delay}s`,
              "--length": `${s.length}px`,
              "--start-x": `${Math.cos((s.angle * Math.PI) / 180) * 400}px`,
              "--start-y": `${Math.sin((s.angle * Math.PI) / 180) * 400}px`,
            } as React.CSSProperties
          }
        />
      ))}

      <div className="clear-text">PURGING SYSTEM</div>
    </motion.div>
  );
}
