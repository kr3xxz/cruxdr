import { create } from "zustand";

interface Alert {
  severity: string;
  title: string;
  source_ip: string;
  technique: string;
}

interface AlertStore {
  alerts: Alert[];
  addAlert: (alert: Alert) => void;
}

export const useAlertStore =
  create<AlertStore>((set) => ({
    alerts: [],

    addAlert: (alert) =>
      set((state) => ({
        alerts: [alert, ...state.alerts],
      })),
  }));
