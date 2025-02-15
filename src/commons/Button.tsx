// components/common/Button.tsx
import { ButtonHTMLAttributes } from "react";

/**
 * Button 컴포넌트 Props 인터페이스
 * @property {string} design - 버튼 디자인 스타일 ('design1' | 'design2' | 'design3' | 'design4' | 'design5')
 * @property {string} width - 버튼 너비 ('full' | 'fit')
 *   - full: 부모 요소의 전체 너비를 차지
 *   - fit: 내용물에 맞게 너비 조절
 * @property {boolean} disabled - 버튼 비활성화 상태
 *   - true: secondary 색상으로 스타일 변경 및 클릭 불가
 *   - false: primary 색상으로 스타일 적용 및 클릭 가능
 * @property {boolean} active - design5 전용 활성화 상태 표시
 *   - true: primary 색상으로 스타일 변경 (탭 활성화 상태)
 *   - false: secondary 색상으로 스타일 변경 (탭 비활성화 상태)
 * @property {React.ReactNode} children - 버튼 내부 콘텐츠
 * @property {string} className - 추가 스타일 클래스 (optional)
 */
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  design?: "design1" | "design2" | "design3" | "design4" | "design5";
  width?: "full" | "fit";
  disabled?: boolean;
  active?: boolean;
  children: React.ReactNode;
}

/**
 * 공통 버튼 컴포넌트
 * @description
 * design1: 모달용 기본 버튼
 * - 높이: 56px (h-14)
 * - 여백: 20px 좌우, 16px 상하 (px-5 py-4)
 * - 폰트: 16px Bold (.text-base-bold) - global.css의 공통 텍스트 스타일 사용
 * - 모서리: 12px 라운드 (rounded-xl)
 * - 기본 스타일: primary 배경(#1B8D5A), 흰색 텍스트
 * - disabled 스타일: secondary 배경(#E9E8E3), secondary 텍스트(#35351E)
 * - 사용: 모달의 "확인", "취소" 버튼, 폼 제출 버튼
 *
 * design2: 아이콘 포함 bordered 버튼
 * - 높이: 40px (h-10)
 * - 여백: 12px 좌우, 8px 상하 (px-3 py-2)
 * - 폰트: 14px Bold (.text-sm-bold) - global.css의 공통 텍스트 스타일 사용
 * - 테두리: 1.5px solid primary (border-[0.094rem]) - px to rem 변환 적용
 * - 모서리: 8px 라운드 (rounded-lg)
 * - 색상: primary 컬러(#1B8D5A) 테두리와 텍스트
 * - 사용: 아이콘이 포함된 액션 버튼 (채팅방페이지에서 위치 확인, 후기 작성 등)
 *
 * design3: 둥근 모서리 그림자 버튼 (플로팅 버튼)
 * - 높이: 56px (h-14)
 * - 여백: 16px 좌우 (px-4)
 * - 폰트: 16px Bold (.text-base-bold) - global.css의 공통 텍스트 스타일 사용
 * - 모서리: 완전한 라운드 (rounded-full)
 * - 배경: primary 컬러(#1B8D5A), 흰색 텍스트
 * - 그림자: shadow-xl - 플로팅 효과를 위한 큰 그림자
 * - 사용: 플로팅 버튼, CTA(Call to Action) 버튼
 * - 특이사항: width prop이 적용되지 않음 (항상 내용물 크기에 맞춤)
 *
 * design4: 텍스트 온리 버튼 (링크 스타일)
 * - 높이: 44px (h-11)
 * - 폰트: 14px Bold (.text-sm-bold) - global.css의 공통 텍스트 스타일 사용
 * - 스타일: underline과 함께 muted 컬러(#8D8974) 사용
 * - 정렬: 가운데 정렬
 * - 사용: 회원탈퇴, 정보수정 링크 등 부가 액션
 * - 특징: 최소한의 스타일링으로 텍스트 링크처럼 보이도록 함
 *
 * design5: 탭 그룹 버튼 (세그먼트 컨트롤)
 * - 높이: 34px (h-8.5)
 * - 너비: 90px (w-[5.625rem])
 * - 여백: 12px 좌우 (px-3)
 * - 폰트: 14px Bold (.text-sm-bold) - global.css의 공통 텍스트 스타일 사용
 * - 모서리: 완전한 라운드 (rounded-full)
 * - active 상태: primary 배경(#1B8D5A), 흰색 텍스트
 * - 비활성 상태: secondary 배경(#E9E8E3), secondary 텍스트(#35351E)
 * - 사용: 탭 그룹 버튼 ("게시중", "게시완료", "내 커뮤니티", "받은 후기")
 * - 특징: 고정된 너비로 탭 그룹에서 일관된 모양 유지
 */
export default function Button({
  design = "design1",
  width = "full",
  disabled = false,
  active = false,
  children,
  className = "",
  ...props
}: ButtonProps) {
  const designStyles = {
    design1: `
     flex justify-center items-center
     h-12 py-4
     text-base-bold
     rounded-xl
     ${
       disabled
         ? "bg-button-bg-secondary text-button-text-secondary cursor-not-allowed"
         : "bg-button-bg-primary text-button-text-primary"
     }
   `,

    design2: `
     flex justify-center items-center
     h-10 px-3 py-2 gap-1
     text-sm-bold
     text-button-text-tertiary
     rounded-lg border-[0.094rem] border-primary
   `,

    design3: `
     flex justify-center items-center
     h-14 px-4 gap-1
     text-base-bold
     rounded-full
     bg-button-bg-primary text-button-text-primary
     shadow-xl
   `,

    design4: `
     flex justify-center items-center
     h-11
     text-sm-bold
     text-button-text-muted underline
   `,

    design5: `
   flex justify-center items-center
   h-[2.125rem] w-[5rem]
   gap-1
   text-sm  
   rounded-full
   ${
     active
       ? "bg-button-bg-primary text-white"
       : "bg-button-bg-secondary text-button-text-secondary"
   }
   `,
  };

  // 너비 스타일 정의
  const widthStyles = {
    full: "w-full", // 부모 요소의 전체 너비
    fit: "w-fit", // 내용물에 맞는 너비
  };

  return (
    <button
      className={`
      ${designStyles[design]}
      ${width !== "fit" && design !== "design3" ? widthStyles[width] : ""}
      ${className}
    `
        .replace(/\s+/g, " ") // 여러 개의 공백을 하나로 통일
        .trim()} // 앞뒤 공백 제거
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
