// tailwind.config.js
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        cursive: ["Dancing Script", "cursive"],
        serif: ["Playfair Display", "serif"],
      },
    },
  },
  plugins: [],
};
