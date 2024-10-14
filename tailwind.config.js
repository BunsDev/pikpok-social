/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter", "sans-serif"],
      },
      backgroundImage: {
        "custom-gradient":
          "linear-gradient(180deg, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.85) 95%, rgba(0, 0, 0, 1) 100%)",
      },
      fontSize: {
        h1: ["1.5rem", { lineHeight: "100%" }], // 24/48
        h3: ["1rem", { lineHeight: "2rem" }], // 24/32
        paragraph: ["1rem", { lineHeight: "150%" }], // 16/28
        phrase: ["1rem", { lineHeight: "auto" }], // 12/20
      },
      boxShadow: {
        "lock-shadow": "0 0 8px 0 rgba(90, 103, 200, 1)", // RGB equivalent of #5A67C8 with no spread
      },
      colors: {
        "primary-color": "#3F51DA",
        "primary-button-selected": "#3F51DA",
        "primary-button-hover": "#3B3C3E",
        "primary-button-active": "#3145E0",
        "secondary-button-selected": "#4B4D60",
        "secondary-button-hover": "#5C5E74",
        "secondary-button-active": "#3145E0",
        "error-button-selected": "#D32F2F", // Error button when selected
        "error-button-hover": "#B71C1C", // Error button on hover (darker for a more intense hover effect)
        "error-button-active": "#C62828",
        "modal-background": "#2F3139",
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    function ({ addUtilities }) {
      addUtilities({
        ".no-scrollbar::-webkit-scrollbar": {
          display: "none",
        },
        ".no-scrollbar": {
          "-ms-overflow-style": "none" /* IE and Edge */,
          "scrollbar-width": "none" /* Firefox */,
        },
      });
    },
  ],
};
