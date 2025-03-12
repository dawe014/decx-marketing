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
        primary: "#FFC107", // Yellow button & highlights
        secondary: "#3DBEF3", // Blue highlight
        background: "#0B1838", // Dark background
        bgSecondary: "#111928",
        bgService: "#060314",
        overlay: "rgba(17,24,39, 0.7)", // Semi-transparent black overlay
        textPrimary: "#FFFFFF", // White text
        textSecondary: "#9CA3AF", // Gray subtext
        borderColor: "#3A3A3A", // Border & card background
      },
      fontFamily: {
        sans: ["Poppins", "sans-serif"], // Use Poppins for headings
      },
      boxShadow: {
        btn: "0px 4px 6px rgba(255, 193, 7, 0.4)", // Yellow button shadow
      },
    },
  },
  plugins: [],
} satisfies Config;
