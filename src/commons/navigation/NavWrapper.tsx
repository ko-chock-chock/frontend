// src/commons/navigation/NavWrapper.tsx
"use client";

import { usePathname } from "next/navigation";
import TopNavBar from "@/commons/navigation/TopNavBar";
import BottomNavBar from "@/commons/navigation/BottomNavBar";

// 네비게이션 타입 정의 추가
export type NavType = "default" | "onlyBack";
// 페이지 경로 타입 정의
// 앱에서 사용되는 모든 라우트 경로를 타입으로 지정
export type PagePath =
  | "/"
  | "/mypage"
  | "/chatList"
  | "/bookMark"
  | "/jobList"
  | "/jobList/new"
  | "/jobList/jobDetail"
  | "/login"
  | "/signup"
  | "/mypage/edit";

// 네비게이션 설정 객체
const navigationConfig = {
  // 네비게이션 타입 설정 추가
  navType: {
    "/": "onlyBack", // 홈에서는 뒤로가기만 표시
    "/jobList/jobDetail": "onlyBack", // 게시글 작성 페이지도 뒤로가기만 표시
    // 나머지 페이지는 기본 스타일
  } as Partial<Record<PagePath, NavType>>, // Partial 추가로 모든 경로를 정의하지 않아도 됨

  // 상단 네비게이션 바를 숨길 페이지 목록
  hideTopNav: ["/login",],

  // 하단 네비게이션 바를 숨길 페이지 목록
  hideBottomNav: ["/login", "/signup", "/mypage/edit", "/jobList/jobDetail"],

  // 타이틀이 필요한 페이지만 정의
  pageTitles: {
    "/": "홈",
    "/signup": "회원가입",
    "/mypage": "마이페이지",
    "/chatList": "채팅목록",
    "/bookMark": "찜목록",
    "/jobList": "게시물 목록",
    "/jobList/new": "게시물 작성",
    "/mypage/edit": "회원정보 수정",
  } as Partial<Record<PagePath, string>>, // Partial 적용
};

// 네비게이션 래퍼 컴포넌트
export default function NavigationWrapper({
  children, // 자식 컴포넌트를 받아옴
}: {
  children: React.ReactNode;
}) {
  // 현재 페이지 경로 가져오기
  const pathname = usePathname() as PagePath;
  // 해결방안: 타입 가드 추가
// const pathname = usePathname();
// const isValidPagePath = (path: string): path is PagePath => {
//   return Object.keys(navigationConfig.pageTitles).includes(path);
// };

  // 상단 네비게이션 바 표시 여부 결정
  const showTopNav = !navigationConfig.hideTopNav.includes(pathname);

  // 하단 네비게이션 바 표시 여부 결정
  const showBottomNav = !navigationConfig.hideBottomNav.includes(pathname);

  // 현재 페이지의 타이틀 가져오기
  const pageTitle = navigationConfig.pageTitles[pathname];

  return (
    // 네비게이션 바 표시 여부에 따라 padding 조정
    <div
      className={`min-h-screen ${showTopNav ? "pt-12" : ""} ${
        showBottomNav ? "pb-24" : ""
      }`}
    >
      {/* 상단 네비게이션 바 조건부 렌더링 */}
      {showTopNav && (
        <TopNavBar
          title={pageTitle}
          type={navigationConfig.navType[pathname] || "default"}
        />
      )}

      {/* 자식 컴포넌트 렌더링 */}
      {children}

      {/* 하단 네비게이션 바 조건부 렌더링 */}
      {showBottomNav && <BottomNavBar />}
    </div>
  );
}
