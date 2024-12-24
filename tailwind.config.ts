import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        main_bg_color: "#FEFEFE", // 메인 백그라운드 색상
        main_text_color: "#35351E", // 메인 텍스트 컬러
      },
      fontFamily: {
        sandoll: ['"Sandoll Tviceket"', "sans-serif"], // 폰트 디자인 => font-sandoll이라고 넣으면 됨
        suit: ['"SUIT"', "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
