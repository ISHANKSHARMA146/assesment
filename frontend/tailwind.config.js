/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          blue: '#2563eb',
          'blue-dark': '#1e40af',
          'blue-light': '#dbeafe',
        },
        status: {
          present: '#10b981',
          absent: '#ef4444',
        },
        text: {
          primary: '#1f2937',
          secondary: '#6b7280',
        },
        border: '#e5e7eb',
        bg: {
          white: '#ffffff',
          gray: '#f9fafb',
        },
      },
    },
  },
  plugins: [],
}
