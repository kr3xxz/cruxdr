"use client";

import { motion } from "framer-motion";

import { useLiveEvents } from "@/hooks/use-live-events";

import { useEventStore } from "@/store/live-events";

export function LiveAttackFeed() {

  useLiveEvents();

  const events =
    useEventStore(
      (state) => state.events
    );

  return (
    <div className="glass-panel rounded-xl p-6 h-[500px] overflow-hidden">

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-950/60 border border-red-500/30">
            <svg className="h-4 w-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Live Attack Stream</h2>
            <p className="text-[11px] text-zinc-500 font-mono">Real-time events</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] text-zinc-500 font-mono">Live</span>
        </div>
      </div>

      <div className="space-y-3 overflow-y-auto h-[380px]">

        {(events ?? []).map(
          (event, index) => (

            <motion.div
              key={index}

              initial={{
                opacity: 0,
                x: 50,
              }}

              animate={{
                opacity: 1,
                x: 0,
              }}

              className="
                bg-slate-950
                border
                border-slate-700/20
                rounded-lg
                p-4
                hover:border-slate-600/40
                transition-all
                duration-200
              "
            >
              <div className="flex items-center justify-between">

                <p className="text-red-400 font-semibold uppercase tracking-wide">
                  {event.attack_type?.replace(/_/g, " ")}
                </p>

                <div className="flex items-center gap-2">
                  {event.count > 1 && (
                    <span className="text-[10px] font-mono text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded-full">
                      {event.count} events
                    </span>
                  )}
                  <div className="w-3 h-3 rounded-full bg-slate-800 animate-pulse" />
                </div>
              </div>

              <p className="text-zinc-300 mt-2">
                {event.message}
              </p>

              <div className="flex items-center gap-3 mt-2">
                {event.mitre_technique && (
                  <span className="text-violet-400 text-sm font-mono">
                    MITRE: {event.mitre_technique}
                  </span>
                )}
                {event.tactic && (
                  <span className="text-zinc-500 text-sm">
                    {event.tactic}
                  </span>
                )}
              </div>
            </motion.div>
          )
        )}

      </div>
    </div>
  );
}
