"use client";

import {
  useEffect,
  useState,
} from "react";

export function LiveAttackGraph() {

  const [graph, setGraph] =
    useState<any>(null);

  const fetchGraph =
    async () => {

      try {

        const res =
          await fetch(
            "http://localhost:8030/graph"
          );

        const data =
          await res.json();

        setGraph(data);
        console.log("GRAPH DATA:", data);

      } catch (err) {

        console.error(err);
      }
    };

  useEffect(() => {

    fetchGraph();

    const interval =
      setInterval(
        fetchGraph,
        2000
      );

    return () =>
      clearInterval(interval);

  }, []);

  return (

    <div className="
      border
      border-cyan-500
      rounded-xl
      bg-[#050816]
      p-6
    ">

      <h2 className="
        text-cyan-400
        text-3xl
        font-bold
        mb-6
      ">
        Live Attack Graph
      </h2>

      {

        graph &&
        graph.nodes ? (

          <div className="
            flex
            items-center
            gap-6
            overflow-x-auto
          ">

            {

              graph.nodes.map(
                (
                  node: any,
                  idx: number
                ) => (

                  <div
                    key={idx}
                    className="
                      flex
                      items-center
                      gap-6
                    "
                  >

                    <div className="
                      min-w-[180px]
                      bg-black
                      border
                      border-red-500
                      rounded-xl
                      p-5
                    ">

                      <div className="
                        text-zinc-400
                        text-sm
                        capitalize
                      ">
                        {node.type}
                      </div>

                      <div className="
                        text-white
                        font-bold
                        mt-2
                        break-all
                      ">
                        {node.id}
                      </div>

                    </div>

                    {

                      idx <
                      graph.nodes.length - 1 && (

                        <div className="
                          text-red-500
                          text-4xl
                          font-bold
                        ">
                          →
                        </div>
                      )
                    }

                  </div>
                )
              )
            }

          </div>

        ) : (

          <div className="
            text-zinc-500
          ">
            Waiting for attack telemetry...
          </div>
        )
      }

    </div>
  );
}
