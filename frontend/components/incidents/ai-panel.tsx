"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { useEventStore } from "@/store/live-events";
import { API } from "@/lib/api";

const AI_API = API.ai || "http://localhost:8001";

function normalizeSev(s: any): string {
  if (typeof s === "number") return s >= 70 ? "critical" : s >= 40 ? "high" : s >= 20 ? "medium" : "low";
  return (s || "medium").toString().toLowerCase();
}

const severityColor: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  critical: {
    bg: "bg-red-950/40",
    text: "text-red-400",
    border: "border-red-500/30",
    dot: "bg-red-500",
  },
  high: {
    bg: "bg-orange-950/40",
    text: "text-orange-400",
    border: "border-orange-500/30",
    dot: "bg-orange-500",
  },
  medium: {
    bg: "bg-yellow-950/40",
    text: "text-yellow-400",
    border: "border-yellow-500/30",
    dot: "bg-yellow-500",
  },
  low: {
    bg: "bg-blue-950/40",
    text: "text-blue-400",
    border: "border-blue-500/30",
    dot: "bg-blue-500",
  },
};

function SeverityBadge({ severity, size = "sm" }: { severity: any; size?: "sm" | "lg" }) {
  const sev = normalizeSev(severity);
  const colors = severityColor[sev] || severityColor.medium;
  const s = size === "lg" ? "px-4 py-1.5 text-sm" : "px-2.5 py-0.5 text-xs";
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-md ${colors.bg} ${colors.text} ${colors.border} border font-mono font-semibold ${s} uppercase tracking-wider`}>
      <span className={`h-1.5 w-1.5 rounded-full ${colors.dot} ${sev === "critical" ? "animate-pulse" : ""}`} />
      {sev}
    </span>
  );
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  provider?: string;
}

export function AIPanel() {
  const events = useEventStore((state) => state.events);
  const latest = events[0];
  const severity = normalizeSev(latest?.severity) || "medium";
  const attack = latest?.attack_type || "Suspicious activity";

  const [analysis, setAnalysis] = useState<string | null>(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const totalEvents = events.length;
  const criticalCount = events.filter((e) => normalizeSev(e.severity) === "critical").length;
  const highCount = events.filter((e) => normalizeSev(e.severity) === "high").length;
  const mediumCount = events.filter((e) => normalizeSev(e.severity) === "medium").length;
  const colors = severityColor[severity] || severityColor.medium;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const scroll = () => document.querySelector("main")?.scrollTo({ top: 0, behavior: "instant" });
    requestAnimationFrame(scroll);
    requestAnimationFrame(() => requestAnimationFrame(scroll));
  }, []);

  useEffect(() => {
    if (events.length === 0) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    let cancelled = false;
    debounceRef.current = setTimeout(() => {
      setAnalysisLoading(true);
      setAnalysisError(null);
      fetch(`${AI_API}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ events: events.slice(0, 10) }),
      })
        .then((r) => r.json())
        .then((data) => {
          if (cancelled) return;
          if (data.error) {
            setAnalysisError(data.error);
          } else {
            setAnalysis(data.analysis);
          }
        })
        .catch((err) => {
          if (cancelled) return;
          setAnalysisError(err.message);
        })
        .finally(() => {
          if (!cancelled) setAnalysisLoading(false);
        });
    }, 3000);
    return () => { cancelled = true; if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [events.length > 0 ? events[0]?.timestamp : null]);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || chatLoading) return;
    setInput("");
    const userMsg: ChatMessage = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setChatLoading(true);
    try {
      const contextEvents = useEventStore.getState().events.slice(0, 20);
      const res = await fetch(`${AI_API}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: text, events: contextEvents }),
      });
      const data = await res.json();
      const assistantMsg: ChatMessage = {
        role: "assistant",
        content: data.response || "No response",
        provider: data.provider || "unknown",
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `Error: ${err.message}` },
      ]);
    } finally {
      setChatLoading(false);
    }
  }, [input, chatLoading]);

  return (
    <div className="space-y-5">

      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between glass-panel rounded-xl px-6 py-4"
      >
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-950/60 border border-emerald-500/30">
            <svg className="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              AI SOC Assistant
            </h2>
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <span className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live
              </span>
              <span className="text-zinc-700">|</span>
              <span>{totalEvents} events monitored</span>
              <span className="text-zinc-700">|</span>
              <span className="inline-flex items-center gap-1 rounded-md border border-zinc-700/50 bg-zinc-800/50 px-1.5 py-0.5 text-[10px] font-mono text-zinc-400">
                Zen · deepseek-v4-flash-free
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 text-xs font-mono">
            {criticalCount > 0 && (
              <span className="flex items-center gap-1.5 text-red-400">
                <span className="h-2 w-2 rounded-full bg-red-500" />
                {criticalCount} critical
              </span>
            )}
            {highCount > 0 && (
              <span className="flex items-center gap-1.5 text-orange-400">
                <span className="h-2 w-2 rounded-full bg-orange-500" />
                {highCount} high
              </span>
            )}
            <span className="flex items-center gap-1.5 text-yellow-400">
              <span className="h-2 w-2 rounded-full bg-yellow-500" />
              {mediumCount} medium
            </span>
          </div>
        </div>
      </motion.div>

      {/* ── Main Grid ── */}
      <div className="grid grid-cols-3 gap-5">

        {/* AI Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="col-span-2 card-depth rounded-xl p-5"
        >
          <div className="flex items-center gap-2 mb-5">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-emerald-950/60">
              <svg className="h-3.5 w-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-zinc-200 uppercase tracking-wider">AI Analysis</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div>
                <p className="text-xs text-zinc-500 mb-1.5 font-mono">Severity</p>
                <SeverityBadge severity={severity} size="lg" />
              </div>
              <div>
                <p className="text-xs text-zinc-500 mb-1.5 font-mono">Attack Type</p>
                <p className="text-sm font-semibold text-white">{attack.replace(/_/g, " ").toUpperCase()}</p>
              </div>
              {latest?.mitre_technique || latest?.mitre ? (
                <div>
                  <p className="text-xs text-zinc-500 mb-1.5 font-mono">MITRE</p>
                  <span className="inline-flex items-center gap-1.5 rounded-md border border-violet-500/30 bg-violet-950/40 px-2.5 py-1 text-xs font-mono font-semibold text-violet-400">
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                    </svg>
                    {latest.mitre_technique || latest.mitre}
                  </span>
                </div>
              ) : null}
            </div>

            {analysis && !analysisLoading ? (
              <div className="rounded-lg border border-zinc-800/60 bg-zinc-900/40 p-4">
                <p className="text-xs text-zinc-500 font-mono mb-2">AI-Generated Analysis</p>
                <div className="max-h-60 overflow-y-auto text-sm text-zinc-200 leading-relaxed whitespace-pre-wrap custom-scrollbar">
                  {analysis}
                </div>
              </div>
            ) : analysis && analysisLoading ? (
              <div className="rounded-lg border border-zinc-800/60 bg-zinc-900/40 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-3 w-3 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
                  <p className="text-xs text-zinc-500 font-mono">Refreshing analysis...</p>
                </div>
                <div className="max-h-60 overflow-y-auto text-sm text-zinc-400 leading-relaxed whitespace-pre-wrap custom-scrollbar">
                  {analysis}
                </div>
              </div>
            ) : analysisLoading ? (
              <div className="flex items-center gap-3 rounded-lg border border-zinc-800/60 bg-zinc-900/40 p-4">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
                <span className="text-sm text-zinc-400 font-mono">Running AI analysis...</span>
              </div>
            ) : analysisError ? (
              <div className="rounded-lg border border-red-900/40 bg-red-950/20 p-4">
                <p className="text-xs text-red-400 font-mono mb-1">Analysis Error</p>
                <p className="text-sm text-zinc-400">{analysisError}</p>
              </div>
            ) : (
              <div className="rounded-lg border border-zinc-800/60 bg-zinc-900/40 p-4">
                <p className="text-sm text-zinc-500 font-mono">Waiting for events to analyze...</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Telemetry Overview */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="col-span-1 card-depth rounded-xl p-5"
        >
          <div className="flex items-center gap-2 mb-5">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-blue-950/60">
              <svg className="h-3.5 w-3.5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6h16.5M3.75 12h16.5m-16.5 6h16.5" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-zinc-200 uppercase tracking-wider">Telemetry Overview</h3>
          </div>

          <div className="space-y-2.5">
            {[
              { label: "Total Events", value: totalEvents, color: "text-zinc-100" },
              { label: "Critical", value: criticalCount, color: "text-red-400" },
              { label: "High", value: highCount, color: "text-orange-400" },
              { label: "Medium", value: mediumCount, color: "text-yellow-400" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between rounded-lg border border-zinc-800/60 bg-zinc-900/40 px-3.5 py-2">
                <span className="text-xs text-zinc-500 font-mono">{item.label}</span>
                <span className={`text-sm font-bold font-mono ${item.color}`}>{item.value}</span>
              </div>
            ))}
          </div>
        </motion.div>

      </div>

      {/* ── Chat Section ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card-depth rounded-xl"
      >
        <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-3.5">
          <div className="flex items-center gap-2">
            <div className="flex h-5 w-5 items-center justify-center rounded bg-zinc-800">
              <svg className="h-3 w-3 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-zinc-200">Chat with AI SOC Analyst</h3>
          </div>
          {messages.length > 0 && (
            <span className="text-[11px] text-zinc-600 font-mono">{messages.length} messages</span>
          )}
        </div>

        <div className="flex flex-col h-[400px]">
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 custom-scrollbar">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <svg className="h-8 w-8 text-zinc-700 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                </svg>
                <p className="text-sm text-zinc-600">Ask the AI SOC analyst a question</p>
                <p className="text-xs text-zinc-700 mt-1">e.g. "What is the current threat?" or "Analyze this attack pattern"</p>
              </div>
            ) : (
              messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-xl px-4 py-2.5 ${
                      msg.role === "user"
                        ? "bg-emerald-900/40 border border-emerald-700/30"
                        : "bg-zinc-800/50 border border-zinc-700/30"
                    }`}
                  >
                    <p className="text-xs text-zinc-400 font-mono mb-1">
                      {msg.role === "user" ? "You" : `AI SOC Analyst${msg.provider ? ` · ${msg.provider}` : ""}`}
                    </p>
                    <p className="text-sm text-zinc-200 whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))
            )}
            {chatLoading && (
              <div className="flex justify-start">
                <div className="rounded-xl px-4 py-3 bg-zinc-800/50 border border-zinc-700/30">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 animate-bounce rounded-full bg-emerald-500" style={{ animationDelay: "0ms" }} />
                    <div className="h-2 w-2 animate-bounce rounded-full bg-emerald-500" style={{ animationDelay: "150ms" }} />
                    <div className="h-2 w-2 animate-bounce rounded-full bg-emerald-500" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="border-t border-zinc-800 px-5 py-3">
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                placeholder="Ask about security events, threats, or recommendations..."
                className="flex-1 rounded-lg border border-zinc-700/50 bg-zinc-900/60 px-4 py-2.5 text-sm text-zinc-200 placeholder-zinc-600 font-mono outline-none focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/20 transition-all"
                disabled={chatLoading}
              />
              <button
                onClick={sendMessage}
                disabled={chatLoading || !input.trim()}
                className="rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Live Security Telemetry ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="card-depth rounded-xl"
      >
        <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-3.5">
          <div className="flex items-center gap-2">
            <div className="flex h-5 w-5 items-center justify-center rounded bg-zinc-800">
              <svg className="h-3 w-3 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75L16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-zinc-200">Event Feed</h3>
          </div>
          <span className="text-[11px] text-zinc-600 font-mono">{events.length} events</span>
        </div>

        <div className="divide-y divide-zinc-800/60">
          {events.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <svg className="h-8 w-8 text-zinc-700 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
              </svg>
              <p className="text-sm text-zinc-600">No telemetry data available</p>
              <p className="text-xs text-zinc-700 mt-1">Events will appear here as they are detected</p>
            </div>
          ) : (
            events.map((event, index) => {
              const c = severityColor[event.severity] || severityColor.medium;
              return (
                <motion.div
                  key={event.timestamp ? `${event.timestamp}-${event.attack_type || event.event_type || index}` : `event-${index}`}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="group flex items-start gap-4 px-5 py-3.5 transition-colors hover:bg-zinc-900/40"
                >
                  <div className="flex flex-col items-center gap-1 pt-0.5">
                    <span className={`h-2 w-2 rounded-full ${c.dot} ${normalizeSev(event.severity) === "critical" ? "animate-pulse" : ""}`} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={`text-xs font-bold font-mono uppercase tracking-wider ${c.text}`}>
                        {event.attack_type?.replace(/_/g, " ")}
                      </span>
                      {event.mitre_technique || event.mitre ? (
                        <span className="text-[10px] text-violet-500 font-mono">
                          {event.mitre_technique || event.mitre}
                        </span>
                      ) : null}
                    </div>
                    <p className="text-sm text-zinc-400 truncate">{event.message}</p>
                    <p className="text-[11px] text-zinc-600 font-mono mt-0.5">
                      {event.source_ip || event.source || event.host || "unknown"}
                    </p>
                  </div>

                  <div className="shrink-0">
                    <SeverityBadge severity={event.severity} />
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </motion.div>

    </div>
  );
}
