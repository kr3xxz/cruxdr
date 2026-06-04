"use client";

import { motion } from "framer-motion";

import { useEventStore } from "@/store/event-store";

export function UEBADashboard() {

  const events =
    useEventStore(
      (state) => state.events
    );

  const risks =
    (events ?? []).map(
      (
        event,
        index
      ) => ({

        user:
          event.source ||
          "unknown",

        risk_score:
          90 - index * 3,

        severity:
          event.severity,
      })
    );

  const anomalies =
    (events ?? []).map(
      (
        event,
        index
      ) => ({

        type:
          event.attack_type,

        confidence:
          95 - index * 2,

        severity:
          event.severity,
      })
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
        text-3xl
        font-bold
        mb-8
      ">
        UEBA Analytics
      </h2>

      <div className="
        grid
        grid-cols-2
        gap-8
      ">

        <div>

          <h3 className="
            text-red-400
            text-2xl
            font-semibold
            mb-6
          ">
            User Risk Scores
          </h3>

          <div className="
            space-y-4
          ">

            {(risks ?? []).map(
              (
                risk,
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
                    bg-zinc-950
                    border
                    border-slate-700/20
                    rounded-xl
                    p-4
                  "
                >

                  <div className="
                    flex
                    justify-between
                    items-center
                  ">

                    <span className="
                      text-white
                      font-semibold
                    ">
                      {risk.user}
                    </span>

                    <span className="
                      text-red-400
                      font-bold
                    ">
                      {risk.risk_score}
                    </span>

                  </div>

                </motion.div>
              )
            )}

          </div>

        </div>

        <div>

          <h3 className="
            text-red-400
            text-2xl
            font-semibold
            mb-6
          ">
            Behavioral Anomalies
          </h3>

          <div className="
            space-y-4
          ">

            {(anomalies ?? []).map(
              (
                anomaly,
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
                    bg-zinc-950
                    border
                    border-slate-700/20
                    rounded-xl
                    p-4
                  "
                >

                  <div className="
                    flex
                    justify-between
                    items-center
                  ">

                    <span className="
                      text-white
                    ">
                      {anomaly.type}
                    </span>

                    <span className="
                      text-red-400
                      font-bold
                    ">
                      {anomaly.confidence}%
                    </span>

                  </div>

                </motion.div>
              )
            )}

          </div>

        </div>

      </div>

    </div>
  );
}
