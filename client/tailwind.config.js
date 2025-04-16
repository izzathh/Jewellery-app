/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      transitionProperty: {
        'width': 'width'
      },
      colors: {
        'appurple': '#b650f6',
        'dark-purple': '#251d28',
        'light-purple': '#b650f614',
        'semi-light-purple': '#b650f62b'
      }
    },
  },
  plugins: [],
}

