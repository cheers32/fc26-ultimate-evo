/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        fcBg: '#121212',
        fcPanel: '#1A1C1A',
        fcGreen: '#1ED760',
        fcGold: '#EBB626',
        fcTextDim: '#9CA3AF',
        fcBarBg: '#2A2D2A',
      },
      boxShadow: {
        'glow-green': '0 0 15px rgba(30, 215, 96, 0.4)',
        'glow-gold': '0 0 15px rgba(235, 182, 38, 0.4)',
      }
    },
  },
  plugins: [],
}
