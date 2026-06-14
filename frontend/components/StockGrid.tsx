"use client";

import { StockCard } from "./StockCard";
import type { PriceMap } from "@/hooks/useSocket";

interface StockGridProps {
  subscriptions: string[];
  prices: PriceMap;
  onUnsubscribe: (ticker: string) => void;
}

export function StockGrid({ subscriptions, prices, onUnsubscribe }: StockGridProps) {
  if (subscriptions.length === 0) {
    return (
      <section className="animate-fade-in mb-8" aria-label="Live stock grid">
        <div className="section-header">
          <div>
            <h2 className="section-title">Live Stock Grid</h2>
            <p className="section-subtitle">Your subscribed stocks will appear here</p>
          </div>
        </div>

        {/* Empty state */}
        <div className="card flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-brand-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
          </div>
          <h3 className="text-base font-semibold text-text-primary mb-1">No stocks in watchlist</h3>
          <p className="text-sm text-text-secondary max-w-xs">
            Select stocks from the marketplace above to start receiving live price updates.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-8 animate-fade-in" aria-label="Live stock grid">
      <div className="section-header">
        <div>
          <h2 className="section-title">Live Stock Grid</h2>
          <p className="section-subtitle">
            Prices updating every second
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-text-muted">
          <span className="live-dot" />
          <span>{subscriptions.length} active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {subscriptions.map((ticker) => (
          <StockCard
            key={ticker}
            ticker={ticker}
            price={prices[ticker] ?? 0}
            onUnsubscribe={onUnsubscribe}
          />
        ))}
      </div>
    </section>
  );
}
