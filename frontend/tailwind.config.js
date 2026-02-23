/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        unigo: {
          black: '#000000',
          white: '#ffffff',
          green: '#90EE90', // Light green
          orange: '#FFA500',
          red: '#FF4500',
          slate: {
            50: '#f8fafc',
            100: '#f1f5f9',
            200: '#e2e8f0',
            800: '#1e293b',
            900: '#0f172a',
          }
        }
      }
    },
  },
  plugins: [],
}
