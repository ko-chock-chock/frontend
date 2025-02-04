import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/commons/**/*.{js,ts,jsx,tsx,mdx}", // commons 경로 추가
  ],
  theme: {
    extend: {
      colors: {
        // ✅ 텍스트 컬러 시스템
        text: {
          primary: "#2E2E2C", // 기본 텍스트
          secondary: "#545245", // 서브 텍스트 (text-sm-bold 등에서 사용)
          tertiary: "#A3A08F", // 보조 텍스트
          quaternary: "#706D5C", // 약한 강조 텍스트
          // quinary: "#8D8974", // 🔄 미사용 컬러로 제거 (text-sm-bold 등에서 secondary로 대체)
          error: "#EC1909", // 에러 텍스트
        },

        // ✅ 주요 브랜드 컬러
        primary: "#1B8D5A", // 프로젝트 대표 색상 (버튼, 주요 강조 요소)

        // ✅ 배경 컬러 시스템
        background: "#FEFEFE", // 전체 페이지 기본 배경색
        "nav-bg": "#FDFCF8", // 네비게이션 바 배경
        "list-line": "#E9E8E3", // 리스트 구분선 및 테두리

        // ✅ 상태 컬러
        error: "#EC1909", // 에러 메시지 및 오류 상태 색상

        // ✅ 추가 배경 컬러
        "receiver-bubble": "#BFE5B3", // 챗 상대 말풍선
        "mypage-profile-card": "#F2F4EB", // 마이페이지 프로필 카드
        "loginpage-bg": "#FCFEF5", // 로그인 페이지 배경

        // ✅ 버튼 색상 시스템
        button: {
          text: {
            primary: "#FFFFFF", // 버튼 기본 텍스트 색상
            secondary: "#35351E", // 버튼 보조 텍스트 색상
            tertiary: "#1B8D5A", // 강조 텍스트 색상
            muted: "#8D8974", // 버튼 내 서브 텍스트 색상
          },
          bg: {
            primary: "#1B8D5A", // 기본 버튼 배경
            secondary: "#E9E8E3", // 보조 버튼 배경
            tertiary: "#FFFFFF", // 서브 버튼 배경
          },
        },
      },

      fontFamily: {
        // 🔄 기본 폰트를 Pretendard로 통일
        sans: [
          "Pretendard",
          "-apple-system",
          "Apple SD Gothic Neo",
          "Roboto",
          "Noto Sans KR",
          "sans-serif",
        ],
        // 🔄 미사용 폰트 제거
        // sandoll: ['"Sandoll Tviceket"', "sans-serif"],
        // suit: ['"SUIT"', "sans-serif"],
      },

      /**
       * 텍스트 스타일 시스템
       * - Pretendard 폰트 사용
       * - 모든 텍스트는 letter-spacing과 line-height가 정의되어 있음
       * 
       * 🔄 px to rem 변환 기준
       * fontSize: px값을 16으로 나눔 (1rem = 16px)
       * letterSpacing: px값을 16으로 나눔
       * 예시: 
       * - 20px = 20/16 = 1.25rem
       * - -0.5px = -0.5/16 = -0.031rem
       * 
       * fontWeight 값 기준:
       * - Regular: 400
       * - Medium: 500
       * - Semibold: 600
       * - Bold: 700
       */
      fontSize: {
        /**
         * [가격 표시용 텍스트]
         * 사용처: 구인구직 리스트 가격 표시
         */
        jobListPrice: [
          "1.375rem", // 🔄 22px -> 1.375rem
          {
            lineHeight: "150%",
            fontWeight: "700", // Bold 스타일
            letterSpacing: "-0.034rem", // 🔄 -0.55px -> -0.034rem
          },
        ],

        /**
         * [페이지 타이틀용 텍스트]
         * 사용처: 회원가입, 로그인, 마이페이지 등의 페이지 상단 타이틀
         */
        title: [
          "1.25rem", // 🔄 20px -> 1.25rem
          {
            lineHeight: "150%",
            fontWeight: "700", // Bold 스타일
            letterSpacing: "-0.031rem", // 🔄 -0.5px -> -0.031rem
          },
        ],

        /**
         * [섹션 타이틀용 텍스트]
         * 사용처: 마이페이지 게시글 리스트의 타이틀
         */
        section: [
          "1.125rem", // 🔄 18px -> 1.125rem
          {
            lineHeight: "150%",
            fontWeight: "600", // Semibold 스타일
            letterSpacing: "-0.028rem", // 🔄 -0.45px -> -0.028rem
          },
        ],

        /**
         * [기본 텍스트 - Regular]
         * 사용처: 인풋 필드 입력 텍스트, 마이페이지 레벨 라벨
         */
        base: [
          "1rem", // 🔄 16px -> 1rem
          {
            lineHeight: "150%",
            fontWeight: "500", // Medium 스타일
            letterSpacing: "-0.025rem", // 🔄 -0.4px -> -0.025rem
          },
        ],

        /**
         * [기본 텍스트 - Semi Bold]
         * 사용처: 마이페이지 레벨 등급, 마이페이지 게시글 리스트 가격
         */
        "base-semibold": [
          "1rem", // 🔄 16px -> 1rem
          {
            lineHeight: "150%",
            fontWeight: "600", // Semibold 스타일
            letterSpacing: "-0.025rem", // 🔄 -0.4px -> -0.025rem
          },
        ],

        /**
         * [기본 텍스트 - Bold]
         * 사용처: 탭 메뉴 활성화 상태
         */
        "base-bold": [
          "1rem", // 🔄 16px -> 1rem
          {
            lineHeight: "150%",
            fontWeight: "700", // Bold 스타일
            letterSpacing: "-0.025rem", // 🔄 -0.4px -> -0.025rem
          },
        ],

        /**
         * [보조 텍스트 - Regular]
         * 사용처: 마이페이지 게시글 리스트의 지역구, 시간 등
         */
        sm: [
          "0.875rem", // 🔄 14px -> 0.875rem
          {
            lineHeight: "150%",
            fontWeight: "500", // Medium 스타일
            letterSpacing: "-0.022rem", // 🔄 -0.35px -> -0.022rem
          },
        ],

        /**
         * [보조 텍스트 - Bold]
         * 사용처: 회원가입/로그인/정보수정 페이지의 인풋 라벨, 모달 타이틀
         */
        "sm-bold": [
          "0.875rem", // 🔄 14px -> 0.875rem
          {
            lineHeight: "150%",
            fontWeight: "700", // Bold 스타일
            letterSpacing: "-0.022rem", // 🔄 -0.35px -> -0.022rem
          },
        ],
      },
    },
  },
  plugins: [],
};

export default config;