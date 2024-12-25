// components/common/Button.tsx
import { ButtonHTMLAttributes } from "react";

/**
 * Button 컴포넌트 Props 인터페이스
 * @property {string} design - 버튼 디자인 스타일 ('design1' | 'design2' | 'design3' | 'design4')
 * @property {string} width - 버튼 너비 ('full' | 'fit')
 * @property {React.ReactNode} children - 버튼 내부 콘텐츠
 * @property {string} className - 추가 스타일 클래스 (optional)
 */
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  design?: "design1" | "design2" | "design3" | "design4" | "design5";
  width?: "full" | "fit";
  children: React.ReactNode;
}

/**
 * 공통 버튼 컴포넌트
 * @description
 * design1: 모달용 기본 버튼
 * - 높이: 48px 고정 (h-12)
 * - 여백: 24px 좌우, 12px 상하 (px-6 py-3)
 * - 폰트: 16px Bold(700)
 * - 모서리: 12px 라운드 (rounded-xl)
 * - 기본 스타일: primary 배경색(#1B8D5A), 흰색 텍스트
 * - 취소버튼 스타일: #E9E8E3 배경색, primary 텍스트
 * - 사용: 모달의 "확인", "취소" 버튼, 폼 제출 버튼
 *
 * design2: 아이콘 포함 bordered 버튼
 * - 높이: 40px 고정 (h-10)
 * - 여백: 12px 좌우, 8px 상하 (px-3 py-2)
 * - 폰트: 14px Semi-bold(600)
 * - 폰트 컬러: #1B8D5A
 * - line-height: 150% (21px)
 * - letter-spacing: -0.35px
 * - 테두리: 1.5px solid primary 컬러
 * - 모서리: 8px 라운드
 * - 아이콘 간격: 4px (gap-1)
 * - 사용: 아이콘이 포함된 액션 버튼 (좋아요, 공유하기, 채팅방 이동 등)
 *
 * design3: 둥근 모서리 그림자 버튼
 * - 높이: 56px 고정 (h-14)
 * - 너비: 102px 고정 (w-[102px])
 * - 여백: 16px 좌우 (px-4)
 * - 폰트: 16px Bold(700)
 * - 모서리: 48px 라운드 (rounded-[48px])
 * - 배경: primary 컬러(#1B8D5A), 흰색 텍스트
 * - 그림자: 0px 4px 25px rgba(0, 0, 0, 0.25)
 * - 아이콘 간격: 4px (gap-1)
 * - 사용: 플로팅 버튼, CTA 버튼
 *
 * design4: 텍스트 온리 버튼
 * - 폰트: 13px Semi-bold(600)
 * - 폰트 컬러: #8D8974
 * - line-height: 150% (19.5px)
 * - letter-spacing: -0.325px
 * - 스타일: 밑줄
 * - 정렬: 가운데
 * - 사용: 회원탈퇴, 정보수정 링크 등 부가 액션
 *
 * * design5: 작은 둥근 버튼
 * - 높이: 34px 고정
 * - 여백: 16px 좌우
 * - 폰트: 14px Bold(700), 흰색(#FFF)
 * - line-height: 150% (21px)
 * - letter-spacing: -0.35px
 * - 모서리: 48px 라운드
 * - 배경: primary 컬러(#1B8D5A)
 * - 아이콘 간격: 4px
 * - 사용: 채팅시 승인버튼
 */
export default function Button({
  design = "design1",
  width = "full",
  children,
  className = "",
  ...props
}: ButtonProps) {
  const designStyles = {
    design1: `
      flex justify-center items-center
      h-12 px-6 py-3
      text-button-lg font-bold
      rounded-xl
      bg-primary text-white
    `,

    design2: `
      flex justify-center items-center
      h-10 px-3 py-2 gap-1
      text-primary text-sm font-semibold    
      leading-[150%] tracking-[-0.35px]    
      rounded-lg border-[1.5px] border-primary
    `,

    design3: `
      flex justify-center items-center
      h-14 w-[102px] px-4 gap-1
      text-button-lg font-bold
      rounded-[48px]
      bg-primary text-white
      shadow-[0px_4px_25px_0px_rgba(0,0,0,0.25)]
    `,

    design4: `
      text-center
      text-[13px] font-semibold leading-[150%] tracking-[-0.325px]
      text-text-quinary underline
    `,
    design5: `
    flex justify-center items-center
    h-[34px] px-4 gap-1
    text-sm font-bold text-white     // text-white 추가 (#FFF)
    leading-[150%] tracking-[-0.35px]
    rounded-[48px]
    bg-primary
  `,
  };

  const widthStyles = {
    full: "w-full",
    fit: "w-fit",
  };

  return (
    <button
      className={`
        ${designStyles[design]}
        ${width !== "fit" && design !== "design3" ? widthStyles[width] : ""}
        ${className}
      `
        .replace(/\s+/g, " ")
        .trim()}
      {...props}
    >
      {children}
    </button>
  );
}
