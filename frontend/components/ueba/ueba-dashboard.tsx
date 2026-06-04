"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function UEBADashboard() {

  const [risks, setRisks] =
    useState<any[]>([]);

  const [anomalies, setAnomalies] =
    useState<any[]>([]);

  useEffect(() => {

    const load = async () => {

      try {

        const riskRes =
          await fetch(
            "http://localhost:8060/risks"
          );

        const riskData =
          await riskRes.json();

        setRisks(riskData);

        const anomalyRes =
          await fetch(
            "http://localhost:8060/anomalies"
          );

        const anomalyData =
          await anomalyRes.json();

        setAnomalies(anomalyData);

      } catch (err) {

        console.error(err);
      }
    };

    load();

    const interval =
      setInterval(load, 5000);

    return () =>
      clearInterval(interval);

  }, []);

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

          <div className="space-y-4">

            {risks.map((risk, index) => (

              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
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
                ">

                  <span className="text-white">
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

            ))}

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

          <div className="space-y-4">

            {anomalies.map(
              (anomaly, index) => (

                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
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
                  ">

                    <span className="text-white">
                      {anomaly.user}
                    </span>

                    <span className="
                      text-red-400
                      font-bold
                    ">
                      {anomaly.anomaly}
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
