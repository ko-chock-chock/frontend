// /Users/su/Documents/practice/241225/src/components/common/Modal.tsx
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
* - 모달 기본 너비: 335px
* - 최소 높이: 192px (제목 있을 때) / 168px (제목 없을 때)
* - 그림자: 4px blur, 16px spread, black@25%
*
* 텍스트 스타일:
* - 제목: 14px Bold, #8D8974, -0.35px 자간, 150% 행간
* - 설명: 18px Medium, #35351E, -0.45px 자간, 150% 행간
* 
* 버튼 스타일 (design1 전용):
* - 높이: 48px 고정 (h-12)
* - 폰트: 16px Bold
* - 취소 버튼: #E9E8E3 배경색, text-primary 컬러
* - 확인 버튼: primary 배경색, 흰색 텍스트
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
         w-[335px] p-5 bg-white rounded-lg 
         shadow-[0px_4px_16px_0px_rgba(0,0,0,0.25)]
         flex flex-col items-center
         ${title ? "min-h-[192px]" : "min-h-[168px]"}
         gap-7
       `}
       onClick={(e) => e.stopPropagation()}
     >
       {/* 모달 제목 */}
       {title && (
         <h2 className="text-text-quinary text-sm-bold leading-[150%] tracking-[-0.35px]">
           {title}
         </h2>
       )}

       {/* 모달 콘텐츠 */}
       {description ? (
         <p className="text-center text-text-primary text-section font-medium leading-[150%] tracking-[-0.45px]">
           {description}
         </p>
       ) : (
         children
       )}

       {/* 버튼 영역 - design1 전용
        * - hasCancel이 true일 때 버튼 2개 (취소, 확인)
        * - hasCancel이 false일 때 버튼 1개 (확인)
        * - 버튼 사이 간격: 10px (gap-2.5)
        * - 높이: 48px 고정
        */}
       <div className={`w-full mt-auto ${hasCancel ? "flex gap-2.5" : ""}`}>
         {hasCancel && onClose && (
           <div className="w-full">
             <Button
               design="design1"
               width="full"
               className="!bg-[#E9E8E3] !text-text-primary"
               onClick={onClose}
             >
               {cancelText}
             </Button>
           </div>
         )}

         <div className={hasCancel ? "w-full" : ""}>
           <Button
             design="design1"
             width="full"
             onClick={onConfirm}
           >
             {confirmText}
           </Button>
         </div>
       </div>
     </div>
   </div>
 );
}