/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.html",
    "./app/**/*.{html,js}",
    "./components/**/*.{html,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#c3f400',
        'dark-bg': '#1a120b',
        'dark-surface': '#2a1f14'
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries')
  ]
}
