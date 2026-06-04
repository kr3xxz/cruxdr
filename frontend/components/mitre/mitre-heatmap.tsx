"use client";

import { motion } from "framer-motion";

import { useEventStore } from "@/store/event-store";

const mitreTechniques = [

  {
    id: "T1486",
    name: "Data Encrypted for Impact",
    tactic: "Impact",
  },

  {
    id: "T1110",
    name: "Brute Force",
    tactic: "Credential Access",
  },

  {
    id: "T1021",
    name: "Remote Services",
    tactic: "Lateral Movement",
  },
];

export function MitreHeatmap() {

  const events =
    useEventStore(
      (state) => state.events
    );

  const activeTechniques =
    mitreTechniques.map(
      (technique) => {

        const matched =
          (events ?? []).filter(
            (event: any) =>
              event.mitre ===
              technique.id
          );

        return {

          ...technique,

          count:
            matched.length,
        };
      }
    );

  const totalDetections =
    activeTechniques.reduce(
      (acc, item) =>
        acc + item.count,
      0
    );

  return (
    <div className="
      bg-slate-950
      border
      border-zinc-800
      rounded-xl
      p-6
    ">

      <h2 className="
        text-white
        text-4xl
        font-bold
        mb-2
      ">
        MITRE ATT&CK Heatmap
      </h2>

      <p className="
        text-zinc-400
        mb-6
      ">
        Active techniques detected
      </p>

      <div className="
        text-red-400
        text-5xl
        font-bold
        mb-10
      ">
        {totalDetections}
      </div>

      <div className="
        grid
        grid-cols-3
        gap-6
      ">

        {activeTechniques.map(
          (
            technique,
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

              className={`
                rounded-xl
                p-5
                border

                ${
                  technique.count > 0
                    ? "bg-red-950 border-slate-700"
                    : "bg-zinc-950 border-zinc-800"
                }
              `}
            >

              <div className="
                flex
                justify-between
                items-center
                mb-3
              ">

                <span className="
                  text-red-400
                  font-bold
                ">
                  {technique.id}
                </span>

                <span className="
                  text-white
                  font-bold
                  text-xl
                ">
                  {technique.count}
                </span>

              </div>

              <h3 className="
                text-white
                font-semibold
                mb-2
              ">
                {technique.name}
              </h3>

              <p className="
                text-zinc-400
                text-sm
              ">
                {technique.tactic}
              </p>

            </motion.div>
          )
        )}

      </div>

    </div>
  );
}
