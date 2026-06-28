import { create } from "zustand";

interface GraphStore {

  nodes: any[];

  edges: any[];

  setGraph: (
    nodes: any[],
    edges: any[]
  ) => void;

  clearGraph: () => void;
}

export const useGraphStore =
  create<GraphStore>((set) => ({

    nodes: [],

    edges: [],

    setGraph: (
      nodes,
      edges
    ) =>
      set({
        nodes,
        edges,
      }),

    clearGraph: () =>
      set({ nodes: [], edges: [] }),
  }));
