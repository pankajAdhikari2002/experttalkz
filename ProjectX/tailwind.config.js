/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#4169E1",
        "background-light": "#0b1530",
        "background-dark": "#0b1530",
        "surface-dark": "#162040", 
        "card-dark": "#162040",
        "text-secondary": "#9dabb9",
      },
      fontFamily: {
        "display": ["Lexend", "sans-serif"],
        "sans": ["Lexend", "sans-serif"], // Set as default sans
      },
      borderRadius: {
        "lg": "0.5rem",
        "xl": "0.75rem",
      },
    },
  },
  plugins: [],
}
