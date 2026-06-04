"use client";

import { useEffect, useState } from "react";

export default function SigmaRules() {
  const [rules, setRules] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8050/rules")
      .then(r => r.json())
      .then(setRules);
  }, []);

  return (
    <div className="rounded-xl border p-4">
      <h2 className="font-bold mb-4">
        Active Sigma Rules
      </h2>

      {rules.map((rule: any, idx) => (
        <div key={idx} className="border-b py-2">
          <div>{rule.title}</div>
          <div className="text-sm opacity-70">
            {rule.severity}
          </div>
        </div>
      ))}
    </div>
  );
}
