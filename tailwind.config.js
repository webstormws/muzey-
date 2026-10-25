/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#10131a',
        panel: 'rgba(20,24,34,.82)',
        accent: '#f5b335'
      }
    },
  },
  plugins: [],
}
