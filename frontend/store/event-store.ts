import { create } from "zustand";

interface EventItem {
  attack_type: string;
  severity: string;
  mitre: string;
  source: string;
  timestamp: string;
}

interface EventStore {
  events: EventItem[];
  addEvent: (event: EventItem) => void;
  clearEvents: () => void;
}

export const useEventStore =
  create<EventStore>((set) => ({
    events: [],

    addEvent: (event) =>
      set((state) => ({
        events: [
          event,
          ...state.events,
        ],
      })),

    clearEvents: () =>
      set({
        events: [],
      }),
  }));
