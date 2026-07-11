/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        black:     "#0A0900",
        surface1:  "#111008",
        surface2:  "#191610",
        surface3:  "#222018",
        border:    "#2A2720",
        gold:      "#C9A84C",
        goldLight: "#D4B86A",
        cream:     "#F5F0E8",
        green:     "#7EC47E",
        red:       "#E06060",
      },
      fontFamily: {
        serif: ["Playfair Display", "serif"],
        sans:  ["Inter", "sans-serif"],
        mono:  ["Space Mono", "monospace"],
      },
    },
  },
  plugins: [],
};
