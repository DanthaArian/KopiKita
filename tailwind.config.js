/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        coffee: "#5A3825",
        cream: "#F7E8D0",
        espresso: "#2B1A12",
        caramel: "#C98542",
        softBeige: "#FFF8EF",
      },
      boxShadow: {
        soft: "0 18px 48px rgba(43, 26, 18, 0.10)",
        warm: "0 24px 64px rgba(90, 56, 37, 0.16)",
        caramel: "0 12px 28px rgba(201, 133, 66, 0.28)",
      },
      fontFamily: {
        display: ["Plus Jakarta Sans", "Inter", "Segoe UI", "sans-serif"],
        body: ["Inter", "Segoe UI", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
};
