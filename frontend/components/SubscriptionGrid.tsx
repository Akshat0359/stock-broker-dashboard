"use client";

import React from "react";
import type { PriceMap } from "@/hooks/useSocket";

const SUPPORTED_TICKERS = ["GOOG", "TSLA", "AMZN", "META", "NVDA"] as const;
type Ticker = (typeof SUPPORTED_TICKERS)[number];

interface TickerMeta {
  name: string;
  sector: string;
  color: string;       // brand accent gradient start
  colorEnd: string;    // gradient end
  icon: React.ReactNode;
}

// Inline SVG logos — no extra deps
const TICKER_META: Record<Ticker, TickerMeta> = {
  GOOG: {
    name: "Alphabet Inc.",
    sector: "Technology",
    color: "#4285F4",
    colorEnd: "#34A853",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
      </svg>
    ),
  },
  TSLA: {
    name: "Tesla, Inc.",
    sector: "Automotive",
    color: "#CC0000",
    colorEnd: "#FF4444",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#CC0000]" fill="currentColor">
        <path d="M12 2L2 7l2 2c2.5-1 5.5-1.5 8-1.5s5.5.5 8 1.5l2-2L12 2zm0 3c-2.2 0-4.2.4-6 1.1V22l6-2 6 2V6.1c-1.8-.7-3.8-1.1-6-1.1z"/>
      </svg>
    ),
  },
  AMZN: {
    name: "Amazon.com Inc.",
    sector: "E-Commerce",
    color: "#FF9900",
    colorEnd: "#FFB84D",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#FF9900]" fill="currentColor">
        <path d="M13.958 10.09c0 1.232.029 2.256-.592 3.351-.502.891-1.301 1.438-2.186 1.438-1.214 0-1.922-.924-1.922-2.292 0-2.692 2.415-3.182 4.7-3.182v.685zm3.186 7.705a.659.659 0 0 1-.748.074c-1.051-.873-1.234-1.276-1.807-2.108-1.728 1.762-2.95 2.288-5.19 2.288-2.652 0-4.714-1.636-4.714-4.909 0-2.557 1.387-4.3 3.363-5.151 1.714-.754 4.11-.891 5.942-1.099v-.41c0-.753.06-1.642-.384-2.292-.384-.578-1.129-.819-1.785-.819-1.214 0-2.292.622-2.556 1.913-.054.285-.265.57-.548.583l-3.074-.333c-.259-.059-.548-.271-.474-.671C5.93 2.006 9.27 1 12.24 1c1.503 0 3.466.4 4.652 1.537 1.503 1.4 1.359 3.268 1.359 5.301v4.797c0 1.442.599 2.073 1.163 2.852.197.278.241.609-.01.816l-2.26 1.492z"/>
        <path d="M20.556 18.406c-3.868 2.857-9.479 4.375-14.309 4.375-6.772 0-12.874-2.504-17.497-6.664-.363-.327-.038-.773.397-.52 4.983 2.9 11.14 4.641 17.5 4.641 4.294 0 9.014-.89 13.353-2.734.656-.28 1.205.43.556.902z" fill="#FF9900"/>
      </svg>
    ),
  },
  META: {
    name: "Meta Platforms",
    sector: "Social Media",
    color: "#0866FF",
    colorEnd: "#3B82F6",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#0866FF]" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
  },
  NVDA: {
    name: "NVIDIA Corporation",
    sector: "Semiconductors",
    color: "#76B900",
    colorEnd: "#A3D900",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#76B900]" fill="currentColor">
        <path d="M9.582 7.215v-.962c.085-.005.172-.01.261-.01 3.574 0 5.905 3.4 5.905 3.4s-2.506 3.688-5.195 3.688c-.33 0-.648-.048-.971-.127v-4.473c1.228.148 1.474.68 2.207 1.895l1.638-1.379s-1.152-1.5-3.082-1.5l-.763-.532zm0-3.45V2.3C9.727 2.298 9.87 2.3 10.013 2.3c5.33 0 8.818 4.617 8.818 4.617S14.637 12 9.743 12c-.052 0-.107-.001-.161-.002v-1.587c.054.006.107.009.161.009 3.015 0 5.058-2.916 5.058-2.916s-1.956-2.48-4.787-2.48c-.145 0-.288.004-.432.012v-1.271zM9.582 17.5v1.2L4 21V3l5.582 3.253v1.293c-.085.005-.172.01-.261.015-1.906.117-3.256 1.708-3.256 1.708s1.289 1.974 3.517 1.974z"/>
      </svg>
    ),
  },
};

interface SubscriptionGridProps {
  subscriptions: string[];
  prices: PriceMap;
  onToggle: (ticker: string, isSubscribed: boolean) => void;
  loading: boolean;
}

interface MarketCardProps {
  ticker: Ticker;
  meta: TickerMeta;
  price: number;
  isSubscribed: boolean;
  loading: boolean;
  onToggle: () => void;
}

function MarketCard({ ticker, meta, price, isSubscribed, loading, onToggle }: MarketCardProps) {
  return (
    <div
      id={`market-card-${ticker}`}
      onClick={() => !loading && onToggle()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && !loading && onToggle()}
      aria-pressed={isSubscribed}
      aria-label={`${isSubscribed ? "Unsubscribe from" : "Subscribe to"} ${ticker}`}
      className={[
        "market-card market-card-hover stock-card-enter",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500",
        isSubscribed ? "market-card-subscribed" : "market-card-idle",
        loading ? "market-card-loading" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Subscribed glow overlay */}
      {isSubscribed && (
        <div
          className="absolute inset-0 opacity-[0.04] rounded-[20px] pointer-events-none"
          style={{ background: `linear-gradient(135deg, ${meta.color}, ${meta.colorEnd})` }}
        />
      )}

      {/* Top row: icon + ticker + badge */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          {/* Company logo circle */}
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{
              background: `linear-gradient(135deg, ${meta.color}18, ${meta.colorEnd}28)`,
              border: `1px solid ${meta.color}30`,
            }}
          >
            {meta.icon}
          </div>
          <div>
            <div className="font-bold text-sm text-text-primary leading-tight">{ticker}</div>
            <div className="text-[11px] text-text-muted leading-tight mt-0.5">{meta.sector}</div>
          </div>
        </div>

        {/* State badge */}
        {isSubscribed ? (
          <span className="badge bg-brand-50 text-brand-600 border border-brand-200 text-[10px]">
            <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Subscribed
          </span>
        ) : (
          <span className="badge bg-gray-100 text-text-muted text-[10px]">
            + Add
          </span>
        )}
      </div>

      {/* Company name */}
      <div className="text-[11px] text-text-secondary font-medium">{meta.name}</div>

      {/* Price */}
      <div className="mt-1">
        <div className="text-xl font-bold text-text-primary tabular-nums">
          {price > 0
            ? `$${price.toFixed(2)}`
            : <span className="text-text-muted text-base font-normal">—</span>}
        </div>
        {price > 0 && (
          <div className="flex items-center gap-1.5 mt-1">
            <span className="live-dot" />
            <span className="text-[10px] text-text-muted font-medium">LIVE · 1s</span>
          </div>
        )}
      </div>

      {/* CTA strip */}
      <div
        className={`mt-2 pt-3 border-t flex items-center justify-between transition-colors duration-200 ${
          isSubscribed ? "border-brand-100" : "border-border"
        }`}
      >
        <span
          className={`text-xs font-semibold ${
            isSubscribed ? "text-brand-500" : "text-text-muted"
          }`}
        >
          {isSubscribed ? "Click to unsubscribe" : "Click to subscribe"}
        </span>
        <div
          className={`w-8 h-5 rounded-full transition-all duration-200 flex items-center ${
            isSubscribed ? "bg-brand-500 justify-end pr-0.5" : "bg-gray-200 justify-start pl-0.5"
          }`}
        >
          <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
        </div>
      </div>
    </div>
  );
}

export function SubscriptionGrid({
  subscriptions,
  prices,
  onToggle,
  loading,
}: SubscriptionGridProps) {
  return (
    <section className="mb-8 animate-fade-in" aria-label="Stock marketplace">
      <div className="section-header">
        <div>
          <h2 className="section-title">Stock Marketplace</h2>
          <p className="section-subtitle">
            Select stocks to add to your live watchlist
          </p>
        </div>
        <span className="badge-brand">
          {subscriptions.length} / {SUPPORTED_TICKERS.length} active
        </span>
      </div>

      {/* 5-col grid on desktop, 3 on tablet, 2 on mobile */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {SUPPORTED_TICKERS.map((ticker) => (
          <MarketCard
            key={ticker}
            ticker={ticker}
            meta={TICKER_META[ticker]}
            price={prices[ticker] ?? 0}
            isSubscribed={subscriptions.includes(ticker)}
            loading={loading}
            onToggle={() => onToggle(ticker, subscriptions.includes(ticker))}
          />
        ))}
      </div>
    </section>
  );
}
