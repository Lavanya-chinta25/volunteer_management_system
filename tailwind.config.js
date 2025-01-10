module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        bubble: "bubble 6s ease-in-out infinite, spin 8s linear infinite",
        float: "float 4s ease-in-out infinite",
      },
      keyframes: {
        bubble: {
          "0%": { transform: "translate(0, 0) scale(1)", opacity: 0.6 },
          "50%": { transform: "translate(15px, -15px) scale(1.2)", opacity: 1 },
          "100%": { transform: "translate(0, 0) scale(1)", opacity: 0.6 },
        },
        float: {
          "0%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-15px)" },
          "100%": { transform: "translateY(0)" },
        },
        spin: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      filter: {
        glass: "blur(2px) brightness(1.2)",
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
