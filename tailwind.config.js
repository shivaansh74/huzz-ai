/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'deep-black': '#121212',
        'background': '#1A1A1A',
        'rizz-cyan': '#4ECDC4',
        'rizz-red': '#E63946',
      },
      screens: {
        'xs': '480px', // Extra small screen breakpoint
      },
      spacing: {
        '18': '4.5rem',
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
      },
      minHeight: {
        '10': '2.5rem',
        '12': '3rem',
        '16': '4rem',
      },
      maxHeight: {
        '128': '32rem',
      },
      fontSize: {
        'xxs': '0.65rem',
      },
      boxShadow: {
        'neon-red': '0 0 5px #E63946, 0 0 20px rgba(230, 57, 70, 0.3)',
        'neon-cyan': '0 0 5px #4ECDC4, 0 0 20px rgba(78, 205, 196, 0.3)',
      },
    },
    fontFamily: {
      sans: ['Inter', 'sans-serif'],
    },
  },
  plugins: [
    // Add a plugin to hide scrollbars but allow scrolling
    function({ addUtilities }) {
      const newUtilities = {
        '.scrollbar-hide': {
          /* IE and Edge */
          '-ms-overflow-style': 'none',
          /* Firefox */
          'scrollbar-width': 'none',
          /* Safari and Chrome */
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
      }
      addUtilities(newUtilities);
    }
  ],
}
