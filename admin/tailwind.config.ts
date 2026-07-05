import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        shell: "#f6f7fb",
        panel: "#ffffff",
        ink: "#22242c",
        muted: "#687083",
        accent: "#9b8cff",
        mint: "#dff7ea",
        blush: "#f8dce9"
      },
      boxShadow: {
        panel: "0 18px 50px rgba(31, 35, 51, 0.08)"
      }
    }
  },
  plugins: []
} satisfies Config;
