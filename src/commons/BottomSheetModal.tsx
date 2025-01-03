"use client";

import { useState, useEffect } from "react";

interface BottomSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
  onDelete?: () => void;
  onEdit?: () => void;
  statusText: string;
  hasBgClick?: boolean;
  postId?: string;  // postId prop 추가
}

export default function BottomSheetModal({
  isOpen,
  onClose,
  onComplete,
  onDelete,
  onEdit,
  statusText,
  hasBgClick = true,
}: BottomSheetModalProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      document.body.style.overflow = "unset";
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = "unset";
      };
    }
  }, [isOpen]);

  

  if (!isVisible) return null;

  return (
    <>
      {/* 배경 클릭을 막기 위한 오버레이 */}
      <div
        className="fixed inset-0 bg-black/25 z-[999]"
        onClick={(e) => {
          e.stopPropagation(); // 이벤트 버블링 방지
          if (hasBgClick) {
            onClose(); // 모달 닫기
          }
        }}
        style={{ pointerEvents: "all" }}
      />

      {/* 모달 컨텐츠 */}
      <div className="fixed inset-x-0 bottom-0 z-[1000] flex justify-center">
        <div
          className={`w-full max-w-[375px] transition-transform duration-300 ease-out bg-white rounded-t-[28px]
          ${isOpen ? "translate-y-0" : "translate-y-full"}`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* 드래그 핸들 */}
          <div className="h-9 px-2.5 py-4 flex justify-center">
            <div className="w-14 h-1 bg-list-line rounded-[100px]" />
          </div>

          {/* 메뉴 아이템들 */}
          <div className="flex flex-col px-5 pb-5">
            <button
              className="py-3 w-full text-center text-text-primary text-base font-semibold active:bg-list-line rounded-lg"
              onClick={() => {
                onComplete?.();
                onClose();
              }}
            >
              {statusText}
            </button>

            <button
              className="py-3 w-full text-center text-text-primary text-base font-semibold active:bg-list-line rounded-lg"
              onClick={() => {
                onEdit?.();
                onClose();
              }}
            >
              게시글 수정
            </button>

            <button
              className="py-3 w-full text-center text-error text-base font-semibold active:bg-list-line rounded-lg"
              onClick={() => {
                onDelete?.();
                onClose();
              }}
            >
              삭제
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
