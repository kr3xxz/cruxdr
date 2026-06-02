"use client";

import { useState } from "react";

export function AIPanel() {
  const [question, setQuestion] =
    useState("");

  const [response, setResponse] =
    useState("");

  const askAI = async () => {
    const res = await fetch(
      "http://localhost:8001/api/v1/ai/chat",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          question,
        }),
      }
    );

    const data = await res.json();

    setResponse(data.response);
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
      <h2 className="text-white text-xl font-semibold mb-4">
        AI SOC Assistant
      </h2>

      <textarea
        value={question}
        onChange={(e) =>
          setQuestion(e.target.value)
        }
        placeholder="Ask about incidents..."
        className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3 text-white"
      />

      <button
        onClick={askAI}
        className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
      >
        Ask AI
      </button>

      {response && (
        <div className="mt-6 bg-zinc-950 rounded-lg p-4">
          <p className="text-zinc-300 whitespace-pre-wrap">
            {response}
          </p>
        </div>
      )}
    </div>
  );
}
