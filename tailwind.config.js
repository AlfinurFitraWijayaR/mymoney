/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "var(--font-inter)",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
        display: [
          "var(--font-inter)",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "monospace",
        ],
      },
      colors: {
        brand: {
          50: "#f0f9f4",
          100: "#dcf1e6",
          200: "#bbe3cf",
          300: "#88ccaf",
          400: "#52ae88",
          500: "#2d9268",
          600: "#1e7653",
          700: "#195f44",
          800: "#174c37",
          900: "#143f2e",
          950: "#0a231a",
        },
        primary: {
          50: "#eef6ff",
          100: "#d9ebff",
          200: "#bbddff",
          300: "#8dc6ff",
          400: "#56a5ff",
          500: "#2f7fff",
          600: "#1b61f5",
          700: "#144ce1",
          800: "#173db6",
          900: "#18378f",
          950: "#142357",
        },
        surface: {
          0: "#ffffff",
          50: "#f8faf9",
          100: "#f0f4f2",
          200: "#e4ece8",
          300: "#ccd8d2",
          400: "#9db5ab",
          500: "#6e8f85",
          600: "#4e6d65",
          700: "#3d5650",
          800: "#2e4039",
          900: "#1e2a25",
          950: "#101a16",
        },
      },
      boxShadow: {
        card: "0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.06)",
        "card-hover":
          "0 4px 12px 0 rgb(0 0 0 / 0.08), 0 2px 4px -1px rgb(0 0 0 / 0.06)",
        input: "inset 0 1px 2px 0 rgb(0 0 0 / 0.04)",
      },
    },
  },
  plugins: [],
};
