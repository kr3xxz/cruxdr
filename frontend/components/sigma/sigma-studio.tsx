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

    fetchRules();

  }, []);

  const fetchRules =
    async () => {

      try {

        const res = await fetch(
          "http://localhost:8050/rules"
        );

        const data =
          await res.json();

        const dynamicRules =
          (alerts ?? []).map(
            (alert) => ({

              name:
                `${alert.title} Detection`,

              severity:
                alert.severity,
            })
          );

        setRules([
          ...dynamicRules,
          ...data,
        ]);

      } catch (e) {

        console.error(e);
      }
    };

  useEffect(() => {

    const dynamicRules =
      (alerts ?? []).map(
        (alert) => ({

          name:
            `${alert.title} Detection`,

          severity:
            alert.severity,
        })
      );

    setRules((prev) => {

      const staticRules =
        prev.filter(
          (rule) =>
            rule.name ===
              "Ransomware Detection" ||

            rule.name ===
              "Phishing Detection"
        );

      return [
        ...dynamicRules,
        ...staticRules,
      ];
    });

  }, [alerts]);

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
        text-2xl
        font-bold
        mb-6
      ">
        Sigma Studio
      </h2>

      <div className="
        space-y-4
      ">

        {(rules ?? []).map(
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

              <div className="
                flex
                justify-between
                items-center
              ">

                <h3 className="
                  text-white
                  font-bold
                  text-lg
                ">
                  {rule.name}
                </h3>

                <span className="
                  text-red-400
                  font-semibold
                ">
                  {rule.severity}
                </span>

              </div>

            </motion.div>
          )
        )}

      </div>

      <div className="
        mt-8
      ">

        <h3 className="
          text-red-400
          text-xl
          font-semibold
          mb-4
        ">
          Triggered Alerts
        </h3>

        <div className="
          space-y-3
        ">

          {(alerts ?? []).map(
            (
              alert,
              index
            ) => (

              <div
                key={index}

                className="
                  bg-slate-950
                  border
                  border-slate-700/20
                  rounded-lg
                  p-4
                "
              >

                <div className="
                  flex
                  justify-between
                  items-center
                ">

                  <p className="
                    text-white
                  ">
                    {alert.title}
                  </p>

                  <span className="
                    text-red-400
                    font-bold
                  ">
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
