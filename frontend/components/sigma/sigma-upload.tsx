"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { SectionHeader } from "@/components/ui/section-header";

export default function SigmaUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState("");

  const uploadRule = async () => {
    if (!file) {
      alert("Select a Sigma rule first");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("http://localhost:8050/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setStatus(`Uploaded: ${data.file}`);
      setTimeout(() => window.location.reload(), 1000);
    } catch (err) {
      console.error(err);
      setStatus("Upload failed");
    }
  };

  const clearRules = async () => {
    const confirmed = confirm("Delete ALL Sigma rules?");
    if (!confirmed) return;

    try {
      const response = await fetch("http://localhost:8050/rules", {
        method: "DELETE",
      });
      const data = await response.json();
      setStatus(data.message);
      setTimeout(() => window.location.reload(), 1000);
    } catch (err) {
      console.error(err);
      setStatus("Failed to clear rules");
    }
  };

  return (
    <div className="space-y-6">
      <div
        className="relative rounded-xl border-2 border-dashed border-zinc-800 bg-zinc-900/30 p-8 text-center transition-all duration-200 hover:border-cyan-500/30 hover:bg-zinc-900/50 group"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/2 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl pointer-events-none" />
        <div className="relative z-[1]">
          <svg className="h-8 w-8 text-zinc-600 mx-auto mb-3 group-hover:text-cyan-400/60 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776" />
          </svg>
          <p className="text-sm text-zinc-400 font-medium">
            Drop a Sigma YAML rule here, or click to browse
          </p>
          <p className="text-[10px] text-zinc-600 font-mono mt-1">
            Supports .yaml and .yml files
          </p>
          <div className="mt-4">
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-cyan-500/20 hover:shadow-xl hover:shadow-cyan-500/30 transition-all duration-200">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Select File
              <input
                type="file"
                accept=".yaml,.yml"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) setFile(f);
                }}
                className="hidden"
              />
            </label>
          </div>
          {file && (
            <motion.p
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-cyan-400 font-mono mt-3"
            >
              Selected: {file.name}
            </motion.p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={uploadRule}
          disabled={!file}
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-cyan-500/20 hover:shadow-xl hover:shadow-cyan-500/30 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
          Upload Rule
        </button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={clearRules}
          className="inline-flex items-center gap-2 rounded-lg border border-red-900/30 bg-red-950/20 px-4 py-2 text-xs font-semibold text-red-400 hover:bg-red-950/30 hover:border-red-800/40 transition-all duration-200"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
          </svg>
          Clear All Rules
        </motion.button>
        {status && (
          <motion.span
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            className={`text-xs font-mono ${status.includes("failed") ? "text-red-400" : "text-emerald-400"}`}
          >
            {status}
          </motion.span>
        )}
      </div>
    </div>
  );
}
