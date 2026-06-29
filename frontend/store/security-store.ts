import { create } from "zustand";

interface SecurityStore {
  blockedIPs: string[];
  blockedHosts: string[];
  blockedUsers: string[];

  addBlockedIP: (ip: string) => void;
  addBlockedHost: (host: string) => void;
  addBlockedUser: (user: string) => void;
  clearAll: () => void;
}

export const useSecurityStore =
  create<SecurityStore>(
    (set) => ({
      blockedIPs: [],
      blockedHosts: [],
      blockedUsers: [],

      addBlockedIP: (ip) =>
        set((state) => ({
          blockedIPs: state.blockedIPs.includes(ip)
            ? state.blockedIPs
            : [...state.blockedIPs, ip],
        })),

      addBlockedHost: (host) =>
        set((state) => ({
          blockedHosts: state.blockedHosts.includes(host)
            ? state.blockedHosts
            : [...state.blockedHosts, host],
        })),

      addBlockedUser: (user) =>
        set((state) => ({
          blockedUsers: state.blockedUsers.includes(user)
            ? state.blockedUsers
            : [...state.blockedUsers, user],
        })),

      clearAll: () =>
        set({ blockedIPs: [], blockedHosts: [], blockedUsers: [] }),
    }))
