// src/commons/navigation/NavWrapper.tsx
"use client";

/**
 * NavigationWrapper 컴포넌트
 * 애플리케이션의 전체 네비게이션 및 레이아웃을 관리
 * 
 * 주요 기능:
 * 1. 페이지별 네비게이션 표시 여부 관리
 * 2. 인증이 필요한 페이지 보호
 * 3. 동적 페이지 타이틀 관리
 * 4. 레이아웃 구조 제공
 * 
 * 수정사항 (2024.02.04):
 * - 인증 로직 최적화
 * - 라우팅 보안 강화
 * - 메모리 누수 방지
 */

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useUserStore } from "../../commons/store/userStore";
import { AuthGuard } from "@/components/auth/components/AuthGuard";
import TopNavBar from "@/commons/navigation/TopNavBar";
import BottomNavBar from "@/commons/navigation/BottomNavBar";
import { TokenStorage } from "@/components/auth/utils/tokenUtils";

// 네비게이션 타입 정의
export type NavType = "onlyBack" | "onlyTitle";

// 네비게이션 설정 인터페이스
interface NavigationConfig {
  navType: Partial<Record<string, NavType>>;
  hideTopNav: string[];
  hideBottomNav: string[];
  defaultTitles: Record<string, string>;
  publicPages: string[];
  requiresAuth: string[];
}

/**
 * 동적 라우트 패턴 매칭
 * 예: /jobList/123 -> /jobList/[boardId]
 */
const matchDynamicRoute = (pathname: string): string => {
  const patterns = [
    { regex: /^\/jobList\/\d+$/, replacement: '/jobList/[boardId]' },
    { regex: /^\/chatList\/\d+$/, replacement: '/chatList/[chatId]' },
    { regex: /^\/communityBoard\/\d+$/, replacement: '/communityBoard/[boardId]' }
  ];

  for (const { regex, replacement } of patterns) {
    if (regex.test(pathname)) {
      return replacement;
    }
  }

  return pathname;
};

/**
 * 게시글 정보 조회
 */
const fetchBoardData = async (boardId: string) => {
  try {
    const token = TokenStorage.getAccessToken();
    if (!token) {
      console.log('[NavWrapper] 토큰 없음, 게시글 조회 불가');
      return null;
    }

    const response = await fetch(`http://13.209.11.201:8001/api/trade/${boardId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('게시글 조회 실패');
    }

    return await response.json();
  } catch (error) {
    console.error('[NavWrapper] 게시글 조회 실패:', error);
    return null;
  }
};

// 네비게이션 설정
const navigationConfig: NavigationConfig = {
  // 페이지별 네비게이션 타입
  navType: {
    "/jobList/[boardId]": "onlyBack",
    "/chatList/[chatId]": "onlyBack",
    "/jobList": "onlyTitle",
    "/chatList": "onlyTitle",
    "/": "onlyTitle",
    "/bookMark": "onlyTitle",
    "/mypage": "onlyTitle",
  },

  // 인증이 필요한 페이지 목록
  requiresAuth: [
    "/mypage",
    "/bookMark",
    "/jobList/new",
    "/jobList/[boardId]/edit",
    "/chatList",
    "/chatList/[chatId]"
  ],

  // 인증이 필요하지 않은 페이지 목록
  publicPages: [
    "/login",
    "/signup",
    "/",
    "/jobList",
    "/communityBoard"
  ],

  // 상단 네비게이션 숨김 페이지
  hideTopNav: ["/login", "/signup"],

  // 하단 네비게이션 숨김 페이지
  hideBottomNav: [
    "/login",
    "/signup",
    "/mypage/edit",
    "/jobList/[boardId]",
    "/chatList/[chatId]",
    "/map",
    "/chatList/chatBoxMine"
  ],

  // 페이지별 기본 타이틀
  defaultTitles: {
    "/": "홈",
    "/signup": "회원가입",
    "/mypage": "마이페이지",
    "/chatList": "채팅목록",
    "/bookMark": "관심내역",
    "/jobList": "구인/중고 게시판",
    "/jobList/new": "게시물 작성",
    "/mypage/edit": "회원정보 수정",
    "/communityBoard": "커뮤니티"
  }
};

interface NavigationWrapperProps {
  children: React.ReactNode;
}

/**
 * NavigationWrapper 컴포넌트 구현
 */
export default function NavigationWrapper({ children }: NavigationWrapperProps) {
  const pathname = usePathname();
  const [pageTitle, setPageTitle] = useState<string>("");
  const currentUser = useUserStore((state) => state.user);

  // 페이지 타이틀 설정
  useEffect(() => {
    let isMounted = true;

    const setTitle = async () => {
      try {
        const matchedRoute = matchDynamicRoute(pathname);
        
        // 채팅방 타이틀 설정
        if (matchedRoute === '/chatList/[chatId]') {
          const boardId = pathname.split('/').pop();
          if (boardId) {
            const boardData = await fetchBoardData(boardId);
            if (boardData && isMounted) {
              const partnerName = boardData.writeUserName !== currentUser?.name 
                ? boardData.writeUserName 
                : "상대방";
              setPageTitle(partnerName);
              return;
            }
          }
        }

        // 일반 페이지 타이틀 설정
        if (isMounted) {
          setPageTitle(navigationConfig.defaultTitles[matchedRoute] || "");
        }
      } catch (error) {
        console.error('[NavWrapper] 타이틀 설정 중 에러:', error);
        if (isMounted) {
          setPageTitle(""); // 에러 시 빈 타이틀
        }
      }
    };

    setTitle();

    return () => {
      isMounted = false;
    };
  }, [pathname, currentUser?.name]);

  // 현재 경로에 대한 네비게이션 설정 확인
  const matchedRoute = matchDynamicRoute(pathname);
  const showTopNav = !navigationConfig.hideTopNav.includes(matchedRoute);
  const showBottomNav = !navigationConfig.hideBottomNav.includes(matchedRoute);
  
  // 인증 필요 여부 확인
  const requireAuth = navigationConfig.requiresAuth.includes(matchedRoute);
  const isPublicPage = navigationConfig.publicPages.includes(matchedRoute);

  // 인증이 필요한 페이지는 AuthGuard로 보호
  const wrappedContent = requireAuth ? (
    <AuthGuard 
      requireAuth={true}
      redirectTo="/login"
      loadingComponent={<div className="flex justify-center items-center h-screen">로딩중...</div>}
    >
      {children}
    </AuthGuard>
  ) : children;

  return (
    <div
      className={`min-h-screen ${showTopNav ? "pt-12" : ""} ${
        showBottomNav ? "pb-24" : ""
      }`}
    >
      {/* 상단 네비게이션 */}
      {showTopNav && (
        <TopNavBar
          title={pageTitle}
          type={navigationConfig.navType[matchedRoute] || "onlyBack"}
        />
      )}

      {/* 메인 콘텐츠 */}
      {wrappedContent}

      {/* 하단 네비게이션 */}
      {showBottomNav && <BottomNavBar />}
    </div>
  );
}