"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAlertStore } from "@/store/alert-store";

export function SigmaStudio() {

  const [rules, setRules] =
    useState<any[]>([]);

  const alerts =
    useAlertStore(
      (state) => state.alerts
    );

  useEffect(() => {

    const loadRules =
      async () => {

        try {

          const res =
            await fetch(
              "http://localhost:8050/rules"
            );

          const data =
            await res.json();

          setRules(data);

        } catch (e) {

          console.error(e);
        }
      };

    loadRules();
    const interval = setInterval(loadRules, 3000);

    return () => clearInterval(interval);

  }, []);

  return (
    <div
      className="
        bg-zinc-900
        border
        border-zinc-800
        rounded-xl
        p-6
      "
    >

      <h2
        className="
          text-white
          text-2xl
          font-bold
          mb-6
        "
      >
        Sigma Studio
      </h2>

      <div className="space-y-4">

        {rules.map(
          (
            rule,
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
                bg-slate-950
                border
                border-zinc-800
                rounded-xl
                p-5
              "
            >

              <div
                className="
                  flex
                  justify-between
                  items-center
                "
              >

                <div>

                  <h3
                    className="
                      text-white
                      font-bold
                      text-lg
                    "
                  >
                    {rule.title}
                  </h3>

                  <p
                    className="
                      text-zinc-400
                      text-sm
                      mt-1
                    "
                  >
                    {rule.description}
                  </p>

                </div>

                <span
                  className="
                    text-red-400
                    font-semibold
                    uppercase
                  "
                >
                  {rule.severity}
                </span>

              </div>

            </motion.div>
          )
        )}

      </div>

      <div className="mt-8">

        <h3
          className="
            text-red-400
            text-xl
            font-semibold
            mb-4
          "
        >
          Triggered Alerts ({alerts.length})
        </h3>

        <div className="space-y-3">

          {alerts.map(
            (
              alert,
              index
            ) => (

              <div
                key={index}
                className="
                  bg-slate-950
                  border
                  border-red-900/20
                  rounded-lg
                  p-4
                "
              >

                <div
                  className="
                    flex
                    justify-between
                    items-center
                  "
                >

                  <p
                    className="
                      text-white
                    "
                  >
                    {alert.title}
                  </p>

                  <span
                    className="
                      text-red-400
                      font-bold
                      uppercase
                    "
                  >
                    {alert.severity}
                  </span>

                </div>

              </div>
            )
          )}

        </div>

      </div>

    </div>
  );
}
