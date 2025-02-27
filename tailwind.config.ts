import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#007bff", // Blue (from buttons)
        secondary: "#1a1a1a", // Dark gray/black (for text)
        accent: "#ffcc00", // Yellow/orange accent (if needed)
        background: "#ffffff", // White background
        muted: "#161616", // Light gray for subtle UI elements
      },
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
