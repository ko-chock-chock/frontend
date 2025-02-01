/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    // Tailwind CSS 설정
    tailwindcss: {},

    // Autoprefixer 설정
    // [목적]
    // - 브라우저/기기별 CSS 호환성 자동 보장
    // - 개발 생산성 향상 및 크로스 브라우징 이슈 해결
    autoprefixer: {},
  },
};

export default config;
