// /src/components/common/Modal.tsx
"use client";

import { useEffect } from "react";
import Button from "./Button";

/**
 * Modal 컴포넌트 Props 인터페이스
 * @property {boolean} isOpen - 모달 표시 여부
 * @property {Function} onClose - 모달 닫기 핸들러 (optional)
 * @property {Function} onConfirm - 확인 버튼 클릭 핸들러
 * @property {string} title - 모달 제목 (optional)
 * @property {string} description - 모달 설명 텍스트 (optional)
 * @property {string} cancelText - 취소 버튼 텍스트 (optional, 기본값: "취소")
 * @property {string} confirmText - 확인 버튼 텍스트 (필수)
 * @property {boolean} hasCancel - 취소 버튼 표시 여부 (optional, 기본값: true)
 * @property {boolean} hasBgClick - 배경 클릭시 닫기 가능 여부 (optional, 기본값: true)
 * @property {React.ReactNode} children - 모달 내부 커스텀 콘텐츠 (optional)
 */
interface ModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  cancelText?: string;
  confirmText: string;
  hasCancel?: boolean;
  hasBgClick?: boolean;
  children?: React.ReactNode;
}

/**
 * 공통 모달 컴포넌트
 * @description
 * 스타일 가이드:
 * - 모달 오버레이: black@25%
 * - 모달 내부 배경: white
 * - 모달 기본 너비: 20.938rem (335px)
 * - 최소 높이: 12rem (192px) (제목 있을 때) / 10.5rem (168px) (제목 없을 때)
 * - 그림자: 0.25rem blur(4px), 1rem spread(16px), black@25%
 *
 * 텍스트 스타일:
 * - 제목: text-sm-medium 클래스 사용 (14px Medium, #A3A08F) - global.css
 * - 설명: text-title-lg 클래스 사용 (18px Medium, #2E2E2C) - global.css
 *
 * 버튼 스타일 (design1 전용):
 * - 높이: 3rem (48px) 고정 (h-12)
 * - 폰트: 1rem (16px) Bold
 * - 취소 버튼: bg-button-bg-secondary (#E9E8E3), text-button-text-secondary (#35351E)
 * - 확인 버튼: bg-button-bg-primary (#1B8D5A), text-button-text-primary (#FFFFFF)
 */
export default function Modal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  cancelText = "취소",
  confirmText = "확인",
  hasCancel = true,
  hasBgClick = true,
  children,
}: ModalProps) {
  // 모달 open 시 배경 스크롤 방지
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "unset";
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // 배경 클릭 핸들러
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (hasBgClick && onClose && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/25 flex items-center justify-center z-50"
      onClick={handleOverlayClick}
    >
      <div
        className={`
          w-[20.938rem] p-5 bg-white rounded-lg  /* 20.938rem = 335px */
          shadow-[0_0.25rem_1rem_0_rgba(0,0,0,0.25)]  /* 0.25rem = 4px, 1rem = 16px */
          flex flex-col items-center
          ${
            title ? "min-h-[12rem]" : "min-h-[10.5rem]"
          }  /* 12rem = 192px, 10.5rem = 168px */
          gap-7
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 모달 제목 */}
        {title && (
          <h2 className="text-sm-medium">
            {" "}
            {/* 14px Medium - global.css의 text-sm-medium 클래스 사용 (#A3A08F) */}
            {title}
          </h2>
        )}

        {/* 모달 콘텐츠 */}
        {description ? (
          <p
            className="text-center text-title-lg"
            style={{ whiteSpace: "pre-line" }} // 줄바꿈 적용
          > 
          {/* /* 모달 사용할 떄 줄바꿈 사용 예시 : description={`회원가입이 완료되었습니다. \n 로그인 페이지로 이동합니다.`} */ }
            {/* 18px Medium - global.css의 text-title-lg 클래스 사용 (#2E2E2C) */}
            {description}
          </p>
        ) : (
          children
        )}

        {/* 버튼 영역 - design1 전용
         * - hasCancel이 true일 때 버튼 2개 (취소, 확인)
         * - hasCancel이 false일 때 버튼 1개 (확인)
         * - 버튼 사이 간격: 0.625rem (10px) (gap-2.5)
         * - 높이: 3rem (48px) 고정 (h-12)
         */}
        <div className={`w-full mt-auto ${hasCancel ? "flex gap-2.5" : ""}`}>
          {" "}
          {/* gap-2.5 = 10px */}
          {hasCancel && onClose && (
            <div className="w-full">
              <Button
                design="design1"
                width="full"
                className="!bg-button-bg-secondary !text-button-text-secondary" /* #E9E8E3 배경, #35351E 텍스트 */
                onClick={onClose}
              >
                {cancelText}
              </Button>
            </div>
          )}
          <div className={hasCancel ? "w-full" : ""}>
            <Button design="design1" width="full" onClick={onConfirm}>
              {confirmText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
