"use client";

import ReactFlow, {
  Background,
  Controls,
} from "reactflow";

import "reactflow/dist/style.css";

import { useEventStore } from "@/store/event-store";

export function LiveAttackGraph() {

  const events =
    useEventStore(
      (state) => state.events
    );

  const nodes =
    (events ?? []).map(
      (
        event: any,
        index
      ) => ({

        id: String(index),

        data: {
          label:
            `${event.attack_type}
             (${event.mitre})`,
        },

        position: {
          x: 200 * (index % 3),
          y: 120 * index,
        },

        style: {

          background: "#7f1d1d",

          color: "white",

          border:
            "1px solid #ef4444",

          padding: 10,

          borderRadius: 12,
        },
      })
    );

  const edges =
    (events ?? []).slice(1).map(
      (
        _: any,
        index
      ) => ({

        id:
          `e${index}-${index + 1}`,

        source:
          String(index),

        target:
          String(index + 1),

        animated: true,

        style: {
          stroke: "#ef4444",
        },
      })
    );

  return (
    <div className="
      bg-zinc-900
      border
      border-zinc-800
      rounded-xl
      p-4
      h-[700px]
    ">

      <h2 className="
        text-white
        text-3xl
        font-bold
        mb-4
      ">
        Live Attack Correlation Graph
      </h2>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
      >

        <Background />

        <Controls />

      </ReactFlow>

    </div>
  );
}
