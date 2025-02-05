import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        cornflowerBlue: "var(--cornflower-blue)",
        juneBud: "var(--june-bud)",
        signalBlack: "var(--signal-black)",
        linen: "var(--linen)",
      },
      fontFamily: {
        sans: "var(--font-geist-sans)",
        mono: "var(--font-geist-mono)",
        poppins: "var(--font-poppins)",
      }
    },
  },
  plugins: [],
} satisfies Config;
