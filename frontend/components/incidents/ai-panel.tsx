"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function AIPanel() {

  const [alerts, setAlerts] =
    useState<any[]>([]);

  useEffect(() => {

    const loadAlerts =
      async () => {

        try {

          const res =
            await fetch(
              "http://localhost:8050/alerts"
            );

          const data =
            await res.json();

          setAlerts(data);

        } catch (err) {

          console.error(err);
        }
      };

    loadAlerts();

    const interval =
      setInterval(
        loadAlerts,
        3000
      );

    return () =>
      clearInterval(interval);

  }, []);

  const latest =
    alerts[0];

  const severity =
    latest?.severity ||
    "none";

  const title =
    latest?.title ||
    "No Active Threats";

  const getRecommendation =
    () => {

      if (!latest)
        return "No active threats detected.";

      if (
        title.includes(
          "Ransomware"
        )
      ) {

        return `
• Isolate affected endpoint
• Block malicious processes
• Investigate encrypted files
• Restore from backup
`;
      }

      if (
        title.includes(
          "Lateral Movement"
        )
      ) {

        return `
• Investigate remote execution
• Review PsExec activity
• Audit privileged accounts
• Rotate credentials
`;
      }

      if (
        title.includes(
          "Phishing"
        )
      ) {

        return `
• Quarantine malicious emails
• Reset impacted accounts
• Review email gateway logs
• Block malicious domains
`;
      }

      if (
        title.includes(
          "Exfiltration"
        )
      ) {

        return `
• Block outbound connection
• Inspect transferred files
• Review firewall logs
• Monitor data access
`;
      }

      if (
        title.includes(
          "Mimikatz"
        )
      ) {

        return `
• Reset privileged credentials
• Review LSASS access
• Hunt for credential dumping
• Isolate affected hosts
`;
      }

      return `
• Investigate alert source
• Review host telemetry
• Monitor affected assets
`;
    };

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
            border-slate-700/30
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

          <div className="space-y-4">

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
                {title}
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
            border-slate-700/30
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
            bg-slate-950
            rounded-xl
            p-5
            text-zinc-200
            whitespace-pre-line
          ">
            {getRecommendation()}
          </div>

        </motion.div>

      </div>

      <div className="mt-10">

        <h3 className="
          text-white
          text-3xl
          font-bold
          mb-6
        ">
          Live Security Telemetry
        </h3>

        <div className="space-y-4">

          {alerts.map(
            (
              alert,
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
                    text-xl
                    font-bold
                    mb-2
                  ">
                    {alert.title}
                  </h4>

                  <p className="
                    text-zinc-400
                  ">
                    Host: {alert.event?.host || "N/A"}
                  </p>

                  <p className="
                    text-zinc-400
                  ">
                    User: {alert.event?.user || "N/A"}
                  </p>

                  <p className="
                    text-zinc-400
                  ">
                    {alert.event?.message || ""}
                  </p>

                </div>

                <div className="
                  text-red-400
                  font-bold
                  text-xl
                  uppercase
                ">
                  {alert.severity}
                </div>

              </motion.div>

            )
          )}

        </div>

      </div>

    </div>
  );
}
