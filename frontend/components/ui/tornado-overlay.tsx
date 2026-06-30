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

export function TornadoOverlay({ onComplete }: { onComplete: () => void }) {
  const debris = useMemo<Debris[]>(
    () =>
      Array.from({ length: 60 }, (_, i) => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 2 + Math.random() * 6,
        delay: Math.random() * 0.8,
        duration: 1 + Math.random() * 1.2,
        drift: (Math.random() - 0.5) * 60,
        color: [
          "bg-cyan-400/60",
          "bg-amber-500/50",
          "bg-red-500/50",
          "bg-violet-400/50",
          "bg-zinc-300/60",
          "bg-emerald-400/50",
          "bg-blue-400/50",
          "bg-fuchsia-400/50",
          "bg-rose-400/50",
        ][i % 9],
      })),
    []
  );

  const suckLines = useMemo<SuckLine[]>(
    () =>
      Array.from({ length: 24 }, (_, i) => ({
        angle: (i / 24) * 360,
        delay: 0.3 + Math.random() * 1.0,
        length: 20 + Math.random() * 50,
      })),
    []
  );

  useEffect(() => {
    const t = setTimeout(() => onComplete(), 2800);
    return () => clearTimeout(t);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden pointer-events-none"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ perspective: "800px" }}
    >
      {[0, 1, 2, 3].map((layer) => (
        <motion.div
          key={layer}
          className="absolute"
          style={{
            width: `${60 - layer * 10}vh`,
            height: `${60 - layer * 10}vh`,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            borderRadius: "50%",
            background: `radial-gradient(ellipse, oklch(0.4 0.2 260 / ${0.04 - layer * 0.008}) 0%, transparent 70%)`,
            border: `1px solid oklch(0.5 0.2 260 / ${0.03 - layer * 0.005})`,
          }}
          initial={{ scale: 0, rotate: 0, opacity: 0 }}
          animate={{
            scale: [0, 1.1, 0.9, 1],
            rotate: [0, 180, 360],
            opacity: [0, 0.8, 0.6, 0.4],
          }}
          transition={{
            duration: 2.8,
            delay: layer * 0.08,
            ease: "easeInOut",
          }}
        />
      ))}

      <motion.div
        className="absolute"
        style={{
          width: "30vh",
          height: "80vh",
          top: "10%",
          left: "50%",
          transform: "translateX(-50%)",
          background: "linear-gradient(180deg, transparent 0%, oklch(0.45 0.2 260 / 0.06) 30%, oklch(0.5 0.2 260 / 0.08) 50%, oklch(0.45 0.2 260 / 0.06) 70%, transparent 100%)",
          clipPath: "polygon(45% 0%, 55% 0%, 70% 20%, 75% 35%, 65% 50%, 72% 65%, 68% 80%, 55% 100%, 45% 100%, 32% 80%, 28% 65%, 35% 50%, 25% 35%, 30% 20%)",
          filter: "blur(4px)",
        }}
        initial={{ scaleY: 0, opacity: 0 }}
        animate={{
          scaleY: [0, 1, 0.8, 1.1, 0.9],
          opacity: [0, 1, 0.8, 1, 0.9],
          x: [0, -20, 15, -10, 0],
        }}
        transition={{ duration: 2.8, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute"
        style={{
          width: "35vh",
          height: "35vh",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          borderRadius: "50%",
          background: "radial-gradient(circle, oklch(0.55 0.25 260 / 0.08) 0%, oklch(0.5 0.2 260 / 0.03) 40%, transparent 70%)",
          filter: "blur(8px)",
        }}
        initial={{ scale: 0 }}
        animate={{
          scale: [0, 1.5, 0.8, 1.2, 0],
          opacity: [0, 0.6, 0.4, 0.5, 0],
        }}
        transition={{ duration: 2.8, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, white 0%, transparent 60%)",
          opacity: 0.15,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.15, 0] }}
        transition={{ duration: 2.8, ease: "easeInOut" }}
      />

      {debris.map((d, i) => (
        <motion.div
          key={`debris-${i}`}
          className={`absolute rounded-full ${d.color}`}
          style={{
            width: d.size,
            height: d.size,
            top: `${d.y}%`,
            left: `${d.x}%`,
          }}
          initial={{ x: 0, y: 0, opacity: 0 }}
          animate={{
            x: [0, (50 - d.x) * 2 + d.drift, (50 - d.x) * 3 + d.drift * 1.5],
            y: [0, (50 - d.y) * 2, (50 - d.y) * 3 + 20],
            opacity: [0, 1, 0],
            scale: [1, 0.5, 0.2],
            rotate: [0, 720 + Math.random() * 360],
          }}
          transition={{
            duration: d.duration,
            delay: d.delay,
            ease: "easeIn",
          }}
        />
      ))}

      {suckLines.map((line, i) => {
        const rad = (line.angle * Math.PI) / 180;
        const cx = 50 + 30 * Math.cos(rad);
        const cy = 50 + 30 * Math.sin(rad);
        return (
          <motion.div
            key={`suck-${i}`}
            className="absolute"
            style={{
              width: "1px",
              height: `${line.length}px`,
              top: `${cy}%`,
              left: `${cx}%`,
              transformOrigin: "center top",
              transform: `rotate(${line.angle}deg)`,
              background: `linear-gradient(to top, transparent, oklch(0.6 0.2 260 / 0.06), transparent)`,
            }}
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{
              scaleY: [0, 1, 0],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: 1.5,
              delay: line.delay,
              ease: "easeOut",
            }}
          />
        );
      })}

      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{
          opacity: [0, 0.3, 0, 0.2, 0],
        }}
        transition={{
          duration: 2.8,
          times: [0, 0.15, 0.3, 0.45, 1],
          ease: "easeInOut",
        }}
        style={{
          background: "white",
        }}
      />
    </motion.div>
  );
}
