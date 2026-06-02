"use client";

import { useEffect } from "react";

import { useGraphStore } from "@/store/graph-store";

export function useLiveGraph() {

  const setGraph =
    useGraphStore(
      (state) => state.setGraph
    );

  useEffect(() => {

    const socket =
      new WebSocket(
        "ws://localhost:8010/ws/graph"
      );

    socket.onmessage = (
      event
    ) => {

      const data =
        JSON.parse(event.data);

      setGraph(
        data.nodes,
        data.edges
      );
    };

    return () => socket.close();

  }, []);
}
