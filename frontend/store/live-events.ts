import { create } from "zustand";

interface EventStore {
  events: any[];

  addEvent: (
    event: any
  ) => void;
}

export const useEventStore =
  create<EventStore>((set) => ({
    events: [],

    addEvent: (event) =>
      set((state) => ({
        events: [
          event,
          ...state.events,
        ].slice(0, 100),
      })),
  }));
