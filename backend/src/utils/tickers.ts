export const SUPPORTED_TICKERS = ["GOOG", "TSLA", "AMZN", "META", "NVDA"] as const;
export type Ticker = (typeof SUPPORTED_TICKERS)[number];

export function isSupportedTicker(ticker: string): ticker is Ticker {
  return SUPPORTED_TICKERS.includes(ticker as Ticker);
}
