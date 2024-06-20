import { nextui } from "@nextui-org/react";
import { withUt } from "uploadthing/tw";

/** @type {import('tailwindcss').Config} */
export default withUt({
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        blink: {
          '0%, 100%': { opacity: 0.6 },
          '50%': { opacity: 0 },
        },
      },
      animation: {
        blink: 'blink 1.4s infinite',
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        primary: '#7D0A0A',
        dark_primary: '#5E0404',
        secondary: '#BF3131',
        third: '#EAD196',
        main_bg: '#F3EDC8',
      },
      screens: {
        // 'chrome-sm': '1280px',
        'chrome-md': '1350px',
        'chrome': '1700px',
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
    },
  },
  darkMode: "class",
  plugins: [
    nextui(), require('tailwindcss-textshadow'), require('tailwind-scrollbar')({ nocompatible: true, preferredStrategy: 'pseudoelements' }),
  ],
});