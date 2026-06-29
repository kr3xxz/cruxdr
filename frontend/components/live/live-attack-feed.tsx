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
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 h-[500px] overflow-hidden">

      <h2 className="text-white text-xl font-semibold mb-6">
        Live Attack Stream
      </h2>

      <div className="space-y-3 overflow-y-auto h-[420px]">

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
              "
            >
              <div className="flex items-center justify-between">

                <p className="text-red-400 font-semibold uppercase">
                  {event.attack_type?.replace(/_/g, " ")}
                </p>

                <div className="flex items-center gap-2">
                  {event.count > 1 && (
                    <span className="text-[10px] font-mono text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded-full">
                      {event.count} events
                    </span>
                  )}
                  <div className="
                    w-3
                    h-3
                    rounded-full
                    bg-slate-800
                    animate-pulse
                  " />
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
