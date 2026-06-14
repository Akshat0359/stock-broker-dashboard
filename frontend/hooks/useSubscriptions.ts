"use client";

import React, { useState, useCallback } from "react";
import {
  apiSubscribe,
  apiUnsubscribe,
} from "@/lib/api";

interface UseSubscriptionsReturn {
  subscriptions: string[];
  setSubscriptions: React.Dispatch<React.SetStateAction<string[]>>;
  tickerLoading: boolean;
  handleToggle: (ticker: string, isSubscribed: boolean) => Promise<void>;
}

/**
 * useSubscriptions — manages subscription state and optimistic updates.
 * Preserves all existing API contracts (apiSubscribe / apiUnsubscribe).
 */
export function useSubscriptions(
  initialSubscriptions: string[]
): UseSubscriptionsReturn {
  const [subscriptions, setSubscriptions] = useState<string[]>(initialSubscriptions);
  const [tickerLoading, setTickerLoading] = useState(false);

  const handleToggle = useCallback(
    async (ticker: string, isSubscribed: boolean) => {
      setTickerLoading(true);
      try {
        if (isSubscribed) {
          await apiUnsubscribe(ticker);
          setSubscriptions((prev) => prev.filter((t) => t !== ticker));
        } else {
          await apiSubscribe(ticker);
          setSubscriptions((prev) => [...prev, ticker]);
        }
      } catch (err: unknown) {
        console.error("Failed to update subscription", err);
      } finally {
        setTickerLoading(false);
      }
    },
    []
  );

  return {
    subscriptions,
    setSubscriptions,
    tickerLoading,
    handleToggle,
  };
}
