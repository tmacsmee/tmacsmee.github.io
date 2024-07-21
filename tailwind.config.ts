import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ["var(--font-inter)"],
      },
      keyframes: {
        dialogFadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        dialogFadeOut: {
          from: { opacity: "1" },
          to: { opacity: "0" },
        },
      },
      animation: {
        dialogFadeIn: "dialogFadeIn 0.1s ease-in-out",
        dialogFadeOut: "dialogFadeOut 0.1s ease-in-out",
      },
    },
  },
  plugins: [],
}
export default config
