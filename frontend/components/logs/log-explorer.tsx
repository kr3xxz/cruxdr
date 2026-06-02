"use client";

import {
  useEffect,
  useState,
} from "react";

import { motion } from "framer-motion";

import { useEventStore } from "@/store/event-store";

export function LogExplorer() {

  const events =
    useEventStore(
      (state) => state.events
    );

  const [analysis, setAnalysis] =
    useState(
      "Awaiting threat telemetry..."
    );

  useEffect(() => {

    if (
      events.length === 0
    ) {
      return;
    }

    const latest =
      events[0];

    if (
      latest.attack_type ===
      "ransomware"
    ) {

      setAnalysis(`
AI Threat Assessment

Ransomware behavior detected.

MITRE Mapping:
T1486 — Data Encrypted for Impact

Risk Level:
CRITICAL

Recommended Actions:
• Isolate infected endpoints
• Disable SMB lateral movement
• Trigger emergency backup validation
• Block suspicious PowerShell execution

Business Impact:
Potential operational disruption and mass encryption activity detected.
      `);

    } else if (
      latest.attack_type ===
      "brute_force"
    ) {

      setAnalysis(`
AI Threat Assessment

Brute-force authentication activity detected.

MITRE Mapping:
T1110 — Brute Force

Risk Level:
HIGH

Recommended Actions:
• Lock suspicious accounts
• Enable MFA enforcement
• Block offending IP addresses
• Increase authentication monitoring

Business Impact:
Potential credential compromise attempt detected.
      `);

    } else if (
      latest.attack_type ===
      "phishing"
    ) {

      setAnalysis(`
AI Threat Assessment

Phishing-related indicators detected.

MITRE Mapping:
T1566 — Phishing

Risk Level:
HIGH

Recommended Actions:
• Quarantine suspicious emails
• Reset affected credentials
• Alert impacted users
• Enable URL filtering

Business Impact:
Possible credential theft and malware delivery attempt.
      `);

    } else {

      setAnalysis(`
AI SOC analysis completed.

Suspicious activity observed.

Further investigation recommended.
      `);

    }

  }, [events]);

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
          border-red-500/20
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
          AI Threat Intelligence
        </h3>

        <div className="
          whitespace-pre-wrap
          text-zinc-300
          leading-relaxed
        ">
          {analysis}
        </div>

      </motion.div>

    </div>
  );
}
