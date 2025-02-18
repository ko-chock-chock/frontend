/**
 * TopNavBar 컴포넌트
 * 
 * 주요 기능:
 * 1. 페이지 상단 네비게이션 바 렌더링 (Fixed 포지션)
 * 2. 뒤로가기 버튼 및 페이지 타이틀 표시
 * 3. 페이지 타입에 따른 조건부 UI 렌더링 (onlyBack, onlyTitle, default)
 * 4. 수정 페이지에서 상세 페이지로 왔을 때 백버튼 경로 최적화 (/mypage로 이동)
 * 5. 채팅방 타이틀 특수 처리 (사용자 이름 강조 표시)
 */

// src/commons/navigation/TopNavBar.tsx
"use client";

import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { NavType, navigationHistory } from "./NavWrapper";

interface TopNavBarProps {
  title?: string;   // 페이지 제목
  type: NavType;    // 네비게이션 바 타입 (onlyBack, onlyTitle, default)
}

const TopNavBar = ({ title = "", type }: TopNavBarProps) => {
  const router = useRouter();
  const pathname = usePathname();

  /**
   * 타이틀 렌더링 함수
   * - 일반 페이지: 기본 타이틀 표시
   * - 채팅방: 특별한 스타일링 적용 ("님과의 채팅" 형식인 경우 이름 부분 강조)
   * @returns {React.ReactNode} 렌더링할 타이틀 요소
   */
  const renderTitle = () => {
    // 채팅방 타이틀 패턴 확인 ("...님과의 채팅" 형식)
    const chatPattern = /^(.+)님과의 채팅$/;
    const match = title.match(chatPattern);

    // 채팅방 타이틀인 경우 특수 처리
    if (match) {
      // 상대방 이름만 추출
      const name = match[1];
      return (
        <div className="flex items-center">
          {/* text-title-lg 클래스로 스타일 적용 */}
          <span className="text-title-lg">{name}</span>
          {/* 아래는 대체 스타일링 옵션 (현재 주석 처리됨)
          <span className="text-primary font-medium">{name}</span>
          <span className="ml-1">님과의 채팅</span> */}
        </div>
      );
    }

    // 일반 타이틀은 그대로 반환
    return title;
  };

  /**
   * 뒤로가기 버튼 클릭 핸들러
   * 특수 케이스별 조건 처리:
   * 1. 게시물 작성 페이지: 목록으로 이동
   * 2. 수정 페이지에서 온 상세 페이지: 마이페이지로 이동
   * 3. 그 외: 브라우저 히스토리 기반 이전 페이지로 이동
   */
  const handleBack = () => {
    // 게시물 작성 페이지 특수 처리 - 목록으로 이동
    if (pathname === '/jobList/new') {
      router.push('/jobList');
      return;
    }
    
    // 수정 페이지에서 넘어온 상세 페이지 특수 처리 - 마이페이지로 이동
    // 경로 패턴 확인: 상세 페이지이면서 수정/지도 페이지가 아닌 경우
    const isDetailPage = pathname.includes('/jobList/') && !pathname.includes('/edit') && !pathname.includes('/map') || 
                          pathname.includes('/communityBoard/') && !pathname.includes('/edit');
    
    // 수정 페이지에서 넘어온 상세 페이지인 경우 마이페이지로 이동                     
    if (isDetailPage && navigationHistory.isFromEditPage) {
      console.log("[TopNavBar] 수정 페이지에서 온 상세 페이지, 마이페이지로 이동");
      router.push('/mypage');
      return;
    }
    
    // 기본 동작: 브라우저 히스토리 기반 뒤로가기
    router.back();
  };

  return (
    <header className="z-[1000] fixed top-0 left-0 w-screen h-12 bg-nav-bg">
      <div className="h-12 flex justify-between items-center">
        {/* 뒤로가기 버튼 영역 - onlyTitle 타입이 아닐 때만 표시 */}
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

        {/* 타이틀 영역 - onlyBack 타입이 아닐 때만 표시 */}
        {type !== 'onlyBack' && (
          <h1 
            className={`
              text-title-xl
              ${type === 'onlyTitle' ? 'absolute left-1/2 -translate-x-1/2' : ''}
              ${title.includes('님과의 채팅') ? 'flex items-center' : ''}
            `}
          >
            {renderTitle()}
          </h1>
        )}

        {/* 레이아웃 균형을 위한 더미 요소 (너비만 차지하고 보이지 않음) */}
        <div className="w-11" aria-hidden="true" />
      </div>
    </header>
  );
};

export default TopNavBar;