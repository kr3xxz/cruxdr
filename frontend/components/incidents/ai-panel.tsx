"use client";

import { motion } from "framer-motion";

import { useEventStore } from "@/store/event-store";

export function AIPanel() {

  const events =
    useEventStore(
      (state) => state.events
    );

  const latest =
    events[0];

  const severity =
    latest?.severity ||
    "medium";

  const attack =
    latest?.attack_type ||
    "Suspicious activity";

  const recommendation =
    severity === "critical"
      ? "Immediately isolate affected systems and block malicious indicators."
      : severity === "high"
      ? "Investigate suspicious activity and monitor lateral movement."
      : "Monitor affected systems.";

  return (

    <div className="
      bg-black
      border
      border-zinc-800
      rounded-xl
      p-6
    ">

      <h2 className="
        text-white
        text-4xl
        font-bold
        mb-8
      ">
        AI SOC Assistant
      </h2>

      <div className="
        grid
        grid-cols-2
        gap-8
      ">

        <motion.div

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
            border-red-500/30
            rounded-xl
            p-6
          "
        >

          <h3 className="
            text-red-400
            text-2xl
            font-bold
            mb-6
          ">
            Threat Analysis
          </h3>

          <div className="
            space-y-4
          ">

            <div>

              <p className="
                text-zinc-400
                mb-2
              ">
                Threat Severity
              </p>

              <p className="
                text-white
                text-4xl
                font-bold
                uppercase
              ">
                {severity}
              </p>

            </div>

            <div>

              <p className="
                text-zinc-400
                mb-2
              ">
                AI Summary
              </p>

              <p className="
                text-white
                text-lg
              ">
                {attack} activity detected across monitored assets.
              </p>

            </div>

          </div>

        </motion.div>

        <motion.div

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
            border-red-500/30
            rounded-xl
            p-6
          "
        >

          <h3 className="
            text-red-400
            text-2xl
            font-bold
            mb-6
          ">
            AI Recommendations
          </h3>

          <div className="
            bg-black
            rounded-xl
            p-5
            text-zinc-200
            leading-7
          ">

            {recommendation}

          </div>

        </motion.div>

      </div>

      <div className="
        mt-10
      ">

        <h3 className="
          text-white
          text-3xl
          font-bold
          mb-6
        ">
          Live Security Telemetry
        </h3>

        <div className="
          space-y-4
        ">

          {events.map(
            (
              event,
              index
            ) => (

              <motion.div

                key={index}

                initial={{
                  opacity: 0,
                  x: -10,
                }}

                animate={{
                  opacity: 1,
                  x: 0,
                }}

                className="
                  bg-zinc-950
                  border
                  border-zinc-800
                  rounded-xl
                  p-5
                  flex
                  justify-between
                  items-start
                "
              >

                <div>

                  <h4 className="
                    text-white
                    text-2xl
                    font-bold
                    mb-3
                  ">
                    {event.attack_type}
                  </h4>

                  <p className="
                    text-zinc-400
                  ">
                    MITRE: {event.mitre}
                  </p>

                  <p className="
                    text-zinc-400
                  ">
                    Source: {event.source}
                  </p>

                </div>

                <div className="
                  text-red-400
                  font-bold
                  text-2xl
                  uppercase
                ">
                  {event.severity}
                </div>

              </motion.div>
            )
          )}

        </div>

      </div>

    </div>
  );
}
