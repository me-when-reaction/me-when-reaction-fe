import type { Config } from "tailwindcss";

import flowbite from "flowbite-react/tailwind";
import ts from 'tailwind-scrollbar';

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    flowbite.content()
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontSize: {
        '2xs': ['0.60rem', '0.85rem']
      }
    },
  },
  plugins: [
    flowbite.plugin(),
    ts
  ],
};
export default config;
