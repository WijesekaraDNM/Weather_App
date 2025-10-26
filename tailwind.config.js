/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}",],
  theme: {
    extend: {
      fontSize: {
        'xxs': '0.625rem',  // Extra small size
        'xxxs': '0.5rem',   // Extra extra small size
        'xxxxs': '0.375rem' // Extra extra extra small size
      },
    },
  },
  plugins: [],
}

