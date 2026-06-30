/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        iron: {
          50:  '#F4F1EC',
          100: '#E8E3D8',
          200: '#D1C7B1',
          300: '#B9AC8A',
          400: '#A29063',
          500: '#8B7542',
          600: '#6F5D35',
          700: '#534628',
          800: '#382F1B',
          900: '#1C180E',
        },
        amber: {
          400: '#F59E0B',
          500: '#D97706',
          600: '#B45309',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
