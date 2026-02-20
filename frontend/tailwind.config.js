/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#00f5a0',
        secondary: '#00d9f5',
        dark: '#050816',
      },
    },
  },
  plugins: [],
}

