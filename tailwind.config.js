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
        linear: {
          base: '#08090A', // Deepest black/gray
          surface: '#121417', // Slightly lighter for cards
          border: 'rgba(255, 255, 255, 0.08)',
          accent: '#5E6AD2', // Linear-like Blurple
          accentHover: '#4e5ac0',
          text: '#E0E0E0',
          subtext: '#8A8F98',
        }
      }
    },
  },
  plugins: [],
}