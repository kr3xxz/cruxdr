"use client";

import { motion } from "framer-motion";

import { useEventStore } from "@/store/event-store";

export function CorrelatedIncidents() {

  const incidents =
    useEventStore(
      (state) => state.events
    );

  return (
    <div className="
      bg-zinc-900
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
        Correlated Incidents
      </h2>

      <div className="
        space-y-5
      ">

        {(incidents ?? []).map(
          (
            incident,
            index
          ) => (

            <motion.div
              key={index}

              initial={{
                opacity: 0,
                y: 10,
              }}

              animate={{
                opacity: 1,
                y: 0,
              }}

              className="
                bg-black
                border
                border-red-500/20
                rounded-xl
                p-5
              "
            >

              <div className="
                flex
                justify-between
                items-center
                mb-4
              ">

                <div>

                  <h3 className="
                    text-white
                    text-xl
                    font-bold
                  ">
                    {incident.title}
                  </h3>

                  <p className="
                    text-zinc-400
                    text-sm
                    mt-1
                  ">
                    Source IP:
                    {" "}
                    {incident.source_ip}
                  </p>

                </div>

                <span className="
                  bg-red-600
                  text-white
                  px-4
                  py-2
                  rounded-lg
                  font-bold
                  uppercase
                ">
                  {incident.severity}
                </span>

              </div>

              <div className="
                grid
                grid-cols-2
                gap-4
              ">

                <div className="
                  bg-zinc-950
                  rounded-lg
                  p-4
                ">

                  <p className="
                    text-zinc-400
                    text-sm
                    mb-2
                  ">
                    MITRE Technique
                  </p>

                  <p className="
                    text-red-400
                    font-semibold
                  ">
                    T1110
                  </p>

                </div>

                <div className="
                  bg-zinc-950
                  rounded-lg
                  p-4
                ">

                  <p className="
                    text-zinc-400
                    text-sm
                    mb-2
                  ">
                    Detection Time
                  </p>

                  <p className="
                    text-white
                    font-semibold
                  ">
                    {new Date(
                      incident.timestamp
                    ).toLocaleTimeString()}
                  </p>

                </div>

              </div>

            </motion.div>
          )
        )}

      </div>

    </div>
  );
}
