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
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
        mono: ["monospace"],
      },
      colors: {
        // TaskBloom brand palette
        navy: {
          DEFAULT: "var(--navy)",
          foreground: "var(--navy-foreground)",
        },
        bloom: {
          DEFAULT: "var(--bloom-purple)",
          muted: "var(--bloom-purple-muted)",
        },
        electric: "var(--electric-blue)",
        rose: "var(--soft-rose)",
        mint: "var(--mint)",
        // Food-inspired palette (semantic mapping)
        strawberry: "var(--strawberry)",
        avocado: "var(--avocado)",
        blueberry: "var(--blueberry)",
        lemon: "var(--lemon)",
        dragonfruit: "var(--dragonfruit)",
        grape: "var(--grape)",
        mango: "var(--mango)",
        // Semantic aliases using food palette for dashboard
        primary: "var(--color-primary)",
        success: "var(--color-success)",
        info: "var(--color-info)",
        warning: "var(--color-warning)",
        danger: "var(--color-danger)",
        accent: "var(--color-accent)",
      },
      borderRadius: {
        xl: "var(--radius-xl)",
        "2xl": "var(--radius-2xl)",
      },
      boxShadow: {
        soft: "var(--shadow-soft)",
        glass: "var(--shadow-glass)",
      },
    },
  },
  plugins: [],
};

export default config;
