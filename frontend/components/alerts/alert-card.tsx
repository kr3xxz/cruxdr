"use client";

import { motion } from "framer-motion";
import { SeverityPill } from "@/components/ui/severity-badge";

interface Props {
  severity: string;
  title: string;
  source_ip: string;
  technique: string;
}

export function AlertCard({
  severity,
  title,
  source_ip,
  technique,
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-depth rounded-xl p-4 group hover:border-zinc-700 transition-all duration-200"
    >
      <div className="flex justify-between items-start mb-2">
        <SeverityPill severity={severity} />
        <span className="text-zinc-500 text-[10px] font-mono">
          {technique}
        </span>
      </div>

      <h3 className="text-white font-semibold tracking-tight">
        {title}
      </h3>

      <p className="text-zinc-500 text-xs mt-2 font-mono">
        Source IP: {source_ip}
      </p>
    </motion.div>
  );
}
