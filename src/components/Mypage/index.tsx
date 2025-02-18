/**
* 마이페이지 컴포넌트
* 
* 주요 기능:
* 1. 프로필 카드 표시 및 수정 페이지 연결
* 2. 게시글 상태별 탭 관리 (게시중/거래완료/숨김)
* 3. URL 파라미터를 통한 탭 상태 관리
* 4. 게시글 목록 표시 및 게시글 타입별 상세 페이지 라우팅
* 5. 로딩 및 에러 상태 처리
*/

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ProfileCard from "./ProfileCard";
import TabGroup from "./TabGroup";
import { useMyPosts } from "./hook";
import PostCard from "./PostCard";
import { TabType } from "./TabGroup/types";
import { Post, isTradePost, isCommunityPost } from "./PostCard/types";

export default function MypageComponent() {
 // 라우터 및 상태 초기화
 const router = useRouter();
 const [currentTab, setCurrentTab] = useState<TabType>("게시중");
 
 // 커스텀 훅을 통한 게시글 데이터 fetch
 const { posts, postCounts, loading, error } = useMyPosts(currentTab);

 // 디버깅용 로그 (주석 처리)
 // useEffect(() => {
 //   console.log("현재 마이페이지 데이터:", {
 //     현재탭: currentTab,
 //     게시글목록: posts,
 //   });
 // }, [posts, currentTab]);

 /**
  * 탭 변경 핸들러
  * @param tab - 선택된 탭 타입
  * @description
  * 1. 현재 탭 상태를 업데이트
  * 2. URL 파라미터에 현재 탭 상태를 반영
  * 3. 브라우저 히스토리에 새로운 URL 추가 (페이지 새로고침 없음)
  */
 const handleTabChange = (tab: TabType) => {
   setCurrentTab(tab);
   const searchParams = new URLSearchParams(window.location.search);
   searchParams.set("tab", tab);
   const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
   window.history.pushState({}, "", newUrl);
 };

 /**
  * 게시글 클릭 핸들러
  * @param id - 게시글 ID
  * @param post - 게시글 데이터
  * @description 게시글 타입에 따라 적절한 상세 페이지로 라우팅
  * - 거래 게시글 -> /jobList/{id}
  * - 커뮤니티 게시글 -> /communityBoard/{id}
  */
 const handlePostClick = (id: number, post: Post) => {
   if (isTradePost(post)) {
     router.push(`/jobList/${id}`);
   } else if (isCommunityPost(post)) {
     router.push(`/communityBoard/${id}`);
   }
 };

 return (
   <main className="flex flex-col px-5 min-h-screen bg-background">
     {/* 프로필 카드 섹션 */}
     <div className="py-5">
       <ProfileCard onEditClick={() => router.push("/mypage/edit")} />
     </div>

     {/* 탭 그룹 섹션 - 스크롤 시 상단에 고정 */}
     <div className="sticky top-12 z-50 bg-background">
       <TabGroup
         currentTab={currentTab}
         onTabChange={handleTabChange}
         postCounts={postCounts}
       />
     </div>

     {/* 로딩 상태 표시 */}
     {loading && (
       <div className="text-sm-medium text-center py-4">로딩 중...</div>
     )}

     {/* 에러 상태 표시 */}
     {error && (
       <div className="text-sm-medium text-error text-center py-4">
         에러가 발생했습니다: {error.message}
       </div>
     )}

     {/* 게시글 목록 섹션 */}
     <div className="flex-1">
       {/* 게시글이 없는 경우 메시지 표시 */}
       {(!posts || posts.length === 0) && (
         <div className="text-sm-medium text-center py-4">
           게시글이 없습니다.
         </div>
       )}

       {/* 게시글 목록 렌더링 */}
       {posts.map((post: Post) => (
         <PostCard
           key={post.id}
           post={post}
           onPostClick={(id) => handlePostClick(id, post)}
         />
       ))}
     </div>
   </main>
 );
}