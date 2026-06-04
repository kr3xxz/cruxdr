"use client";

import { useState } from "react";

import { motion } from "framer-motion";

import { useAlertStore } from "@/store/alert-store";
import { useEventStore } from "@/store/event-store";
import { useSecurityStore } from "@/store/security-store";

const attacks = [
  "ransomware",
  "phishing",
  "brute_force",
  "lateral_movement",
  "exfiltration",
];

export function SOCCommandCenter() {

  const [logs, setLogs] =
    useState<string[]>([]);

  const addAlert =
    useAlertStore(
      (state) => state.addAlert
    );

  const addEvent =
    useEventStore(
      (state) => state.addEvent
    );

  const clearEvents =
    useEventStore(
      (state) => state.clearEvents
    );

  const blockedIPs =
    useSecurityStore(
      (state) => state.blockedIPs
    );

  const addBlockedIP =
    useSecurityStore(
      (state) => state.addBlockedIP
    );

  const sourceIP =
    "192.168.1.100";

  const launchAttack =
    async (
      attack: string
    ) => {

      if (
        blockedIPs.includes(
          sourceIP
        )
      ) {

        setLogs((prev) => [

          `[ATTACK BLOCKED] ${sourceIP} denied by SOAR policy`,

          ...prev,
        ]);

        return;
      }

      try {

        const response =
          await fetch(
            `http://localhost:8010/${attack}`,
            {
              method: "POST",
            }
          );

        const data =
          await response.json();

        console.log(data);

      } catch (err) {

        console.error(err);
      }

      let severity =
        "medium";

      let mitre =
        "T1021";

      if (
        attack ===
        "ransomware"
      ) {

        severity =
          "critical";

        mitre =
          "T1486";
      }

      if (
        attack ===
        "brute_force"
      ) {

        severity =
          "high";

        mitre =
          "T1110";
      }

      if (
        attack ===
        "exfiltration"
      ) {

        severity =
          "critical";

        mitre =
          "T1041";
      }

      if (
        attack ===
        "phishing"
      ) {

        severity =
          "high";

        mitre =
          "T1566";
      }

      addAlert({
        title: attack,
        severity,
      });

      addEvent({
        title: attack,
        attack_type:
          attack,

        severity,

        mitre,

        source:
          sourceIP,

        timestamp:
          new Date()
            .toISOString(),
      });

      window.dispatchEvent(
        new Event("logs-updated")
      );

      setTimeout(() => {

        window.dispatchEvent(
          new Event("logs-updated")
        );

      }, 500);

      setTimeout(() => {

        window.dispatchEvent(
          new Event("logs-updated")
        );

      }, 1500);

      setLogs((prev) => [

        `[ATTACK LAUNCHED] ${attack}`,

        ...prev,
      ]);
    };

  const executeResponse =
    async (
      action: string
    ) => {

      clearEvents();

      addBlockedIP(
        sourceIP
      );

      setLogs((prev) => [

        `[SOAR ACTION] ${action}`,

        `[THREATS MITIGATED] Active incidents cleared`,

        `[IP BLOCKED] ${sourceIP} added to deny list`,

        ...prev,
      ]);
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
        SOC Command Center
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
            font-bold
            mb-6
          ">
            Attack Launchers
          </h3>

          <div className="
            grid
            grid-cols-2
            gap-4
          ">

            {attacks.map(
              (attack) => (

                <motion.button

                  key={attack}

                  whileHover={{
                    scale: 1.03,
                  }}

                  whileTap={{
                    scale: 0.98,
                  }}

                  onClick={() =>
                    launchAttack(
                      attack
                    )
                  }

                  className="
                    bg-red-600
                    hover:bg-red-700
                    rounded-xl
                    p-5
                    text-white
                    font-bold
                    uppercase
                  "
                >

                  Launch
                  <br />
                  {attack}

                </motion.button>
              )
            )}

          </div>
        </div>

        <div>

          <h3 className="
            text-red-400
            text-2xl
            font-bold
            mb-6
          ">
            SOAR Response Actions
          </h3>

          <div className="
            grid
            gap-4
          ">

            <button

              onClick={() =>
                executeResponse(
                  "block-ip"
                )
              }

              className="
                bg-zinc-900
                border
                border-slate-700/30
                hover:border-slate-700
                rounded-xl
                p-5
                text-white
                font-bold
              "
            >
              Block IP
            </button>

            <button

              onClick={() =>
                executeResponse(
                  "isolate-host"
                )
              }

              className="
                bg-zinc-900
                border
                border-slate-700/30
                hover:border-slate-700
                rounded-xl
                p-5
                text-white
                font-bold
              "
            >
              Isolate Host
            </button>

            <button

              onClick={() =>
                executeResponse(
                  "disable-user"
                )
              }

              className="
                bg-zinc-900
                border
                border-slate-700/30
                hover:border-slate-700
                rounded-xl
                p-5
                text-white
                font-bold
              "
            >
              Disable User
            </button>

          </div>
        </div>

      </div>

      <div className="
        mt-10
      ">

        <h3 className="
          text-red-400
          text-2xl
          font-bold
          mb-4
        ">
          Live SOC Activity
        </h3>

        <div className="
          bg-zinc-950
          border
          border-zinc-800
          rounded-xl
          p-4
          h-[300px]
          overflow-y-auto
          space-y-2
        ">

          {logs.map(
            (
              log,
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
                  text-cyan-400
                  font-mono
                  text-sm
                "
              >
                {log}
              </motion.div>
            )
          )}

        </div>
      </div>
    </div>
  );
}
