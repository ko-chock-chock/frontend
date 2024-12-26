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
        // 주요 브랜드 컬러
        primary: "#1B8D5A",

        // 배경 컬러
        background: "#FEFEFE", // main_bg_color와 동일
        "nav-bg": "#FCFEF5",
        "list-line": "#E9E8E3",


        // 텍스트 컬러 시스템
        text: {
          primary: "#35351E", // main_text_color와 동일
          // - 페이지 타이틀 (회원가입, 마이페이지 등)
          // - 입력 필드 텍스트
          // - 채팅 메시지 내용
          // - 게시글 리스트 타이틀, 가격
          // - 채팅 목록 닉네임
          secondary: "#545245",
          // - 마이페이지 레벨 라벨
          // - 게시글 작성 페이지 인풋 라벨
          // - 드롭다운 메뉴 텍스트
          // - 채팅 목록 마지막 대화 시간
          tertiary: "#A3A08F",
          // - 게시글 리스트 지역구/시간 정보
          // - 플레이스홀더 텍스트
          // - 부가 정보 텍스트
          quaternary: "#706D5C",
          // - 회원가입 유효성 안내문구
          // - 마이페이지 비활성화 탭
          // - 게시글 좋아요/채팅 수
          // - 닉네임 (리스트 내)
          quinary: "#8D8974",
          // - 회원가입/수정 인풋 라벨
          // - 모달 타이틀
          // - 채팅 시간
          // - 채팅 리스트 마지막 메시지
          timerFontColor: "#664700"
        },

        // 에러 상태 컬러
        error: "#EC1909",
      },

      fontFamily: {
        sandoll: ['"Sandoll Tviceket"', "sans-serif"], // 폰트 디자인 => font-sandoll이라고 넣으면 됨
        suit: ['"SUIT"', "sans-serif"],

        // Pretendard 폰트 설정 (기본 폰트)
        /**
         * 폰트 패밀리 설정
         * 폰트 적용 우선순위:
         * 1. Pretendard (메인 폰트)
         * 2. -apple-system (iOS/macOS 시스템 폰트)
         * 3. Apple SD Gothic Neo (애플 기기의 한글 시스템 폰트)
         * 4. Roboto (안드로이드 시스템 폰트)
         * 5. Noto Sans KR (웹 최적화된 한글 폰트)
         * 6. sans-serif (기본 폰트)
         */
        pretendard: [
          "Pretendard",
          "-apple-system",
          "Apple SD Gothic Neo",
          "Roboto",
          "Noto Sans KR",
          "sans-serif",
        ],
      },

      /**
       * 텍스트 스타일 시스템
       * - Pretendard 폰트 사용
       * - 모든 텍스트는 letter-spacing과 line-height가 정의되어 있음
       */
      fontSize: {
        jobListPrice: [
          "22px",
          {
            lineHeight: "150%",
            fontWeight: "700",
            letterSpacing: "-0.55px",
          },
        ],
        /**
         * [페이지 타이틀용 텍스트]
         * 사용처: 회원가입, 로그인, 마이페이지 등의 페이지 상단 타이틀
         * 스타일:
         * - font-size: 20px
         * - font-weight: 700 (Bold)
         * - line-height: 150% (30px)
         * - letter-spacing: -0.5px
         */
        title: [
          "20px",
          {
            lineHeight: "150%",
            fontWeight: "700",
            letterSpacing: "-0.5px",
          },
        ],

        /**
         * [섹션 타이틀용 텍스트]
         * 사용처: 마이페이지 게시글 리스트의 타이틀
         * 스타일:
         * - font-size: 18px
         * - font-weight: 600 (Semi Bold)
         * - line-height: 150% (27px)
         * - letter-spacing: -0.45px
         * - 기본 컬러: #35351E (text-text-primary)
         */
        section: [
          "18px",
          {
            lineHeight: "150%",
            fontWeight: "600",
            letterSpacing: "-0.45px",
          },
        ],

        /**
         * [기본 텍스트 - Regular]
         * 사용처:
         * - 인풋 필드 입력 텍스트
         * - 마이페이지 레벨 라벨
         * 스타일:
         * - font-size: 16px
         * - font-weight: 500
         * - line-height: 150% (24px)
         * - letter-spacing: -0.4px
         */
        base: [
          "16px",
          {
            lineHeight: "150%",
            fontWeight: "500",
            letterSpacing: "-0.4px",
          },
        ],

        /**
         * [기본 텍스트 - Semi Bold]
         * 사용처:
         * - 마이페이지 레벨 등급
         * - 마이페이지 게시글 리스트 가격
         * 스타일:
         * - font-size: 16px
         * - font-weight: 600
         * - line-height: 150% (24px)
         * - letter-spacing: -0.4px
         */
        "base-semibold": [
          "16px",
          {
            lineHeight: "150%",
            fontWeight: "600",
            letterSpacing: "-0.4px",
          },
        ],

        /**
         * [기본 텍스트 - Bold]
         * 사용처:
         * - 탭 메뉴 활성화 상태
         * 스타일:
         * - font-size: 16px
         * - font-weight: 700
         * - line-height: 150% (24px)
         * - letter-spacing: -0.4px
         */
        "base-bold": [
          "16px",
          {
            lineHeight: "150%",
            fontWeight: "700",
            letterSpacing: "-0.4px",
          },
        ],

        /**
         * [보조 텍스트 - Regular]
         * 사용처:
         * - 마이페이지 게시글 리스트의 지역구, 시간
         * - 게시글 리스트의 닉네임, 좋아요 숫자
         * - 인풋 필드 유효성 안내 문구
         * 스타일:
         * - font-size: 14px
         * - font-weight: 500
         * - line-height: 150% (21px)
         * - letter-spacing: -0.35px
         */
        sm: [
          "14px",
          {
            lineHeight: "150%",
            fontWeight: "500",
            letterSpacing: "-0.35px",
          },
        ],

        /**
         * [보조 텍스트 - Bold]
         * 사용처:
         * - 회원가입/로그인/정보수정 페이지의 인풋 라벨
         * - 모달 타이틀
         * 스타일:
         * - font-size: 14px
         * - font-weight: 700
         * - line-height: 150% (21px)
         * - letter-spacing: -0.35px
         */
        "sm-bold": [
          "14px",
          {
            lineHeight: "150%",
            fontWeight: "700",
            letterSpacing: "-0.35px",
          },
        ],
      },
    },
  },
  plugins: [],
};

export default config;
