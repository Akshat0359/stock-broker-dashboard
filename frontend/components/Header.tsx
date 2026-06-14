"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface HeaderProps {
  connected: boolean;
}

export function Header({ connected }: HeaderProps) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      router.replace("/login");
    } finally {
      setLoggingOut(false);
    }
  };

  const initial = user?.email?.[0]?.toUpperCase() ?? "U";

  return (
    <header className="sticky top-0 z-50 bg-panel/90 backdrop-blur-xl border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">

        {/* ── Logo ── */}
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <div className="w-8 h-8 rounded-xl bg-brand-gradient flex items-center justify-center shadow-sm">
            {/* Chart icon */}
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
          </div>
          <span className="font-bold text-[17px] tracking-tight text-text-primary">
            Stock<span className="text-gradient">Dash</span>
          </span>
        </div>

        {/* ── Nav label (desktop) ── */}
        <div className="hidden md:flex items-center gap-1 text-sm text-text-muted">
          <span className="text-brand-500 font-medium">Dashboard</span>
        </div>

        {/* ── Right side ── */}
        <div className="flex items-center gap-3 ml-auto">

          {/* Connection pill */}
          <div
            className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-300 ${
              connected
                ? "bg-gain-light border-gain/20 text-gain-dark"
                : "bg-gray-100 border-border text-text-muted"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                connected ? "bg-gain animate-pulse" : "bg-text-muted"
              }`}
            />
            {connected ? "Live" : "Connecting…"}
          </div>

          {/* User avatar + email */}
          {user && (
            <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-page border border-border">
              <div className="w-6 h-6 rounded-lg bg-brand-gradient flex items-center justify-center text-[11px] font-bold text-white shadow-sm">
                {initial}
              </div>
              <span className="text-sm font-medium text-text-primary truncate max-w-[160px]">
                {user.email}
              </span>
            </div>
          )}

          {/* Logout */}
          <button
            id="btn-logout"
            onClick={handleLogout}
            disabled={loggingOut}
            className="btn-ghost text-sm"
          >
            {loggingOut ? (
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full border-2 border-current border-t-transparent animate-spin" />
                Logging out
              </span>
            ) : (
              "Log out"
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
