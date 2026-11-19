/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      colors: {
        gold: {
          400: '#E5C158',
          500: '#D4AF37',
          600: '#C5A059',
          'primary': '#DFBD78',
        },
        charcoal: {
          800: '#1F2937',
          900: '#111827',
          950: '#0B0F17',
        },
      },
    },
  },
  plugins: [],
};
