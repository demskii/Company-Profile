/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Tema cerah bernuansa alumunium (silver) + aksen biru & oranye
        primary: {
          50: '#eef6ff', 100: '#d9ebff', 300: '#7bb9ff',
          500: '#1e88ff', 600: '#0f6fe0', 700: '#0c58b3'
        },
        accent: { 500: '#ff8a1e', 600: '#e6740b' },
        metal: { 50: '#f7f8fa', 100: '#eef0f3', 300: '#c7ccd4', 600: '#5b6472', 800: '#1f2530' }
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] }
    },
  },
  plugins: [],
}
