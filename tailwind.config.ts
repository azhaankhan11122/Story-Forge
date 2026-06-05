import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0a0a0a",
        surface: "#141414",
        "surface-2": "#1e1e1e",
        border: "#2a2a2a",
        "text-primary": "#ffffff",
        "text-secondary": "#888888",
        accent: "#c9a96e",
        "accent-hover": "#d4b882",
        danger: "#ff4444",
        success: "#44ff88",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["Fira Code", "monospace"],
      },
      borderRadius: {
        standard: "8px",
        card: "12px",
        modal: "16px",
      },
      transitionDuration: {
        micro: "150ms",
        panel: "300ms",
      },
    },
  },
  plugins: [],
};

export default config;
