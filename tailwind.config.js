/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#16a34a',
          primaryDark: '#15803d',
          accent: '#f59e0b',
          surface: '#0b1220',
          surfaceSoft: '#0f172a',
        },
      },
      fontFamily: {
        sans: [
          'Kanit',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'Noto Sans Thai',
          'Ubuntu',
          'Cantarell',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
        display: ['Kanit', 'Noto Sans Thai', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 10px 30px -10px rgba(22, 163, 74, 0.3)',
      },
      backgroundImage: {
        'brand-gradient':
          'linear-gradient(135deg, rgba(22,163,74,1) 0%, rgba(34,197,94,1) 40%, rgba(245,158,11,1) 100%)',
      },
    },
  },
  plugins: [],
}
