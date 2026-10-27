/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        // paleta Apple-inspired
        apple: {
          dark:    '#1D1D1F',
          mid:     '#6E6E73',
          light:   '#F5F5F7',
          border:  'rgba(0,0,0,0.08)',
          accent:  '#0071E3',
          accentH: '#0077ED',
        },
        brand: {
          DEFAULT: '#5B6EBF',
          light:   '#7B8DD9',
          dark:    '#3D4F9F',
        }
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'card':  '0 2px 20px rgba(0,0,0,0.06)',
        'card-hover': '0 8px 40px rgba(0,0,0,0.12)',
        'glass': '0 4px 24px rgba(0,0,0,0.08)',
      },
      transitionTimingFunction: {
        'apple': 'cubic-bezier(0.4, 0, 0.2, 1)',
      }
    },
  },
  plugins: [],
}
