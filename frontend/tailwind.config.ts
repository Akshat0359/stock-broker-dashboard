import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./hooks/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./contexts/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        // ── Brand purple ──────────────────────────────────
        brand: {
          50:  "#f0eeff",
          100: "#e0ddff",
          200: "#c5beff",
          300: "#a99aff",
          400: "#8e74ff",
          500: "#6B4EFF", // Primary
          600: "#5a3de0",
          700: "#4830c0",
          800: "#3822a0",
          900: "#281580",
        },
        // ── Neutral / page ────────────────────────────────
        page:  "#F7F7FC",
        panel: "#FFFFFF",
        // ── Borders / dividers ────────────────────────────
        border: {
          DEFAULT: "#E8E8F0",
          focus:   "#6B4EFF",
        },
        // ── Text ──────────────────────────────────────────
        text: {
          primary:   "#0F0F1A",
          secondary: "#6B6B8A",
          muted:     "#A0A0B8",
          inverse:   "#FFFFFF",
        },
        // ── Semantic ──────────────────────────────────────
        gain: {
          DEFAULT: "#00B37D",
          light:   "#E6F9F3",
          dark:    "#009966",
        },
        loss: {
          DEFAULT: "#E53E3E",
          light:   "#FEF0F0",
          dark:    "#C53030",
        },
        // ── Legacy dark tokens (kept for compat in hooks/contexts) ──
        surface: {
          900: "#0a0b0f",
          800: "#11131a",
          700: "#181b24",
          600: "#1e2230",
          500: "#252b3b",
        },
        accent: {
          400: "#8e74ff",
          500: "#6B4EFF",
          600: "#5a3de0",
        },
        ink: {
          100: "#f1f5f9",
          200: "#cbd5e1",
          400: "#94a3b8",
          600: "#475569",
        },
      },
      borderRadius: {
        "2xl": "20px",
        "3xl": "24px",
      },
      boxShadow: {
        card:    "0 1px 4px 0 rgba(15,15,26,0.06), 0 4px 24px 0 rgba(15,15,26,0.08)",
        "card-hover": "0 8px 40px 0 rgba(107,78,255,0.15), 0 2px 8px 0 rgba(15,15,26,0.08)",
        "brand-glow": "0 0 24px rgba(107,78,255,0.30)",
        "gain-glow":  "0 0 16px rgba(0,179,125,0.20)",
        "loss-glow":  "0 0 16px rgba(229,62,62,0.20)",
        "selected":   "0 0 0 2px #6B4EFF, 0 8px 32px rgba(107,78,255,0.18)",
        "inset-brand": "inset 0 0 0 2px #6B4EFF",
      },
      animation: {
        "fade-in":    "fadeIn 0.3s ease-out",
        "slide-up":   "slideUp 0.35s ease-out",
        "slide-down": "slideDown 0.3s ease-out",
        "scale-in":   "scaleIn 0.2s ease-out",
        "pulse-ring": "pulseRing 2s ease-in-out infinite",
        "shimmer":    "shimmer 2s linear infinite",
        "price-up":   "priceUp 0.5s ease-out",
        "price-down": "priceDown 0.5s ease-out",
      },
      keyframes: {
        fadeIn:    { "0%": { opacity: "0" },                                          "100%": { opacity: "1" } },
        slideUp:   { "0%": { transform: "translateY(20px)", opacity: "0" },           "100%": { transform: "translateY(0)", opacity: "1" } },
        slideDown: { "0%": { transform: "translateY(-12px)", opacity: "0" },          "100%": { transform: "translateY(0)", opacity: "1" } },
        scaleIn:   { "0%": { transform: "scale(0.95)", opacity: "0" },                "100%": { transform: "scale(1)", opacity: "1" } },
        pulseRing: { "0%,100%": { opacity: "1" },                                     "50%": { opacity: "0.4" } },
        shimmer:   { "0%": { backgroundPosition: "-200% 0" },                         "100%": { backgroundPosition: "200% 0" } },
        priceUp:   { "0%": { color: "#00B37D", textShadow: "0 0 10px rgba(0,179,125,0.5)" }, "100%": { color: "inherit", textShadow: "none" } },
        priceDown: { "0%": { color: "#E53E3E", textShadow: "0 0 10px rgba(229,62,62,0.5)" },  "100%": { color: "inherit", textShadow: "none" } },
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #6B4EFF 0%, #8e74ff 100%)",
        "page-gradient":  "radial-gradient(ellipse at 60% 0%, rgba(107,78,255,0.07) 0%, transparent 65%)",
        "card-shimmer":   "linear-gradient(90deg, transparent, rgba(107,78,255,0.06), transparent)",
      },
    },
  },
  plugins: [],
};

export default config;
