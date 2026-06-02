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
                bg-black
                border
                border-red-500/20
                rounded-lg
                p-4
              "
            >
              <div className="flex items-center justify-between">

                <p className="text-red-400 font-semibold uppercase">
                  {event.attack_type}
                </p>

                <div className="
                  w-3
                  h-3
                  rounded-full
                  bg-red-500
                  animate-pulse
                " />
              </div>

              <p className="text-zinc-300 mt-2">
                {event.message}
              </p>

              <p className="text-zinc-500 text-sm mt-2">
                MITRE:
                {" "}
                {event.mitre_technique}
              </p>
            </motion.div>
          )
        )}

      </div>
    </div>
  );
}
