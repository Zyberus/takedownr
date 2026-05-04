"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { Activity, RefreshCw } from "lucide-react";
import { firebaseAuth } from "@/lib/firebase-client";

type ProviderStatus = {
  provider: "gemini" | "openrouter";
  up: boolean;
  statusCode: number | null;
  latencyMs: number | null;
  error?: string;
};

export default function HealthPage() {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [providerStatus, setProviderStatus] = useState<ProviderStatus[]>([]);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return onAuthStateChanged(firebaseAuth, (nextUser) => {
      setUser(nextUser);
      setAuthReady(true);
    });
  }, []);

  const loadProviderStatus = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/chat/uptime", { cache: "no-store" });
      if (!response.ok) return;
      const payload = (await response.json()) as { providers?: ProviderStatus[] };
      if (Array.isArray(payload.providers)) {
        setProviderStatus(payload.providers);
        setLastChecked(new Date());
      }
    } catch {
      // Keep dashboard usable even if health checks fail.
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user || !authReady) return;
    loadProviderStatus();
    const interval = setInterval(loadProviderStatus, 60000);
    return () => clearInterval(interval);
  }, [user, authReady]);

  if (!authReady) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-gray-100 border-t-zinc-800 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500">
      <header className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-zinc-900 tracking-tight">API Health</h1>
          <p className="text-sm text-zinc-500 mt-1">Monitor chatbot API uptime and performance</p>
        </div>
        <button
          onClick={loadProviderStatus}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl bg-white text-zinc-700 text-sm font-medium cursor-pointer hover:bg-gray-50 hover:border-gray-300 transition-all focus:outline-none focus:ring-2 focus:ring-gray-200 disabled:opacity-50 shadow-sm"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </header>

      <div className="grid md:grid-cols-2 gap-6">
        {providerStatus.map((provider) => (
          <div key={provider.provider} className="border border-gray-200 rounded-2xl bg-white p-6 shadow-sm flex flex-col hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-zinc-900">{provider.provider === "gemini" ? "Gemini" : "OpenRouter"}</h2>
              <span className={`text-[11px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider ${
                provider.up
                  ? "bg-green-100/50 text-green-700 border border-green-200/50"
                  : "bg-red-100/50 text-red-700 border border-red-200/50"
              }`}>
                {provider.up ? "Operational" : "Down"}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-2">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-medium text-zinc-500">Status</span>
                <strong className="text-base font-semibold text-zinc-900">{provider.up ? "Healthy" : "Unhealthy"}</strong>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-medium text-zinc-500">Latency</span>
                <strong className="text-base font-semibold text-zinc-900">{provider.latencyMs ? `${provider.latencyMs}ms` : "—"}</strong>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-medium text-zinc-500">HTTP Code</span>
                <strong className="text-base font-semibold text-zinc-900">{provider.statusCode || "—"}</strong>
              </div>
            </div>
            {provider.error && (
              <div className="mt-4 flex items-center gap-2 p-3 bg-red-50/50 border border-red-100 rounded-xl text-red-700 text-sm font-medium">
                <Activity size={16} />
                <span>{provider.error}</span>
              </div>
            )}
          </div>
        ))}
        {providerStatus.length === 0 && (
          <div className="border border-gray-200 rounded-2xl bg-white p-6 shadow-sm">
            <div className="text-center py-10 text-zinc-500 text-sm font-medium">Loading API status...</div>
          </div>
        )}
      </div>

      {lastChecked && (
        <p className="text-xs font-medium text-zinc-400 mt-6 text-right">Last checked: {lastChecked.toLocaleTimeString()}</p>
      )}
    </div>
  );
}
