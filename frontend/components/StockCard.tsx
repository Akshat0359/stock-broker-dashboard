"use client";

import { useEffect, useRef, useState } from "react";

interface StockCardProps {
  ticker: string;
  price: number;
  onUnsubscribe: (ticker: string) => void;
}

const TICKER_META: Record<string, { name: string; color: string; colorEnd: string }> = {
  GOOG: { name: "Alphabet",  color: "#4285F4", colorEnd: "#34A853" },
  TSLA: { name: "Tesla",     color: "#CC0000", colorEnd: "#FF4444" },
  AMZN: { name: "Amazon",    color: "#FF9900", colorEnd: "#FFB84D" },
  META: { name: "Meta",      color: "#0866FF", colorEnd: "#3B82F6" },
  NVDA: { name: "NVIDIA",    color: "#76B900", colorEnd: "#A3D900" },
};

export function StockCard({ ticker, price, onUnsubscribe }: StockCardProps) {
  const prevPriceRef = useRef<number>(price);
  const [flashClass, setFlashClass] = useState<"" | "price-flash-up" | "price-flash-down">("");
  const [direction, setDirection] = useState<"up" | "down" | "flat">("flat");
  const [isHovered, setIsHovered] = useState(false);

  const meta = TICKER_META[ticker] ?? { name: ticker, color: "#6B4EFF", colorEnd: "#8e74ff" };

  useEffect(() => {
    if (price === prevPriceRef.current) return;
    const isUp = price > prevPriceRef.current;
    const newDir = isUp ? "up" : "down";
    setDirection(newDir);
    setFlashClass(isUp ? "price-flash-up" : "price-flash-down");
    prevPriceRef.current = price;
    const timer = setTimeout(() => setFlashClass(""), 550);
    return () => clearTimeout(timer);
  }, [price]);

  return (
    <div
      className={[
        "relative overflow-hidden card p-5 stock-card-enter",
        "group transition-all duration-200",
        isHovered ? "shadow-card-hover -translate-y-1" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Subtle brand-color top bar */}
      <div
        className="absolute inset-x-0 top-0 h-0.5 rounded-t-[20px]"
        style={{ background: `linear-gradient(90deg, ${meta.color}, ${meta.colorEnd})` }}
      />

      {/* Direction pulse overlay */}
      {direction !== "flat" && (
        <div
          className={`absolute inset-0 rounded-[20px] pointer-events-none opacity-0 transition-opacity duration-700 ${
            direction === "up" ? "bg-gain-light" : "bg-loss-light"
          }`}
          style={{ opacity: flashClass ? 0.3 : 0 }}
        />
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2.5">
          {/* Color avatar */}
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
            style={{ background: `linear-gradient(135deg, ${meta.color}, ${meta.colorEnd})` }}
          >
            {ticker.slice(0, 2)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <div className="font-bold text-text-primary text-sm leading-tight">{ticker}</div>
              <span className="badge bg-brand-50 text-brand-600 border border-brand-200 text-[9px] px-1.5 py-0.5">
                Subscribed
              </span>
            </div>
            <div className="text-[11px] text-text-muted leading-tight mt-0.5">{meta.name}</div>
          </div>
        </div>

        {/* Unsubscribe button (visible on hover) */}
        <button
          id={`unsubscribe-${ticker}`}
          onClick={() => onUnsubscribe(ticker)}
          className="opacity-0 group-hover:opacity-100 w-6 h-6 rounded-lg bg-gray-100 hover:bg-loss-light hover:text-loss text-text-muted flex items-center justify-center transition-all duration-150"
          title={`Remove ${ticker}`}
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* Price */}
      <div className={`text-2xl font-bold text-text-primary tabular-nums tracking-tight mb-3 ${flashClass}`}>
        ${price.toFixed(2)}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="live-dot" style={{ width: "6px", height: "6px" }} />
          <span className="text-[10px] text-text-muted font-medium">LIVE · 1s</span>
        </div>
        {direction !== "flat" && (
          <span
            className={`text-[10px] font-semibold ${
              direction === "up" ? "text-gain-dark" : "text-loss-dark"
            }`}
          >
            {direction === "up" ? "▲ Moving up" : "▼ Moving down"}
          </span>
        )}
      </div>
    </div>
  );
}
