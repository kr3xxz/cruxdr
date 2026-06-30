"use client";

import { useCallback, useState } from "react";
import { motion } from "framer-motion";
import { useUIStore } from "@/store/ui-store";
import { useEventStore } from "@/store/live-events";
import { useAlertStore } from "@/store/alert-store";
import { useSecurityStore } from "@/store/security-store";
import { useGraphStore } from "@/store/graph-store";
import { TornadoOverlay } from "@/components/ui/tornado-overlay";
import { cn } from "@/lib/utils";

const iconClasses = "h-5 w-5";

const navItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: (
      <svg className={iconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    ),
  },
  {
    id: "alerts",
    label: "Detection Center",
    icon: (
      <svg className={iconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-3.75a9 9 0 00-9 9m18 0a9 9 0 00-9-9m0 0a9 9 0 01-9 9m18 0a9 9 0 01-9-9m0-9a9 9 0 100 18 9 9 0 000-18zm0 13.5h.008v.008H12v-.008z" />
      </svg>
    ),
  },
  {
    id: "incidents",
    label: "Incidents",
    icon: (
      <svg className={iconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
      </svg>
    ),
  },
  {
    id: "threat-hunting",
    label: "Threat Hunting",
    icon: (
      <svg className={iconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
      </svg>
    ),
  },
  {
    id: "mitre",
    label: "MITRE ATT&CK",
    icon: (
      <svg className={iconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17.25v-.75a3 3 0 015.25-2.25M9.75 17.25H6.75a3 3 0 01-3-3v-.75m16.5 3.75v-.75a3 3 0 00-3-3h-1.5M9.75 17.25v3m0-3H6.75m3.75 0h4.5M12 3.75a3 3 0 100 6 3 3 0 000-6z" />
      </svg>
    ),
  },
  {
    id: "ai-assistant",
    label: "AI SOC Assistant",
    icon: (
      <svg className={iconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
      </svg>
    ),
  },
  {
    id: "settings",
    label: "Settings",
    icon: (
      <svg className={iconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [tornado, setTornado] = useState(false);
  const { activeTab, setActiveTab } = useUIStore();

  const clearEvents = useEventStore((state) => state.clearEvents);
  const clearAlerts = useAlertStore((state) => state.clearAlerts);
  const clearBlocked = useSecurityStore((state) => state.clearAll);
  const clearGraph = useGraphStore((state) => state.clearGraph);

  const doClear = useCallback(() => {
    clearEvents();
    clearAlerts();
    clearBlocked();
    clearGraph();
    fetch("http://localhost:8030/incidents", { method: "DELETE" }).catch(() => {});
    fetch("http://localhost:8030/graph", { method: "DELETE" }).catch(() => {});
    fetch("http://localhost:8080/logs", { method: "DELETE" }).catch(() => {});
    fetch("http://localhost:8060/reset", { method: "DELETE" }).catch(() => {});
  }, [clearEvents, clearAlerts, clearBlocked, clearGraph]);

  const handleClear = () => setTornado(true);
  const handleTornadoDone = () => {
    doClear();
    setTornado(false);
  };

  return (
    <aside className={cn(
      "h-screen bg-sidebar sidebar-accent-border flex flex-col shrink-0 transition-all duration-300 ease-out relative z-[10] border-r-0",
      collapsed ? "w-16" : "w-60"
    )}>
      <div className={cn(
        "flex items-center border-b border-sidebar-border/60",
        collapsed ? "justify-center h-14" : "h-14 px-5"
      )}>
        {collapsed ? (
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-600 shadow-lg shadow-cyan-500/20"
          >
            <span className="text-xs font-bold text-white">C</span>
          </motion.div>
        ) : (
          <div className="flex items-center gap-3">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 via-violet-500 to-fuchsia-600 shadow-lg shadow-cyan-400/20"
            >
              <span className="text-xs font-bold text-white">C</span>
            </motion.div>
            <div>
              <p className="text-sm font-bold text-sidebar-foreground tracking-tight">CruXDR</p>
              <p className="text-[10px] text-zinc-600 font-mono tracking-wide">Security Platform</p>
            </div>
          </div>
        )}
      </div>

      <button
        onClick={() => setCollapsed(!collapsed)}
        className={cn(
          "absolute -right-3 top-13 z-20 flex h-6 w-6 items-center justify-center rounded-full border border-sidebar-border/60 bg-sidebar text-zinc-500 hover:text-zinc-300 transition-all duration-200 hover:border-zinc-600",
          collapsed && "hidden"
        )}
      >
        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5" />
        </svg>
      </button>

      <nav className="flex-1 overflow-y-auto px-2.5 space-y-0.5 py-2">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <motion.button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "flex items-center gap-3 w-full rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 relative group",
                isActive
                  ? "text-sidebar-accent-foreground"
                  : "text-zinc-500 hover:text-zinc-300"
              )}
              title={collapsed ? item.label : undefined}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active-bg"
                  className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyan-500/10 via-violet-500/10 to-fuchsia-500/5 border border-cyan-400/20 shadow-sm shadow-cyan-400/5"
                  transition={{ type: "spring", stiffness: 400, damping: 35 }}
                />
              )}
              <span className={cn(
                "shrink-0 relative z-[1] transition-colors duration-200",
                isActive ? "text-cyan-300" : "text-zinc-500 group-hover:text-zinc-300"
              )}>
                {item.icon}
              </span>
              {!collapsed && (
                <span className="relative z-[1] tracking-tight">{item.label}</span>
              )}
              {isActive && !collapsed && (
                <motion.div
                  layoutId="activeTab"
                  className="ml-auto h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_6px] shadow-cyan-300/60 relative z-[1]"
                  transition={{ type: "spring", stiffness: 400, damping: 35 }}
                />
              )}
            </motion.button>
          );
        })}
      </nav>

      {!collapsed && (
        <div className="px-2.5 pb-4 pt-2">
          <div className="border-t border-sidebar-border/30 mb-3" />
          <button
            onClick={handleClear}
            className="flex items-center gap-2 w-full rounded-lg border border-red-900/20 bg-red-950/15 px-3 py-2 text-xs text-red-400/80 hover:text-red-400 hover:bg-red-950/30 hover:border-red-800/30 transition-all duration-200 group"
          >
            <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
            <span className="group-hover:translate-x-0.5 transition-transform duration-200">Clear All Data</span>
          </button>
        </div>
      )}

      {!collapsed && (
        <div className="border-t border-sidebar-border/40 px-4 py-3">
          <p className="text-[10px] text-zinc-700 font-mono text-center tracking-wider">CruXDR v1.0</p>
        </div>
      )}

      {tornado && <TornadoOverlay onComplete={handleTornadoDone} />}
    </aside>
  );
}
