import { create } from "zustand";

interface SearchStore {

  query: string;

  severity: string;

  setQuery: (
    query: string
  ) => void;

  setSeverity: (
    severity: string
  ) => void;
}

export const useSearchStore =
  create<SearchStore>((set) => ({

    query: "",

    severity: "",

    setQuery: (
      query
    ) => set({ query }),

    setSeverity: (
      severity
    ) => set({
      severity,
    }),
  }));
