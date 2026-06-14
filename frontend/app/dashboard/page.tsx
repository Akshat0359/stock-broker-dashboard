"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useSocket } from "@/hooks/useSocket";
import { useSubscriptions } from "@/hooks/useSubscriptions";
import { Header } from "@/components/Header";
import { PortfolioStats } from "@/components/PortfolioStats";
import { SubscriptionGrid } from "@/components/SubscriptionGrid";
import { StockGrid } from "@/components/StockGrid";
import { apiGetSubscriptions, StockInfo } from "@/lib/api";
import type { PriceMap } from "@/hooks/useSocket";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // ── Page-level state ─────────────────────────────────────────────────────
  const [initialPrices, setInitialPrices] = useState<PriceMap>({});
  const [pageLoading, setPageLoading] = useState(true);

  // ── Subscription hook ─────────────────────────────────────────────────────
  const {
    subscriptions,
    setSubscriptions,
    tickerLoading,
    handleToggle,
  } = useSubscriptions([]);

  // ── WebSocket hook ────────────────────────────────────────────────────────
  const { prices, connected } = useSocket(subscriptions, initialPrices);

  // ── Auth guard ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  // ── Load initial subscriptions from API ──────────────────────────────────
  useEffect(() => {
    if (!user) return;

    apiGetSubscriptions()
      .then((subs: StockInfo[]) => {
        const tickers = subs.map((s) => s.ticker);
        const priceMap: PriceMap = {};
        subs.forEach((s) => (priceMap[s.ticker] = s.price));
        setSubscriptions(tickers);
        setInitialPrices(priceMap);
      })
      .catch(console.error)
      .finally(() => setPageLoading(false));
  }, [user, setSubscriptions]);

  const handleUnsubscribe = useCallback(
    (ticker: string) => handleToggle(ticker, true),
    [handleToggle]
  );

  // ── Loading screen ────────────────────────────────────────────────────────
  if (loading || pageLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-page">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-gradient flex items-center justify-center shadow-brand-glow animate-pulse">
            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-text-primary">Loading StockDash</p>
            <p className="text-xs text-text-muted mt-1">Connecting to live feed…</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-page">
      {/* Sticky header */}
      <Header connected={connected} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ── Hero: Portfolio Summary Stats ── */}
        <PortfolioStats
          subscriptions={subscriptions}
          prices={prices}
          connected={connected}
        />

        {/* ── Stock Marketplace (subscribe/unsubscribe) ── */}
        <SubscriptionGrid
          subscriptions={subscriptions}
          prices={prices}
          onToggle={handleToggle}
          loading={tickerLoading}
        />

        {/* ── Live Stock Grid ── */}
        <StockGrid
          subscriptions={subscriptions}
          prices={prices}
          onUnsubscribe={handleUnsubscribe}
        />

      </main>
    </div>
  );
}
