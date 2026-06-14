"use client";

import React from "react";
import type { PriceMap } from "@/hooks/useSocket";

interface PortfolioStatsProps {
  subscriptions: string[];
  prices: PriceMap;
  connected: boolean;
}

function formatPrice(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
}

export function PortfolioStats({
  subscriptions,
  prices,
  connected,
}: PortfolioStatsProps) {
  const totalValue = subscriptions.reduce((sum, t) => sum + (prices[t] ?? 0), 0);

  const stats = [
    {
      id: "subscribed-stocks",
      label: "Subscribed Stocks",
      value: String(subscriptions.length),
      suffix: "/ 5",
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
        </svg>
      ),
      color: "brand",
    },
    {
      id: "live-updates",
      label: "Live Updates",
      value: connected ? "Active" : "Paused",
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      ),
      color: connected ? "gain" : "gray",
    },
    {
      id: "connection-status",
      label: "Connection",
      value: connected ? "WebSocket" : "Offline",
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12.55a11 11 0 0 1 14.08 0" />
          <path d="M1.42 9a16 16 0 0 1 21.16 0" />
          <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
          <circle cx="12" cy="20" r="1" fill="currentColor" />
        </svg>
      ),
      color: connected ? "gain" : "loss",
    },
  ];

  const colorMap: Record<string, { icon: string; text: string; bg: string }> = {
    brand: { icon: "text-brand-500", text: "text-brand-600", bg: "bg-brand-50" },
    gain:  { icon: "text-gain", text: "text-gain-dark", bg: "bg-gain-light" },
    loss:  { icon: "text-loss", text: "text-loss-dark", bg: "bg-loss-light" },
    gray:  { icon: "text-text-muted", text: "text-text-secondary", bg: "bg-gray-100" },
  };

  return (
    <section className="animate-fade-in" aria-label="Portfolio summary">
      {/* Hero greeting row */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">
            Market{" "}
            <span className="text-gradient">Watchlist</span>
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Real-time prices · updated every second via WebSocket
          </p>
        </div>
        {subscriptions.length > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 card rounded-2xl">
            <span className="text-xs text-text-muted font-medium">Portfolio value</span>
            <span className="text-lg font-bold text-text-primary">{formatPrice(totalValue)}</span>
          </div>
        )}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
        {stats.map((s) => {
          const c = colorMap[s.color] ?? colorMap.brand;
          return (
            <div key={s.id} id={s.id} className="stat-card">
              <div className={`w-8 h-8 rounded-xl ${c.bg} ${c.icon} flex items-center justify-center mb-2`}>
                {s.icon}
              </div>
              <div className="text-xs text-text-muted font-medium">{s.label}</div>
              <div className={`text-base font-bold ${c.text} flex items-baseline gap-1`}>
                {s.value}
                {s.suffix && (
                  <span className="text-xs font-normal text-text-muted">{s.suffix}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
