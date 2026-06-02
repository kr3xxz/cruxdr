"use client";

import { useEffect } from "react";

export function useAlertsSocket(
  onMessage: (data: any) => void
) {
  useEffect(() => {
    const socket = new WebSocket(
      "ws://localhost:8000/ws/alerts"
    );

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      onMessage(data);
    };

    return () => {
      socket.close();
    };
  }, [onMessage]);
}
