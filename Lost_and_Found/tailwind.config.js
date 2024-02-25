/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/*.{html,js}"],
  theme: {
    extend: {
      maxWidth: {
        '1/2': '50%',
      }
    },
    colors: {
      transparent: "transparent",
      current: "currentColor",
      purple: "#201F4D",
    },
  },
  plugins: [],
};
