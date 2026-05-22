import type { Config } from "tailwindcss";

export default <Partial<Config>>{
  content: ["./app.vue", "./components/**/*.{vue,js,ts}", "./layouts/**/*.vue", "./pages/**/*.vue"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Poppins", "Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        ocean: "#00AEEF",
        navy: "#06283D",
        sand: "#F8F9FA",
        yellow: "#FFD43B",
        coral: "#FF6B6B",
      },
      boxShadow: {
        soft: "0 18px 55px rgba(6, 40, 61, 0.18)",
      },
    },
  },
  plugins: [],
};

