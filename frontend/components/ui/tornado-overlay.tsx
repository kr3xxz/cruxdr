"use client";

import { useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";

interface Particle {
  x: number; y: number; size: number; delay: number; duration: number;
  angle: number; radius: number; color: string; rise: number; zigzag: number;
}

interface LightningBolt {
  id: number; x: number; delay: number; duration: number; height: number;
  branches: { x: number; y: number; side: -1 | 1 }[];
}

export function TornadoOverlay({ onComplete }: { onComplete: () => void }) {
  const overlayRef = useRef<HTMLDivElement>(null);

  const particles = useMemo<Particle[]>(() =>
    Array.from({ length: 120 }, (_, i) => {
      const angle = Math.random() * 360;
      const radius = 15 + Math.random() * 45;
      return {
        x: 50 + radius * Math.cos((angle * Math.PI) / 180),
        y: 50 + radius * Math.sin((angle * Math.PI) / 180),
        size: 1.5 + Math.random() * 5,
        delay: Math.random() * 1.0,
        duration: 0.8 + Math.random() * 1.5,
        angle,
        radius,
        rise: -20 - Math.random() * 40,
        zigzag: (Math.random() - 0.5) * 30,
        color: [
          "#06f", "#0ff", "#f0f", "#ff0", "#0f0", "#fff",
          "#06f", "#0ff", "#f0f", "#a0f",
        ][i % 10],
      };
    }), [],
  );

  const bolts = useMemo<LightningBolt[]>(() =>
    Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: 15 + Math.random() * 70,
      delay: 0.2 + Math.random() * 1.2,
      duration: 0.08 + Math.random() * 0.12,
      height: 20 + Math.random() * 50,
      branches: Array.from({ length: 2 + Math.floor(Math.random() * 4) }, () => ({
        x: (Math.random() - 0.5) * 15,
        y: Math.random() * 60,
        side: Math.random() > 0.5 ? 1 : -1,
      })),
    })), [],
  );

  const sparks = useMemo<{ x: number; y: number; delay: number; duration: number; driftX: number; driftY: number; size: number }[]>(() =>
    Array.from({ length: 40 }, () => ({
      x: 30 + Math.random() * 40,
      y: 20 + Math.random() * 60,
      delay: Math.random() * 2.0,
      duration: 0.3 + Math.random() * 0.6,
      driftX: (Math.random() - 0.5) * 40,
      driftY: -10 - Math.random() * 30,
      size: 1 + Math.random() * 3,
    })), [],
  );

  useEffect(() => {
    const t = setTimeout(() => onComplete(), 3200);
    return () => clearTimeout(t);
  }, [onComplete]);

  return (
    <motion.div
      ref={overlayRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Dark cybergrid background */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(0deg, rgba(0,10,30,1) 0%, rgba(0,5,20,1) 100%),
            repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(0,255,255,0.03) 40px, rgba(0,255,255,0.03) 41px),
            repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(0,255,255,0.03) 40px, rgba(0,255,255,0.03) 41px)
          `,
        }}
        animate={{ scale: [1, 1.15, 1.3], opacity: [1, 0.8, 0] }}
        transition={{ duration: 3.0, ease: "easeIn" }}
      />

      {/* Screen shake container */}
      <motion.div
        className="absolute inset-0"
        animate={{ x: [0, 3, -2, 5, -3, 2, -1, 0], y: [0, -2, 4, -3, 2, -4, 1, 0] }}
        transition={{ duration: 3.0, ease: "easeInOut" }}
      >

        {/* Lightning bolts */}
        {bolts.map((bolt) => (
          <motion.div
            key={`bolt-${bolt.id}`}
            className="absolute pointer-events-none"
            style={{ left: `${bolt.x}%`, top: `${50 - bolt.height / 2}%` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0.8, 0, 1, 0] }}
            transition={{ duration: bolt.duration, delay: bolt.delay, times: [0, 0.1, 0.2, 0.5, 0.6, 1] }}
          >
            <svg width="120" height={bolt.height * 1.5} viewBox={`0 0 120 ${bolt.height * 2}`} className="overflow-visible">
              <defs>
                <filter id={`glow-${bolt.id}`}>
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>
              <path
                d={`
                  M 60 0
                  L ${60 + (Math.random() - 0.5) * 20} ${bolt.height * 0.2}
                  L ${60 + (Math.random() - 0.5) * 30} ${bolt.height * 0.4}
                  L ${60 + (Math.random() - 0.5) * 25} ${bolt.height * 0.6}
                  L ${60 + (Math.random() - 0.5) * 35} ${bolt.height * 0.8}
                  L ${60 + (Math.random() - 0.5) * 20} ${bolt.height}
                  ${bolt.branches.map((b, j) =>
                    `M ${60 + (Math.random() - 0.5) * 15} ${b.y}
                     L ${60 + b.x * b.side} ${b.y + Math.random() * 20}`
                  ).join('\n')}
                `}
                stroke="#0ff"
                strokeWidth="2"
                fill="none"
                filter={`url(#glow-${bolt.id})`}
                opacity={0.9}
              />
              <path
                d={`
                  M 60 0
                  L ${60 + (Math.random() - 0.5) * 20} ${bolt.height * 0.2}
                  L ${60 + (Math.random() - 0.5) * 30} ${bolt.height * 0.4}
                `}
                stroke="#fff"
                strokeWidth="1"
                fill="none"
                opacity={1}
              />
            </svg>
          </motion.div>
        ))}

        {/* Main tornado body — rotating funnel */}
        <motion.div
          className="absolute"
          style={{
            width: "55vh",
            height: "85vh",
            top: "7%",
            left: "50%",
            marginLeft: "-27.5vh",
            perspective: "1000px",
            transformStyle: "preserve-3d",
          }}
        >
          {/* Rotating ring layers */}
          {[0, 1, 2, 3, 4, 5].map((layer) => {
            const w = 55 - layer * 7;
            const h = 85 - layer * 5;
            const isInner = layer >= 3;
            return (
              <motion.div
                key={`ring-${layer}`}
                className="absolute rounded-full"
                style={{
                  width: `${w}vh`,
                  height: `${h * 0.35}vh`,
                  top: `${layer * 7}%`,
                  left: "50%",
                  marginLeft: `${-w / 2}vh`,
                  border: `1.5px solid ${isInner ? "rgba(255,0,255,0.25)" : "rgba(0,255,255,0.15)"}`,
                  boxShadow: isInner
                    ? `0 0 ${8 + layer * 3}px rgba(255,0,255,0.15), inset 0 0 ${8 + layer * 3}px rgba(255,0,255,0.05)`
                    : `0 0 ${6 + layer * 2}px rgba(0,255,255,0.1), inset 0 0 ${6 + layer * 2}px rgba(0,255,255,0.03)`,
                  transformOrigin: "center center",
                  transformStyle: "preserve-3d",
                  borderRadius: "50%",
                  background: isInner
                    ? `radial-gradient(ellipse, rgba(255,0,255,0.03) 0%, transparent 70%)`
                    : `radial-gradient(ellipse, rgba(0,255,255,0.03) 0%, transparent 70%)`,
                }}
                initial={{ rotateX: 70, rotateZ: 0, scale: 0, opacity: 0 }}
                animate={{
                  rotateX: [70, 75, 70],
                  rotateZ: [0, 360 * (layer % 2 === 0 ? 1 : -1)],
                  scale: [0, 1.05, 0.95, 1],
                  opacity: [0, 0.8, 0.6, 0.5 - layer * 0.05],
                }}
                transition={{
                  duration: 3.0,
                  delay: layer * 0.06,
                  rotateZ: { duration: 2.5 - layer * 0.3, ease: "linear", repeat: Infinity },
                  ease: "easeInOut",
                }}
              />
            );
          })}

          {/* Funnel column — clipping and wobble */}
          <motion.div
            className="absolute"
            style={{
              width: "100%",
              height: "100%",
              top: 0,
              left: 0,
              clipPath: "polygon(35% 0%, 65% 0%, 78% 15%, 82% 25%, 72% 35%, 80% 45%, 75% 55%, 82% 65%, 78% 78%, 65% 90%, 55% 100%, 45% 100%, 35% 90%, 22% 78%, 18% 65%, 25% 55%, 20% 45%, 28% 35%, 18% 25%, 22% 15%)",
              background: `
                linear-gradient(180deg,
                  transparent 0%,
                  rgba(0,255,255,0.04) 10%,
                  rgba(0,255,255,0.07) 20%,
                  rgba(255,0,255,0.05) 35%,
                  rgba(0,255,255,0.08) 50%,
                  rgba(255,0,255,0.04) 65%,
                  rgba(0,255,255,0.06) 80%,
                  rgba(0,255,255,0.02) 90%,
                  transparent 100%
                )
              `,
              filter: "blur(4px)",
            }}
            initial={{ scaleY: 0, scaleX: 0, opacity: 0 }}
            animate={{
              scaleY: [0, 1, 0.9, 1.05, 0.95],
              scaleX: [0, 1, 0.85, 1.1, 0.9],
              opacity: [0, 1, 0.8, 1, 0.9],
              x: [0, -10, 8, -5, 3, 0],
            }}
            transition={{ duration: 3.0, ease: "easeInOut" }}
          />

          {/* Inner glow column */}
          <motion.div
            className="absolute"
            style={{
              width: "30%",
              height: "100%",
              top: 0,
              left: "35%",
              background: "linear-gradient(180deg, transparent 0%, rgba(0,255,255,0.04) 15%, rgba(255,0,255,0.03) 40%, rgba(0,255,255,0.05) 60%, rgba(0,255,255,0.02) 85%, transparent 100%)",
              filter: "blur(12px)",
            }}
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{
              scaleY: [0, 1, 0.8, 1.1, 0.9],
              opacity: [0, 0.6, 0.4, 0.5, 0.3],
            }}
            transition={{ duration: 3.0, ease: "easeInOut" }}
          />
        </motion.div>

        {/* Debris particles — spiral into center */}
        {particles.map((p, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute rounded-full"
            style={{
              width: p.size,
              height: p.size,
              top: `${p.y}%`,
              left: `${p.x}%`,
              backgroundColor: p.color,
              boxShadow: `0 0 ${p.size * 2}px ${p.color}40`,
            }}
            initial={{ x: 0, y: 0, opacity: 0, scale: 1 }}
            animate={{
              x: [
                0,
                (50 - p.x) * 0.4 + p.zigzag * 0.3,
                (50 - p.x) * 0.7 + p.zigzag * 0.6,
                (50 - p.x) * 0.9 + p.zigzag,
              ],
              y: [
                0,
                (50 - p.y) * 0.3 + p.rise * 0.3,
                (50 - p.y) * 0.6 + p.rise * 0.6,
                (50 - p.y) * 0.9 + p.rise,
              ],
              opacity: [0, 1, 0.6, 0],
              scale: [1, 0.7, 0.3, 0],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              ease: [0.25, 0.1, 0.25, 1],
            }}
          />
        ))}

        {/* Sparks — quick bright bursts */}
        {sparks.map((s, i) => (
          <motion.div
            key={`spark-${i}`}
            className="absolute rounded-full"
            style={{
              width: s.size,
              height: s.size,
              top: `${s.y}%`,
              left: `${s.x}%`,
              backgroundColor: "#fff",
              boxShadow: `0 0 ${s.size * 4}px #0ff, 0 0 ${s.size * 8}px #06f`,
            }}
            animate={{
              x: [0, s.driftX],
              y: [0, s.driftY],
              opacity: [0, 1, 0.8, 0],
              scale: [0, 1.5, 1, 0],
            }}
            transition={{
              duration: s.duration,
              delay: s.delay,
              ease: "easeOut",
            }}
          />
        ))}

        {/* Central flash orb */}
        <motion.div
          className="absolute rounded-full"
          style={{
            width: "20vh",
            height: "20vh",
            top: "50%",
            left: "50%",
            marginLeft: "-10vh",
            marginTop: "-5vh",
            background: "radial-gradient(circle, rgba(0,255,255,0.12) 0%, rgba(255,0,255,0.06) 30%, transparent 60%)",
            filter: "blur(10px)",
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: [0, 2, 1.2, 2.5, 0.5, 0],
            opacity: [0, 0.5, 0.3, 0.6, 0.2, 0],
          }}
          transition={{ duration: 3.0, ease: "easeInOut" }}
        />

        {/* Data fragment glyphs */}
        {Array.from({ length: 15 }, (_, i) => (
          <motion.div
            key={`glyph-${i}`}
            className="absolute font-mono text-xs font-bold pointer-events-none"
            style={{
              top: `${15 + Math.random() * 70}%`,
              left: `${10 + Math.random() * 80}%`,
              color: ["#0ff", "#f0f", "#06f", "#0f0"][i % 4],
              textShadow: `0 0 6px ${["#0ff", "#f0f", "#06f", "#0f0"][i % 4]}`,
              opacity: 0.6,
            }}
            initial={{ y: 0, opacity: 0 }}
            animate={{
              y: [0, -40 - Math.random() * 60],
              opacity: [0, 0.7, 0.3, 0],
              rotate: [0, (Math.random() - 0.5) * 180],
            }}
            transition={{
              duration: 1.5 + Math.random() * 1.0,
              delay: Math.random() * 2.0,
              ease: "easeOut",
            }}
          >
            {["0x7F", "ERR", "NULL", "0x00", "SIG", "SEGV", "0xFF", "DATA", "0xDE", "0xAD", "VOID", "NOP", "HALT", "SYNC", "ACK"][i]}
          </motion.div>
        ))}
      </motion.div>

      {/* Edge vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, transparent 30%, rgba(0,5,15,0.8) 70%, rgba(0,2,10,1) 100%)",
        }}
      />

      {/* Final bright flash */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{
          opacity: [0, 0.25, 0, 0.15, 0.4, 0],
        }}
        transition={{
          duration: 3.0,
          times: [0, 0.1, 0.2, 0.6, 0.8, 1],
          ease: "easeInOut",
        }}
        style={{ background: "white" }}
      />

      {/* Scanline overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,255,0.015) 2px, rgba(0,255,255,0.015) 4px)",
          mixBlendMode: "overlay",
        }}
      />
    </motion.div>
  );
}
