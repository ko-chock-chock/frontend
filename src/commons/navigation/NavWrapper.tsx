// src/commons/navigation/NavWrapper.tsx
"use client";

/**
 * NavigationWrapper 컴포넌트
 * 
 * 주요 기능:
 * 1. 애플리케이션 전체 네비게이션 레이아웃의 통합 관리
 * 2. 페이지별 동적 인증 요구사항 처리
 * 3. 컨텍스트 기반 페이지 타이틀 동적 설정
 * 4. 조건부 네비게이션 바 렌더링
 * 5. 세분화된 페이지 접근 권한 제어
 * 6. 채팅방 사용자별 동적 타이틀 표시
 * 
 * 핵심 보안 메커니즘:
 * - 라우트 기반 인증 검증
 * - 동적 경로 표준화
 * - 사용자 컨텍스트 기반 접근 제어
 */

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useUserStore } from "../../commons/store/userStore";
import { AuthGuard } from "@/components/auth/components/AuthGuard";
import TopNavBar from "@/commons/navigation/TopNavBar";
import BottomNavBar from "@/commons/navigation/BottomNavBar";
import { TokenStorage } from "@/components/auth/utils/tokenUtils";

// 네비게이션 타입 정의 (페이지 네비게이션 스타일)
export type NavType = "onlyBack" | "onlyTitle" | "default";

// 네비게이션 설정을 위한 인터페이스 정의
interface NavigationConfig {
  navType: Partial<Record<string, NavType>>;
  hideTopNav: string[];
  hideBottomNav: string[];
  defaultTitles: Record<string, string>;
  publicPages: string[];
  requiresAuth: string[];
}

/**
 * 동적 라우트 패턴 매칭 함수
 * 
 * @description URL 패턴을 표준화된 라우트로 변환
 * 복잡한 동적 세그먼트를 일관된 형식으로 정규화
 * 
 * @param pathname 현재 URL 경로
 * @returns 표준화된 라우트 경로
 */
const matchDynamicRoute = (pathname: string): string => {
  const patterns = [
    { regex: /^\/jobList\/\d+$/, replacement: "/jobList/[boardId]" },
    { regex: /^\/communityBoard\/\d+$/, replacement: "/communityBoard/[boardId]" },
    { regex: /^\/jobList\/\d+\/edit$/, replacement: "/jobList/[boardId]/edit" },
    { regex: /^\/communityBoard\/\d+\/edit$/, replacement: "/communityBoard/[boardId]/edit" },
    { regex: /^\/chatList$/, replacement: "/chatList" },
    { regex: /^\/chatList\/chatRoom$/, replacement: "/chatList/chatRoom" },
    { regex: /^\/chatList\/chatBoxMine$/, replacement: "/chatList/chatBoxMine" },
  ];

  for (const { regex, replacement } of patterns) {
    if (regex.test(pathname)) {
      return replacement;
    }
  }

  return pathname;
};

// 네비게이션 전역 설정
const navigationConfig: NavigationConfig = {
  navType: {
    "/jobList/[boardId]": "onlyBack",
    "/chatList/[chatId]": "onlyBack",
    "/communityBoard/[boardId]": "onlyBack",
    "/jobList": "onlyTitle",
    "/chatList": "onlyTitle",
    "/communityBoard": "onlyTitle",
    "/": "onlyTitle",
    "/bookmark": "onlyTitle",
    "/mypage": "onlyTitle",
    "/jobList/[boardId]/edit": "onlyBack",
    "/communityBoard/[boardId]/edit": "onlyBack",
    "/chatList/chatRoom": "onlyBack", // 채팅방 네비게이션 타입
  },

  // 인증 필수 페이지 경로 설정
  requiresAuth: [
    "/mypage",
    "/bookmark",
    "/jobList/new",
    "/jobList/[boardId]/edit",
    "/communityBoard",
    "/jobList",
    "/communityBoard/[boardId]/edit",
    "/chatList", // 채팅 목록 
    "/chatList/chatRoom", // 채팅방
    "/chatList/chatBoxMine", // 개인 채팅방
  ],

  publicPages: ["/login", "/signup", "/"],

  hideTopNav: ["/login"],

  hideBottomNav: [
    "/login",
    "/signup",
    "/mypage/edit",
    "/jobList/[boardId]",
    "/jobList/new",
    "/chatList/[chatId]",
    "/communityBoard/[boardId]",
    "/map",
    "/chatList/chatBoxMine",
    "/jobList/[boardId]/edit",
    "/communityBoard/[boardId]/edit",
    "/chatList/chatRoom", // 채팅방 하단 네비게이션 숨김
  ],

  defaultTitles: {
    "/": "홈",
    "/signup": "회원가입",
    "/mypage": "마이페이지",
    "/chatList": "채팅목록",
    "/bookmark": "관심내역",
    "/jobList": "구인/중고 게시판",
    "/jobList/new": "게시물 작성",
    "/mypage/edit": "회원정보 수정",
    "/communityBoard": "커뮤니티",
    "/jobList/[boardId]/edit": "게시물 수정",
    "/communityBoard/[boardId]/edit": "커뮤니티 게시물 수정",
    "/chatList/chatBoxMine": "나의 채팅목록",
  },
};

interface NavigationWrapperProps {
  children: React.ReactNode;
}


/**
 * 게시글 수정 페이지 정보 추출 함수
 * 
 * @description URL에서 게시글 ID와 타입 추출
 * @param pathname 현재 URL 경로
 * @returns 게시글 ID와 타입 정보
 */
const extractBoardInfoFromEditPage = (pathname: string) => {
  const pathParts = pathname.split("/");
  const boardId = pathParts[2];
  const type = pathname.includes("jobList") ? "trade" : "community";
  return { boardId, type };
};

/**
 * 채팅방 정보 추출 함수
 * 
 * @description 채팅방 관련 권한 및 리소스 정보 추출
 * @param pathname 현재 URL 경로
 * @returns 채팅방 권한 체크를 위한 리소스 정보
 */
const extractChatRoomInfo = (pathname: string) => {
  // 만약 pathname을 기반으로 추가 정보를 추출하고 싶다면 여기에 로직 추가 가능
  return { 
    type: 'chat' as const,
    path: pathname  // pathname 정보 포함
  };
};

/**
 * NavigationWrapper 컴포넌트
 * 
 * @description 애플리케이션의 전체 레이아웃과 네비게이션을 관리하는 최상위 컴포넌트
 */
export default function NavigationWrapper({
  children,
}: NavigationWrapperProps) {
  const pathname = usePathname();
  const [pageTitle, setPageTitle] = useState<string>("");
  const currentUser = useUserStore((state) => state.user);

  // 페이지 타이틀 동적 설정 로직
  useEffect(() => {
    let isMounted = true;

    const setTitle = async () => {
      try {
        const matchedRoute = matchDynamicRoute(pathname);

        // 채팅방 타이틀 특별 처리
        if (matchedRoute === "/chatList/chatRoom") {
          // 토큰 가져오기
          const token = TokenStorage.getAccessToken();
          if (!token) {
            console.log("[NavWrapper] 토큰 없음");
            return;
          }

          try {
            // 채팅방 정보 조회 API 호출
            const response = await fetch(`/api/trade/my-chat-rooms`, {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            });

            if (!response.ok) {
              throw new Error("채팅방 정보 조회 실패");
            }

            const chatRoomData = await response.json();
            if (chatRoomData && isMounted) {
              // 현재 사용자가 작성자인 경우 requestUserName을, 
              // 그렇지 않은 경우 writeUserName을 표시
              const partnerName = 
                chatRoomData.writeUserId === currentUser?.id
                  ? chatRoomData.requestUserName
                  : chatRoomData.writeUserName;
              
              setPageTitle(`${partnerName}님과의 대화`);
              return;
            }
          } catch (error) {
            console.error("[NavWrapper] 채팅방 정보 조회 실패:", error);
          }
        }

        // 일반 페이지 타이틀 설정
        if (isMounted) {
          setPageTitle(navigationConfig.defaultTitles[matchedRoute] || "");
        }
      } catch (error) {
        console.error("[NavWrapper] 타이틀 설정 중 에러:", error);
        if (isMounted) {
          setPageTitle(""); // 에러 시 빈 타이틀
        }
      }
    };

    setTitle();

    return () => {
      isMounted = false;
    };
  }, [pathname, currentUser?.name, currentUser?.id]);

  // 현재 경로에 대한 네비게이션 설정 확인
  const matchedRoute = matchDynamicRoute(pathname);
  const showTopNav = !navigationConfig.hideTopNav.includes(matchedRoute);
  const showBottomNav = !navigationConfig.hideBottomNav.includes(matchedRoute);

  // 인증 필요 여부 확인
  const requireAuth = navigationConfig.requiresAuth.includes(matchedRoute);

  // 페이지별 리소스 추출
  const pageResource = pathname.includes("/edit")
    ? {
        boardId: extractBoardInfoFromEditPage(pathname).boardId,
        type: extractBoardInfoFromEditPage(pathname).type as "trade" | "community",
        userId: undefined,
      }
    : pathname === "/chatList/chatRoom"
    ? extractChatRoomInfo(pathname)
    : undefined;

  // 인증이 필요한 페이지는 AuthGuard로 보호
  const wrappedContent = requireAuth ? (
    <AuthGuard
      requireAuth={true}
      redirectTo="/login"
      resource={pageResource}
      loadingComponent={
        <div className="flex justify-center items-center h-screen">
          로딩중...
        </div>
      }
    >
      {children}
    </AuthGuard>
  ) : (
    children
  );

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
          type={navigationConfig.navType[matchedRoute] || "default"}
        />
      )}

      {/* 메인 콘텐츠 */}
      {wrappedContent}

      {/* 하단 네비게이션 */}
      {showBottomNav && <BottomNavBar />}
    </div>
  );
}