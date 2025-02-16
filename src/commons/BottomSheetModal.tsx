// src/commons/BottomSheetModal.tsx
"use client";

/**
 * 바텀시트 모달 컴포넌트
 *
 * ✨ 주요 기능:
 * 1. 애니메이션 처리
 *   - 부드러운 슬라이드 업/다운 효과
 *   - 페이드 인/아웃 배경 오버레이
 *
 * 2. 메뉴 타입별 스타일링
 *   - 기본(default): 기본 텍스트 색상
 *   - 위험(danger): 빨간색 강조
 *   - 취소(cancel): 회색 텍스트
 *
 * 3. 접근성 및 UX
 *   - 배경 클릭 시 닫기 옵션
 *   - 스크롤 방지 처리
 *   - 드래그 핸들 제공
 *
 * 4. 재사용성
 *   - 동적 메뉴 아이템 구성
 *   - 커스텀 이벤트 핸들링
 *   - 유연한 Props 인터페이스
 *
 * 🔄 수정사항 (2024.02.14):
 * 1. 타입 시스템 강화
 * 2. 애니메이션 성능 최적화
 * 3. 메뉴 아이템 타입 추가
 */

import { useState, useEffect } from "react";

/**
 * 바텀시트 메뉴 아이템 타입 정의
 * @property label - 메뉴 아이템 텍스트
 * @property onClick - 클릭 이벤트 핸들러
 * @property type - 메뉴 아이템 타입 (스타일링 용도)
 */
export interface BottomSheetMenuItem {
  label: string;
  onClick: () => void | Promise<void>;
  type?: "default" | "danger" | "cancel";
}

/**
 * 바텀시트 모달 Props 인터페이스
 * @property isOpen - 모달 표시 여부
 * @property onClose - 모달 닫기 핸들러
 * @property menuItems - 메뉴 아이템 배열
 * @property hasBgClick - 배경 클릭 시 닫기 허용 여부
 */
export interface BottomSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  menuItems: BottomSheetMenuItem[];
  hasBgClick?: boolean;
}

export default function BottomSheetModal({
  isOpen,
  onClose,
  menuItems,
  hasBgClick = true,
}: BottomSheetModalProps) {
  // 모달 표시 상태
  const [isVisible, setIsVisible] = useState(false);
  // 애니메이션 상태
  const [isAnimating, setIsAnimating] = useState(false);

  /**
   * 모달 상태 변경 시 사이드 이펙트 처리
   * 1. 모달 열기: visibility → animation 순으로 처리
   * 2. 모달 닫기: animation → visibility 순으로 처리
   */
  useEffect(() => {
    if (isOpen) {
      // 모달 열기
      setIsVisible(true);
      document.body.style.overflow = "hidden"; // 스크롤 방지
      // 애니메이션을 위한 지연
      requestAnimationFrame(() => setIsAnimating(true));
    } else {
      // 모달 닫기
      setIsAnimating(false);
      // 애니메이션 완료 후 visibility 변경
      const timer = setTimeout(() => {
        setIsVisible(false);
        document.body.style.overflow = "unset"; // 스크롤 복원
      }, 300); // 애니메이션 duration과 일치
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // 모달이 보이지 않을 때는 렌더링하지 않음
  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[999] transition-opacity duration-300 ${
        isAnimating ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* 배경 오버레이
       * - 반투명 검정 배경
       * - 클릭 시 모달 닫기 (hasBgClick이 true일 때)
       */}
      <div
        className="absolute inset-0 bg-black/25"
        onClick={(e) => {
          e.stopPropagation();
          if (hasBgClick) onClose();
        }}
      />

      {/* 모달 컨텐츠
       * - 하단에서 슬라이드 업 애니메이션
       * - 최대 너비 제한
       * - 상단 모서리 라운딩 처리
       */}
      <div
        className={`fixed inset-x-0 bottom-0 z-[1000] transform transition-transform duration-300 ease-out ${
          isAnimating ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="w-full max-w-full mx-auto bg-white rounded-t-[28px]">
          {/* 드래그 핸들
           * - 사용자 인터랙션 인디케이터
           * - 모달의 드래그 가능성 시각화
           */}
          <div className="h-9 px-2.5 py-4 flex justify-center">
            <div className="w-14 h-1 bg-list-line rounded-[100px]" />
          </div>

          {/* 메뉴 아이템 리스트
           * - 아이템 간 간격 및 패딩 처리
           * - 타입별 스타일 적용 (danger, cancel)
           */}
          <div className="flex flex-col px-5 pb-5">
            {menuItems.map((item, index) => (
              <button
                key={index}
                className={`py-3 w-full text-center text-base font-semibold rounded-lg active:bg-list-line ${
                  item.type === "danger"
                    ? "text-error" // 위험 액션 (빨간색)
                    : item.type === "cancel"
                    ? "text-text-tertiary" // 취소 액션 (회색)
                    : "text-text-primary" // 기본 액션 (검정색)
                }`}
                onClick={() => {
                  item.onClick();
                  // 취소 버튼이 아닌 경우 자동으로 모달 닫기
                  if (item.type !== "cancel") onClose();
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * 사용 예시:
 * ```tsx
 * // 프로필 이미지 관리 바텀시트
 * const ProfileImageBottomSheet = ({
 *   isOpen,
 *   onClose,
 *   onSelectImage,
 *   onDeleteImage,
 * }) => {
 *   const menuItems = [
 *     {
 *       label: "내 앨범에서 선택",
 *       onClick: onSelectImage,
 *     },
 *     {
 *       label: "프로필 이미지 삭제",
 *       onClick: onDeleteImage,
 *       type: "danger",
 *     },
 *     {
 *       label: "창 닫기",
 *       onClick: onClose,
 *       type: "cancel",
 *     },
 *   ];
 *
 *   return (
 *     <BottomSheetModal
 *       isOpen={isOpen}
 *       onClose={onClose}
 *       menuItems={menuItems}
 *     />
 *   );
 * };
 * ```
 */
