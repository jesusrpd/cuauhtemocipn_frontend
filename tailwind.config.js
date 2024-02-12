/** @type {import('tailwindcss').Config} */
import {nextui} from "@nextui-org/react";
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      backgroundImage: {
        'hero-login': "url('/img/bg/mountain.jpg')",
        'home-loading':"url('/img/bg/bgLoading.jpg')",
        'frase': "url('/img/bg/frase.png')"
      },
      colors: {
        'ipn-color': "#A5004F",
        'black-cuau': "#111111",
      }
    },
  },
  darkMode: "class",
  plugins: [nextui()]
}
