"use client";

const SUPPORTED_TICKERS = ["GOOG", "TSLA", "AMZN", "META", "NVDA"];

const TICKER_COLORS: Record<string, string> = {
  GOOG: "from-blue-500 to-blue-600",
  TSLA: "from-red-500 to-red-600",
  AMZN: "from-orange-400 to-orange-600",
  META: "from-blue-400 to-indigo-600",
  NVDA: "from-green-400 to-green-600",
};

interface TickerSelectorProps {
  subscriptions: string[];
  onToggle: (ticker: string, isSubscribed: boolean) => void;
  loading: boolean;
}

export function TickerSelector({
  subscriptions,
  onToggle,
  loading,
}: TickerSelectorProps) {
  return (
    <div className="glass-card p-5 mb-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-ink-400 uppercase tracking-widest">
          Watchlist
        </h2>
        <span className="text-xs text-ink-600">
          {subscriptions.length}/{SUPPORTED_TICKERS.length} subscribed
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {SUPPORTED_TICKERS.map((ticker) => {
          const isSubscribed = subscriptions.includes(ticker);
          return (
            <button
              key={ticker}
              id={`ticker-toggle-${ticker}`}
              onClick={() => !loading && onToggle(ticker, isSubscribed)}
              disabled={loading}
              className={`ticker-chip font-bold transition-all duration-200 ${
                isSubscribed ? "ticker-chip-active" : "ticker-chip-inactive"
              }`}
            >
              {isSubscribed && (
                <span className={`w-2 h-2 rounded-full bg-gradient-to-br ${TICKER_COLORS[ticker]} flex-shrink-0`} />
              )}
              {ticker}
              {isSubscribed ? (
                <span className="text-xs font-normal text-ink-400 ml-0.5">✓</span>
              ) : (
                <span className="text-xs font-normal text-ink-600 ml-0.5">+</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
