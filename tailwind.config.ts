import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: '#e35336',
          cream: '#f5f5dc',
          tan: '#f4a460',
          brown: '#a0522d',
        },
      },
    },
  },
  plugins: [],
};

export default config;
