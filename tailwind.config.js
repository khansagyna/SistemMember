/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,tsx}",
    "./src/**/*.{js,ts,tsx}", 
  ],

  presets: [require("nativewind/preset")],

  theme: {
    extend: {
      colors: {
        primary: "#1e3a8a",
        secondary: "#0ea5e9",
        success: "#10b981",
        danger: "#ef4444",
        warning: "#f59e0b",
        dark: "#0f172a",
      },

      borderRadius: {
        "4xl": "24px",
        "5xl": "32px",
      },

      boxShadow: {
        glass: "0 8px 32px rgba(31,41,55,0.1)",
        card: "0 4px 16px rgba(31,41,55,0.08)",
      },

      fontFamily: {
        inter: ["Inter_400Regular"],
        interMedium: ["Inter_500Medium"],
        interBold: ["Inter_700Bold"],
      },
    },
  },

  plugins: [],
};