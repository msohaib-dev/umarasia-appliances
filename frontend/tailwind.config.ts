import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f4f7fb",
          100: "#e8eef7",
          500: "#1d4f91",
          700: "#163a6b",
          900: "#0e2645"
        }
      },
      fontFamily: {
        heading: ["var(--font-manrope)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"]
      },
      boxShadow: {
        card: "0 8px 30px rgba(15, 36, 64, 0.08)",
        lift: "0 14px 36px rgba(15, 36, 64, 0.16)"
      }
    }
  },
  plugins: []
};

export default config;
