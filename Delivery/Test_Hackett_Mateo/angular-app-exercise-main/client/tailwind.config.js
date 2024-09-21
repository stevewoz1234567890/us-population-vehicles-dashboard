const defaultTheme = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        primary: "#0F335B",
        secondary: "#4D5358",
        "blue-sky": "#EBF3FA",
        "blue-baby": "#E3EFF8",
        "blue-powder": "#D9E7F5",
      },
      fontFamily: {
        sans: ['"OpenSans"', ...defaultTheme.fontFamily.sans],
      },
      width: {
        "45": "11.25rem",
      }
    },
  },
  plugins: [],
};
