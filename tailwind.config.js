/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: '#f5f3ef',
        'dark-gray': '#2f2f2f',
        'medium-gray': '#555',
        'light-gray': '#6b6b6b',
      },
      borderRadius: {
        'custom': '16px',
      },
    },
  },
  plugins: [],
}