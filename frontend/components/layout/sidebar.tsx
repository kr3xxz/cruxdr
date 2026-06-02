"use client";

import { useUIStore } from "@/store/ui-store";

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

  return (
    <aside className="
      w-64
      min-h-screen
      bg-black
      border-r
      border-zinc-800
      p-6
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

    </aside>
  );
}
