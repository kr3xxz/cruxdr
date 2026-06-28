"use client";

import { useUIStore } from "@/store/ui-store";
import { useEventStore } from "@/store/live-events";
import { useAlertStore } from "@/store/alert-store";
import { useSecurityStore } from "@/store/security-store";
import { useGraphStore } from "@/store/graph-store";

const items = [
  "dashboard",
  "alerts",
  "incidents",
  "threat-hunting",
  "mitre",
  "ai-assistant",
  "settings",
];

export function Sidebar() {

  const {
    activeTab,
    setActiveTab,
  } = useUIStore();

  const clearEvents = useEventStore((state) => state.clearEvents);
  const clearAlerts = useAlertStore((state) => state.clearAlerts);
  const clearBlockedIPs = useSecurityStore((state) => state.clearBlockedIPs);
  const clearGraph = useGraphStore((state) => state.clearGraph);

  const clearAll = () => {
    clearEvents();
    clearAlerts();
    clearBlockedIPs();
    clearGraph();
    fetch("http://localhost:8030/incidents", { method: "DELETE" }).catch(() => {});
    fetch("http://localhost:8030/graph", { method: "DELETE" }).catch(() => {});
    fetch("http://localhost:8080/logs", { method: "DELETE" }).catch(() => {});
    fetch("http://localhost:8060/reset", { method: "DELETE" }).catch(() => {});
  };

  return (
    <aside className="
      w-64
      min-h-screen
      bg-slate-950
      border-r
      border-zinc-800
      p-6
      flex
      flex-col
    ">

      <h1 className="
        text-white
        text-3xl
        font-bold
        mb-10
      ">
        CruXDR
      </h1>

      <div className="
        flex
        flex-col
        gap-3
        flex-1
      ">

        {items.map((item) => (

          <button
            key={item}

            onClick={() =>
              setActiveTab(item)
            }

            className={`
              text-left
              px-4
              py-3
              rounded-xl
              transition-all
              capitalize

              ${
                activeTab === item
                  ? "bg-red-600 text-white"
                  : "bg-zinc-950 text-zinc-400 hover:bg-zinc-900"
              }
            `}
          >
            {item.replace("-", " ")}
          </button>
        ))}

      </div>

      <button
        onClick={clearAll}
        className="
          px-4
          py-3
          rounded-xl
          text-sm
          text-red-400
          border
          border-red-900/40
          bg-red-950/20
          hover:bg-red-950/50
          transition-colors
          text-center
        "
      >
        Clear All Data
      </button>

    </aside>
  );
}
