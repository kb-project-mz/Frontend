module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],

  theme: {
    extend: {
      fontFamily: {
        sans: ["Noto Sans"],
      },

      maxWidth: {
        "9xl": "96rem", // 1536px
        "7.5xl": "88rem", // 1408px
      },

      colors: {
        customBlue: "#0B1573",
        customLime: "#d9f99d",
        customGray: "#e2e8f0",
      },
    },
  },

  plugins: [],
};