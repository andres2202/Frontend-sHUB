/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html", // Si estás usando Vite o HTML simple
    "./src/**/*.{vue,js,ts,jsx,tsx}" // Asegúrate de que Tailwind CSS analice estos archivos
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

