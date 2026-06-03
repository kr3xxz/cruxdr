"use client";

import {
  useEffect,
  useState,
} from "react";


export function SOARCenter() {

  const [responses, setResponses] =
    useState<any[]>([]);


  const fetchResponses =
    async () => {

      try {

        const res =
          await fetch(
            "http://localhost:8061/responses"
          );

        const data =
          await res.json();

        setResponses(data);

      } catch (err) {

        console.error(err);
      }
    };


  useEffect(() => {

    fetchResponses();

    const interval =
      setInterval(
        fetchResponses,
        2000
      );

    return () =>
      clearInterval(interval);

  }, []);


  return (

    <div className="
      border
      border-purple-500
      rounded-2xl
      bg-[#050816]
      p-6
      shadow-2xl
    ">

      <div className="
        flex
        items-center
        justify-between
        mb-6
      ">

        <div>

          <h2 className="
            text-4xl
            font-bold
            text-purple-400
          ">
            SOAR Response Center
          </h2>

          <p className="
            text-zinc-500
            mt-2
          ">
            Automated remediation workflows
          </p>

        </div>

      </div>

      <div className="
        space-y-5
        max-h-[520px]
        overflow-y-auto
      ">

        {

          responses.map(
            (
              response,
              idx
            ) => (

              <div
                key={idx}
                className="
                  border
                  border-zinc-800
                  rounded-xl
                  p-5
                  bg-black
                "
              >

                <div className="
                  text-red-400
                  text-xl
                  font-bold
                  mb-4
                ">
                  {response.incident}
                </div>

                <div className="
                  space-y-3
                ">

                  {

                    response.actions.map(
                      (
                        action: any,
                        i: number
                      ) => (

                        <div
                          key={i}
                          className="
                            flex
                            items-center
                            justify-between
                            border
                            border-zinc-800
                            rounded-lg
                            p-4
                            bg-[#0b1220]
                          "
                        >

                          <div>

                            <div className="
                              text-cyan-400
                              font-bold
                            ">
                              {action.action}
                            </div>

                            <div className="
                              text-zinc-400
                              text-sm
                              mt-1
                            ">
                              {action.target}
                            </div>

                          </div>

                          <div className="
                            px-4
                            py-2
                            rounded-full
                            bg-green-600
                            text-white
                            text-sm
                            font-bold
                          ">
                            {action.status}
                          </div>

                        </div>
                      )
                    )
                  }

                </div>

              </div>
            )
          )
        }

      </div>

    </div>
  );
}
