/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        modalShow: {
          '0%': { transform: 'scale(0.95)', opacity: 0 },
          '100%': { transform: 'scale(1)', opacity: 1 },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        shimmer: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        },
        pulse: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
        musicbars1: {
          '0%, 100%': { height: '0.5rem' },
          '50%': { height: '1.5rem' },
        },
        musicbars2: {
          '0%, 100%': { height: '0.75rem' },
          '25%': { height: '1.75rem' },
          '75%': { height: '0.5rem' },
        },
        musicbars3: {
          '0%, 100%': { height: '1rem' },
          '33%': { height: '0.75rem' },
          '66%': { height: '1.75rem' },
        }
      },
      animation: {
        modalShow: 'modalShow 0.2s ease-out',
        fadeIn: 'fadeIn 0.6s ease-out',
        shimmer: 'shimmer 3s ease-in-out infinite',
        pulse: 'pulse 2s ease-in-out infinite',
        musicbars1: 'musicbars1 1s ease-in-out infinite',
        musicbars2: 'musicbars2 1.2s ease-in-out infinite',
        musicbars3: 'musicbars3 0.8s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}