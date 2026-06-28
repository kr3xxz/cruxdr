import { create } from "zustand";

interface Alert {

  title: string;

  severity: string;
}

interface AlertState {

  alerts: Alert[];

  addAlert: (
    alert: Alert
  ) => void;

  clearAlerts: () => void;
}

export const useAlertStore =
  create<AlertState>((set) => ({

    alerts: [],

    addAlert: (alert) =>

      set((state) => ({

        alerts: [
          alert,
          ...state.alerts,
        ],
      })),

    clearAlerts: () =>
      set({ alerts: [] }),
  }));
