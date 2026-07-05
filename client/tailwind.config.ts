import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        blush: "#f7d9e8",
        lavender: "#dcd4ff",
        mist: "#cfefff",
        mint: "#d9f5e8",
        porcelain: "#fbfbfd",
        ink: "#25222a"
      },
      fontFamily: {
        display: ["Cormorant Garamond", "Georgia", "serif"],
        sans: ["Inter", "ui-sans-serif", "system-ui"]
      },
      boxShadow: {
        soft: "0 24px 80px rgba(98, 88, 122, 0.14)"
      }
    }
  },
  plugins: []
} satisfies Config;
