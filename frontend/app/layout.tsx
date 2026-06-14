import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

export const metadata: Metadata = {
  title: "StockDash — Real-Time Stock Dashboard",
  description:
    "Monitor live stock prices for GOOG, TSLA, AMZN, META, and NVDA with real-time WebSocket updates. Secure, fast, and beautiful.",
  keywords: ["stock dashboard", "real-time stocks", "websocket", "stock tracker"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,300;0,14..32,400;0,14..32,500;0,14..32,600;0,14..32,700;0,14..32,800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-page text-text-primary antialiased">
        {/* Subtle radial gradient on the page */}
        <div
          className="fixed inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 70% -10%, rgba(107,78,255,0.07) 0%, transparent 60%)",
          }}
        />
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
