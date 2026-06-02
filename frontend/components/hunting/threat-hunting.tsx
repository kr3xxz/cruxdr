"use client";

import { useState } from "react";

import { motion } from "framer-motion";

import { useEventStore } from "@/store/event-store";

export function ThreatHunting() {

  const events =
    useEventStore(
      (state) => state.events
    );

  const [query, setQuery] =
    useState(
      "attack_type=ransomware severity=critical mitre=T1486"
    );

  const [history, setHistory] =
    useState<string[]>([]);

  const [results, setResults] =
    useState<any[]>([]);

  const runHunt = () => {

    const attackType =
      query.match(
        /attack_type=([^ ]+)/
      )?.[1];

    const severity =
      query.match(
        /severity=([^ ]+)/
      )?.[1];

    const mitre =
      query.match(
        /mitre=([^ ]+)/
      )?.[1];

    const matched =
      (events ?? []).filter(
        (event: any) => {

          return (

            (!attackType ||
              event.attack_type === attackType) &&

            (!severity ||
              event.severity === severity) &&

            (!mitre ||
              event.mitre === mitre)
          );
        }
      );

    setResults(matched);

    setHistory((prev) => [
      query,
      ...prev,
    ]);
  };

  return (
    <div className="
      bg-black
      border
      border-zinc-800
      rounded-xl
      p-6
    ">

      <div className="
        flex
        gap-4
        mb-8
      ">

        <input
          value={query}

          onChange={(e) =>
            setQuery(
              e.target.value
            )
          }

          className="
            flex-1
            bg-zinc-900
            border
            border-zinc-700
            rounded-xl
            p-4
            text-green-400
            font-mono
            outline-none
          "
        />

        <button
          onClick={runHunt}

          className="
            bg-red-600
            hover:bg-red-700
            px-8
            rounded-xl
            text-white
            font-bold
          "
        >
          Hunt
        </button>

      </div>

      <div className="
        grid
        grid-cols-2
        gap-8
      ">

        <div>

          <h3 className="
            text-white
            text-2xl
            font-bold
            mb-6
          ">
            Search History
          </h3>

          <div className="
            space-y-3
          ">

            {(history ?? []).map(
              (
                item,
                index
              ) => (

                <div
                  key={index}

                  className="
                    bg-zinc-950
                    border
                    border-zinc-800
                    rounded-xl
                    p-4
                    text-green-400
                    font-mono
                    text-sm
                  "
                >
                  {item}
                </div>
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
            Hunt Results
          </h3>

          <div className="
            space-y-4
          ">

            {(results ?? []).map(
              (
                result: any,
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
                    border-red-500/20
                    rounded-xl
                    p-5
                  "
                >

                  <div className="
                    flex
                    justify-between
                    items-center
                    mb-3
                  ">

                    <h4 className="
                      text-white
                      font-bold
                    ">
                      {result.title}
                    </h4>

                    <span className="
                      text-red-400
                      font-bold
                    ">
                      {result.severity}
                    </span>

                  </div>

                  <p className="
                    text-zinc-400
                    text-sm
                  ">
                    MITRE:
                    {" "}
                    {result.mitre}
                  </p>

                  <p className="
                    text-zinc-400
                    text-sm
                  ">
                    Source:
                    {" "}
                    {result.source_ip}
                  </p>

                  <p className="
                    text-zinc-500
                    text-xs
                    mt-2
                  ">
                    {new Date(
                      result.timestamp
                    ).toLocaleString()}
                  </p>

                </motion.div>
              )
            )}

          </div>

        </div>

      </div>

    </div>
  );
}
