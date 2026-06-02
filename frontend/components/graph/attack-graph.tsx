"use client";

import ReactFlow, {
  Background,
  Controls,
} from "reactflow";

import "reactflow/dist/style.css";

const nodes = [
  {
    id: "1",
    position: { x: 100, y: 100 },
    data: {
      label: "Brute Force",
    },
    style: {
      background: "#991b1b",
      color: "white",
      border: "1px solid #ef4444",
    },
  },
  {
    id: "2",
    position: { x: 400, y: 100 },
    data: {
      label: "Credential Access",
    },
    style: {
      background: "#7f1d1d",
      color: "white",
      border: "1px solid #ef4444",
    },
  },
  {
    id: "3",
    position: { x: 700, y: 100 },
    data: {
      label: "Privilege Escalation",
    },
    style: {
      background: "#450a0a",
      color: "white",
      border: "1px solid #ef4444",
    },
  },
];

const edges = [
  {
    id: "e1-2",
    source: "1",
    target: "2",
    animated: true,
  },
  {
    id: "e2-3",
    source: "2",
    target: "3",
    animated: true,
  },
];

export function AttackGraph() {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 h-[500px]">
      <h2 className="text-white text-xl font-semibold mb-4">
        Attack Chain Visualization
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
