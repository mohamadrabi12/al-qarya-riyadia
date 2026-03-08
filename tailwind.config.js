/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1565c0',
          dark: '#0d47a1',
          light: '#1976d2',
        },
        secondary: {
          DEFAULT: '#c62828',
          dark: '#b71c1c',
        },
        accent: {
          DEFAULT: '#ffd700',
          dark: '#f9a825',
        },
        dark: '#1a1a1a',
      },
      fontFamily: {
        arabic: ['Cairo', 'Tajawal', 'sans-serif'],
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        marquee: 'marquee 30s linear infinite',
      },
    },
  },
  plugins: [],
}
