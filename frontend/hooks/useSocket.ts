"use client";

import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:4000";

export interface PriceMap {
  [ticker: string]: number;
}

export function useSocket(subscriptions: string[], initialPrices: PriceMap) {
  const [prices, setPrices] = useState<PriceMap>(initialPrices);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  // Update prices when subscriptions change (seed initial values)
  useEffect(() => {
    setPrices((prev) => {
      const next = { ...prev };
      // Merge initial prices for newly added subscriptions
      Object.entries(initialPrices).forEach(([ticker, price]) => {
        if (next[ticker] === undefined) {
          next[ticker] = price;
        }
      });
      return next;
    });
  }, [initialPrices]);

  useEffect(() => {
    // Connect with credentials (cookies) for JWT auth
    const socket = io(BACKEND_URL, {
      withCredentials: true,
      transports: ["websocket"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      setConnected(true);
    });

    socket.on("disconnect", () => {
      setConnected(false);
    });

    socket.on("priceUpdate", ({ ticker, price }: { ticker: string; price: number }) => {
      if (subscriptions.includes(ticker)) {
        setPrices((prev) => ({ ...prev, [ticker]: price }));
      }
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only connect once on mount

  // Re-register listener when subscriptions change
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    const handler = ({ ticker, price }: { ticker: string; price: number }) => {
      if (subscriptions.includes(ticker)) {
        setPrices((prev) => ({ ...prev, [ticker]: price }));
      }
    };

    socket.off("priceUpdate");
    socket.on("priceUpdate", handler);
  }, [subscriptions]);

  return { prices, connected };
}
