"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useUserStore } from "../../commons/store/userStore";
import { AuthGuard } from "@/components/auth/components/AuthGuard";
import TopNavBar from "@/commons/navigation/TopNavBar";
import BottomNavBar from "@/commons/navigation/BottomNavBar";
import { TokenStorage } from "@/components/auth/utils/tokenUtils";

export type NavType = "onlyBack" | "onlyTitle" | "default";

interface NavigationConfig {
  navType: Partial<Record<string, NavType>>;
  hideTopNav: string[];
  hideBottomNav: string[];
  defaultTitles: Record<string, string>;
  publicPages: string[];
  requiresAuth: string[];
}

const matchDynamicRoute = (pathname: string): string => {
  const patterns = [
    { regex: /^\/jobList\/\d+$/, replacement: "/jobList/[boardId]" },
    { regex: /^\/communityBoard\/\d+$/, replacement: "/communityBoard/[boardId]" },
    { regex: /^\/jobList\/\d+\/edit$/, replacement: "/jobList/[boardId]/edit" },
    { regex: /^\/communityBoard\/\d+\/edit$/, replacement: "/communityBoard/[boardId]/edit" },
    { regex: /^\/chatList$/, replacement: "/chatList" },
    { regex: /^\/chatList\/chatRoom$/, replacement: "/chatList/chatRoom" },
  ];

  for (const { regex, replacement } of patterns) {
    if (regex.test(pathname)) {
      return replacement;
    }
  }

  return pathname;
};

const navigationConfig: NavigationConfig = {
  navType: {
    "/jobList/[boardId]": "onlyBack",
    "/chatList/[chatId]": "onlyBack",
    "/communityBoard/[boardId]": "onlyBack",
    "/jobList/[boardId]/map": "onlyBack",
    "/jobList": "onlyTitle",
    "/chatList": "onlyTitle",
    "/communityBoard": "onlyTitle",
    "/": "onlyTitle",
    "/bookmark": "onlyTitle",
    "/mypage": "onlyTitle",
    "/jobList/[boardId]/edit": "onlyBack",
    "/communityBoard/[boardId]/edit": "onlyBack",
  },

  requiresAuth: [
    "/mypage",
    "/bookmark",
    "/jobList/new",
    "/jobList/[boardId]/edit",
    "/communityBoard",
    "/jobList",
    "/communityBoard/[boardId]/edit",
    "/chatList",
    "/chatList/chatRoom",
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
    "/jobList/[boardId]/map",
    "/jobList/[boardId]/edit",
    "/communityBoard/[boardId]/edit",
    "/chatList/chatRoom",
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
    "/chatList/chatRoom": "채팅방",  // 기본 타이틀 추가
    "/jobList/[boardId]/map": "지도",
  },
};

interface NavigationWrapperProps {
  children: React.ReactNode;
}

const extractBoardInfoFromEditPage = (pathname: string) => {
  const pathParts = pathname.split("/");
  const boardId = pathParts[2];
  const type = pathname.includes("jobList") ? "trade" : "community";
  return { boardId, type };
};

const extractChatRoomInfo = (pathname: string) => {
  return { 
    type: 'chat' as const,
    path: pathname
  };
};

export default function NavigationWrapper({
  children,
}: NavigationWrapperProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [pageTitle, setPageTitle] = useState<string>("");
  const currentUser = useUserStore((state) => state.user);

  useEffect(() => {
    let isMounted = true;
  
    const setTitle = async () => {
      try {
        const currentRoute = matchDynamicRoute(pathname);
  
        if (currentRoute === "/chatList/chatRoom") {
          const token = TokenStorage.getAccessToken();
          
          // ✅ URL 파라미터 안전하게 추출
          const roomId = searchParams.get('roomId')?.trim();
          const tradeUserId = searchParams.get('tradeUserId')?.trim();
  
          // 📌 디버깅용 로그
          console.log("[NavWrapper] 채팅방 파라미터 분석", {
            roomId,
            tradeUserId,
            currentUserId: currentUser?.id
          });
  
          // 🚨 새로 생성된 채팅방 처리 로직 (기존 유지)
          if (roomId === 'success' && currentUser) {
            try {
              const response = await fetch('/api/trade/my-chat-rooms', {
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
                }
              });
  
              if (!response.ok) {
                throw new Error('채팅방 목록 조회 실패');
              }
  
              const chatRooms = await response.json();
              const latestChat = chatRooms[0];
              
              if (latestChat) {
                const isCurrentUserRequestUser = currentUser.id === latestChat.requestUserId;
                const partnerName = isCurrentUserRequestUser 
                  ? latestChat.writeUserName 
                  : latestChat.requestUserName;
                
                if (isMounted && partnerName) {
                  setPageTitle(`${partnerName}님과의 채팅`);
                } else {
                  setPageTitle('새로운 채팅');
                }
                
                return;
              } else {
                if (isMounted) {
                  setPageTitle('새로운 채팅');
                }
                return;
              }
            } catch (error) {
              console.error("[NavWrapper] 채팅방 목록 조회 실패:", error);
              if (isMounted) {
                setPageTitle('새로운 채팅');
              }
              return;
            }
          }
  
          // 🔎 기존 채팅방 정보 조회 로직 개선
          if (!token || !roomId) {
            console.warn("[NavWrapper] 필수 정보 부족");
            if (isMounted) {
              setPageTitle("채팅방");
            }
            return;
          }
  
          try {
            // 1. 채팅방 상세 정보 조회
            const response = await fetch(`/api/trade/chat-rooms/${roomId}`, {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            });
  
            // 🛡️ API 호출 실패 시 폴백 로직
            if (!response.ok) {
              // 📌 URL의 tradeUserId로 대체 처리
              if (tradeUserId && currentUser) {
                // 현재 사용자가 구매자인지 판매자인지 확인
                const isCurrentUserRequestUser = currentUser.id !== Number(tradeUserId);
                
                // tradeUserId를 기반으로 상대방 이름 결정
                const partnerName = isCurrentUserRequestUser 
                  ? await fetchUserNameById(Number(tradeUserId), token)  // 새로 추가할 함수
                  : currentUser.name;
  
                if (isMounted && partnerName) {
                  setPageTitle(`${partnerName}님과의 채팅`);
                } else {
                  setPageTitle('채팅방');
                }
                return;
              }
  
              throw new Error(`채팅방 정보 조회 실패: ${response.status}`);
            }
  
            const chatData = await response.json();
            
            // 2. 현재 사용자와 상대방 비교 로직
            if (chatData && isMounted && currentUser) {
              const isCurrentUserRequestUser = currentUser.id === chatData.requestUserId;
              
              // 상대방 이름 동적 추출
              const partnerName = isCurrentUserRequestUser 
                ? chatData.writeUserName 
                : chatData.requestUserName;
              
              // 3. 타이틀 설정
              if (partnerName) {
                setPageTitle(`${partnerName}님과의 채팅`);
              } else {
                // 대체 타이틀 설정
                setPageTitle('채팅방');
              }
            }
          } catch (apiError) {
            console.error("[NavWrapper] 채팅방 정보 조회 중 오류:", apiError);
            
            // 대체 타이틀 설정
            if (isMounted) {
              setPageTitle('채팅방');
            }
          }
        } else {
          // 일반 페이지 기본 타이틀 설정
          if (isMounted) {
            setPageTitle(navigationConfig.defaultTitles[currentRoute] || "");
          }
        }
      } catch (error) {
        console.error("[NavWrapper] 타이틀 설정 중 전역 에러:", error);
        
        // 최종 대체 타이틀
        if (isMounted) {
          setPageTitle("채팅방");
        }
      }
    };
  
    // 🆕 사용자 ID로 이름 조회 함수 추가
    const fetchUserNameById = async (userId: number, token: string): Promise<string> => {
      try {
        const response = await fetch(`/api/users/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
  
        if (!response.ok) {
          throw new Error('사용자 정보 조회 실패');
        }
  
        const userData = await response.json();
        return userData.name || '알 수 없는 사용자';
      } catch (error) {
        console.error("[NavWrapper] 사용자 정보 조회 실패:", error);
        return '알 수 없는 사용자';
      }
    };
  
    setTitle();
  
    return () => {
      isMounted = false;
    };
  }, [pathname, searchParams, currentUser]);

  // 기존 내비게이션 렌더링 로직 유지
  const matchedRoute = matchDynamicRoute(pathname);
  const showTopNav = !navigationConfig.hideTopNav.includes(matchedRoute);
  const showBottomNav = !navigationConfig.hideBottomNav.includes(matchedRoute);
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
      {showTopNav && (
        <TopNavBar
          title={pageTitle}
          type={navigationConfig.navType[matchedRoute] || "default"}
        />
      )}
      {wrappedContent}
      {showBottomNav && <BottomNavBar />}
    </div>
  );
}