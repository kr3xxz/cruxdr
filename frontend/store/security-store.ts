import { create } from "zustand";

interface SecurityStore {

  blockedIPs: string[];

  addBlockedIP: (
    ip: string
  ) => void;

  clearBlockedIPs: () => void;
}

export const useSecurityStore =
  create<SecurityStore>(
    (set) => ({

      blockedIPs: [],

      addBlockedIP: (
        ip
      ) =>

        set((state) => ({

          blockedIPs: [
            ...state.blockedIPs,
            ip,
          ],
        })),

      clearBlockedIPs: () =>
        set({ blockedIPs: [] }),
    }))
