"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { ApiError } from "@/contexts/AuthContext";

type Mode = "login" | "register";

export default function LoginPage() {
  const { user, loading, login, register } = useAuth();
  const router = useRouter();
  const [mode, setMode]         = useState<Mode>("login");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (!loading && user) router.replace("/dashboard");
  }, [user, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await register(email, password);
      }
      router.replace("/dashboard");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const fillDemo = (e: string, p: string) => {
    setEmail(e);
    setPassword(p);
    setMode("login");
    setError(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-page">
        <div className="w-8 h-8 rounded-full border-2 border-brand-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-page flex">
      {/* ── Left panel: branding (desktop only) ──────────────── */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] relative overflow-hidden flex-col justify-between p-12"
        style={{ background: "linear-gradient(135deg, #6B4EFF 0%, #4830C0 60%, #281580 100%)" }}
      >
        {/* Decorative circles */}
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-white/5" />
        <div className="absolute top-1/2 -right-20 w-64 h-64 rounded-full bg-white/5" />
        <div className="absolute -bottom-16 -left-16 w-72 h-72 rounded-full bg-white/5" />
        <div className="absolute bottom-1/3 right-12 w-40 h-40 rounded-full bg-white/5" />

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
          </div>
          <span className="text-white font-bold text-xl tracking-tight">StockDash</span>
        </div>

        {/* Hero copy */}
        <div className="relative">
          <h2 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-5">
            Real-time stock<br />tracking, built for<br />
            <span className="text-white/70">serious traders.</span>
          </h2>
          <p className="text-white/60 text-base leading-relaxed max-w-sm">
            Monitor live prices for GOOG, TSLA, AMZN, META, and NVDA — updated every second via WebSocket.
          </p>

          {/* Feature bullets */}
          <ul className="mt-8 space-y-3">
            {[
              "Live WebSocket price streaming",
              "Per-user subscription isolation",
              "JWT auth in HttpOnly cookies",
              "Simulated prices every 1 second",
            ].map((f) => (
              <li key={f} className="flex items-center gap-3 text-white/80 text-sm">
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                {f}
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom tickers strip */}
        <div className="relative flex items-center gap-3 flex-wrap">
          {["GOOG", "TSLA", "AMZN", "META", "NVDA"].map((t) => (
            <span key={t} className="px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-sm text-white/80 text-xs font-semibold border border-white/10">
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* ── Right panel: auth form ─────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-8 py-12 relative">
        {/* Background decoration (mobile) */}
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-brand-500/5 -translate-y-1/2 translate-x-1/2 pointer-events-none" />

        <div className="w-full max-w-sm animate-slide-up">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-xl bg-brand-gradient flex items-center justify-center shadow-brand-glow">
              <svg className="w-4.5 h-4.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
            </div>
            <span className="font-bold text-xl text-text-primary">
              Stock<span className="text-gradient">Dash</span>
            </span>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-text-primary">
              {mode === "login" ? "Welcome back" : "Create an account"}
            </h1>
            <p className="text-text-secondary text-sm mt-1">
              {mode === "login"
                ? "Sign in to access your live dashboard"
                : "Start tracking real-time stock prices"}
            </p>
          </div>

          {/* Mode tabs */}
          <div className="flex rounded-xl bg-gray-100 p-1 mb-6">
            {(["login", "register"] as Mode[]).map((m) => (
              <button
                key={m}
                id={`tab-${m}`}
                onClick={() => { setMode(m); setError(null); }}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                  mode === m
                    ? "bg-white text-text-primary shadow-sm"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                {m === "login" ? "Sign In" : "Register"}
              </button>
            ))}
          </div>

          {/* Form */}
          <form id="form-auth" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="input-email" className="block text-sm font-medium text-text-primary mb-1.5">
                Email address
              </label>
              <input
                id="input-email"
                type="email"
                autoComplete="email"
                required
                placeholder="you@example.com"
                className="input-field"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="input-password" className="block text-sm font-medium text-text-primary mb-1.5">
                Password
              </label>
              <input
                id="input-password"
                type="password"
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                required
                placeholder={mode === "register" ? "Minimum 6 characters" : "Enter your password"}
                className="input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-loss-light border border-loss/20 text-loss-dark text-sm animate-fade-in">
                <svg className="w-4 h-4 mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <button
              id="btn-auth-submit"
              type="submit"
              disabled={submitting}
              className="btn-primary w-full py-3 mt-1 text-sm"
            >
              {submitting ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  {mode === "login" ? "Signing in…" : "Creating account…"}
                </>
              ) : mode === "login" ? (
                "Sign In"
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-6 p-4 rounded-xl bg-brand-50 border border-brand-100">
            <p className="text-xs font-semibold text-brand-600 mb-2.5 flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              Demo accounts
            </p>
            <div className="space-y-2">
              <button
                id="demo-alice"
                type="button"
                onClick={() => fillDemo("alice@example.com", "password123")}
                className="w-full text-left px-3 py-2 rounded-lg bg-white border border-brand-100 hover:border-brand-400 transition-colors duration-150 group"
              >
                <div className="text-xs font-semibold text-text-primary group-hover:text-brand-600 transition-colors">
                  alice@example.com
                </div>
                <div className="text-[10px] text-text-muted">password123</div>
              </button>
              <button
                id="demo-bob"
                type="button"
                onClick={() => fillDemo("bob@example.com", "password456")}
                className="w-full text-left px-3 py-2 rounded-lg bg-white border border-brand-100 hover:border-brand-400 transition-colors duration-150 group"
              >
                <div className="text-xs font-semibold text-text-primary group-hover:text-brand-600 transition-colors">
                  bob@example.com
                </div>
                <div className="text-[10px] text-text-muted">password456</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
