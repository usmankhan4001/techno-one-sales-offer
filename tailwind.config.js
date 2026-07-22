/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pci: {
          blue: '#162840',
          dark: '#0f1f33',
          navy: '#003366',
          gold: '#D4AF37',
          accent: '#3ba1db',
          lightBlue: '#4f9ed0',
          card: '#1e324d',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
