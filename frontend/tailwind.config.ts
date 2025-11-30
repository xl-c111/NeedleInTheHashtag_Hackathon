import type { Config } from "tailwindcss";

const config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Custom brand colors
        'lightest-brown': '#FDD9AD',
        'light-brown': '#C3A785',
        'bright-brown': '#CA9C65',
        'bright-red': '#A32828',
        'dark-red': '#6F1A1A',
        // Custom palette based on brand browns
        'custom': {
          50: '#FEF7F0',
          100: '#FDD9AD',
          200: '#F4D19B', 
          300: '#E6C189',
          400: '#D8B177',
          500: '#CA9C65',
          600: '#C3A785',
          700: '#A08660',
          800: '#7D6B4C',
          900: '#5A4D38'
        }
      },
      keyframes: {
        float0: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        float1: {
          "0%, 100%": { transform: "translateY(0) translateX(0)" },
          "50%": { transform: "translateY(-15px) translateX(5px)" },
        },
        float2: {
          "0%, 100%": { transform: "translateY(0) translateX(0)" },
          "50%": { transform: "translateY(-5px) translateX(-5px)" },
        },
        float3: {
          "0%, 100%": { transform: "translateY(0) translateX(0)" },
          "50%": { transform: "translateY(-8px) translateX(8px)" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;

export default config;
