"use client";

import { useEffect } from "react";

import { useEventStore } from "@/store/live-events";

export function useLiveEvents() {
  const addEvent =
    useEventStore(
      (state) => state.addEvent
    );

  useEffect(() => {
    const socket = new WebSocket(
      "ws://localhost:8010/ws/events"
    );

    socket.onmessage = (
      event
    ) => {
      addEvent(
        JSON.parse(event.data)
      );
    };

    return () => socket.close();
  }, []);
}
