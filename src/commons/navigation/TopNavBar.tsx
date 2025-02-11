// src/commons/navigation/TopNavBar.tsx
/**
* 상단 네비게이션 바 컴포넌트
* 
* 주요 기능:
* 1. 2가지 타입의 네비게이션 바 지원
*    
*    - onlyBack: 뒤로가기 버튼만 표시
*    - onlyTitle: 타이틀만 표시
* 
* 2. 뒤로가기 동작 분기 처리
*    - 게시물 작성 페이지(/jobList/new)에서는 목록(/jobList)으로 이동
*    - 다른 페이지에서는 일반적인 브라우저 뒤로가기
*/

"use client";

import { useRouter, usePathname } from "next/navigation";
// usePathname hook 추가 이유:
// 1. 현재 페이지의 경로를 확인하여 뒤로가기 동작을 분기 처리하기 위함
// 2. 특정 페이지(예: /jobList/new)에서는 router.back() 대신 
//    router.push('/jobList')로 직접 이동해야 하므로 현재 경로 정보가 필요

import Image from "next/image";
import { NavType } from "./NavWrapper";

interface TopNavBarProps {
 title?: string;  // 페이지 제목 (optional)
 type: NavType;   // 네비게이션 바 타입
}

const TopNavBar = ({ title, type }: TopNavBarProps) => {
  // console.log('TopNavBar props:', { title, type }); // 디버깅용 로그 추가
 const router = useRouter();
 const pathname = usePathname(); // 현재 페이지 경로

 /**
  * 뒤로가기 버튼 클릭 핸들러
  * 페이지별 다른 동작 처리:
  * - /jobList/new : 게시물 목록으로 직접 이동
  * - 그 외 페이지: 브라우저 히스토리 기반 뒤로가기
  */
 const handleBack = () => {
   if (pathname === '/jobList/new') {
     router.push('/jobList'); // 게시물 목록으로 직접 이동
   } else {
     router.back(); // 일반적인 뒤로가기
   }
 };

 return (
   <header className="z-[1000] fixed top-0 left-0 w-screen h-12 bg-nav-bg">
     <div className="h-12 flex justify-between items-center">
       {/* 
       뒤로가기 버튼 영역
       - onlyTitle 타입이 아닐 때만 표시
       - 클릭 시 handleBack 함수로 페이지 이동 처리
       */}
       {type !== 'onlyTitle' && (
         <button
           onClick={handleBack}
           className="w-11 h-11 flex items-center justify-center"
         >
           <Image
             src="/icons/Back_icon_24px.svg"
             width={24}
             height={24}
             alt="뒤로가기"
           />
         </button>
       )}

       {/* 
       타이틀 영역
       - onlyBack 타입이 아닐 때만 표시
       - onlyTitle 타입일 때는 중앙 정렬  추가 클래스 없애서 중앙정렬되게함
       - 그 외에는 절대 위치로 중앙 정렬
       */}
       {type !== 'onlyBack' && (
         <h1 
           className={`
             text-title-xl 
             ${type === 'onlyTitle' && 'absolute left-1/2 -translate-x-1/2'}

           `} // 절대 위치 중앙 정렬
         >
           {title}
         </h1>
       )}

       {/* 
       레이아웃 균형을 위한 더미 요소
       - 실제 컨텐츠는 없지만 좌우 균형을 맞추기 위한 공간 차지
       */}
       <div className="w-11" aria-hidden="true" />
     </div>
   </header>
 );
};

export default TopNavBar;

/**
* 사용 예시:
* 
* 1. 기본 스타일 (뒤로가기 + 타이틀)
* <TopNavBar type="default" title="페이지 제목" />
* 
* 2. 뒤로가기만 있는 스타일
* <TopNavBar type="onlyBack" />
* 
* 3. 타이틀만 있는 스타일
* <TopNavBar type="onlyTitle" title="페이지 제목" />
* 
* 주의사항:
* 1. type props는 필수값
* 2. onlyBack 타입에서는 title이 무시됨
* 3. onlyTitle 타입에서는 title이 반드시 필요
*/