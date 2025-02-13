/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        playfair: ["Playfair Display", "serif"],
      },
      colors: {
        primary: "#F4F1EC",  // Svetlo bež
        secondary: "#ECE9E4", // Bež
        dark: "#07090D",      // Varijanta crne
        light: "#FDFDFE",     // Skoro bela
        accent: "#BF2734"     // Tamno crvena
      }
    },
  },
  corePlugins: {
    animation: true,
  },
  variants: {
    extend: {
      animation: ['group-hover'],
    },
  },
  plugins: [],
}

