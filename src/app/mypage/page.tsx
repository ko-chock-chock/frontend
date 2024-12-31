// src/app/mypage/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useInView } from "react-intersection-observer";
import { useJobStore } from "@/_store/jobStore";
import ProfileCard from "./_components/ProfileCard";
import TabGroup from "./_components/TabGroup";
import PostCard from "./_components/PostCard";
import { Post } from "@/types/post";
import { TabType } from "@/types/mypage";

const POSTS_PER_PAGE = 10; // 한 번에 보여줄 게시글 수

export default function MyPage() {
  const router = useRouter();
  const { posts } = useJobStore();
  const [currentTab, setCurrentTab] = useState<TabType>("구인중");
  const [displayPosts, setDisplayPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true); // 더 불러올 게시글이 있는지 여부

  // 무한 스크롤을 위한 ref
  const { ref: scrollRef, inView } = useInView({
    threshold: 0.1,
  });

  // 게시글 필터링 및 페이징 처리
  useEffect(() => {
    // 내 게시글만 필터링
    const myPosts = posts.filter((post) => post.isMyPost);

    // 현재 선택된 탭의 상태에 해당하는 게시글만 필터링
    const filteredPosts = myPosts.filter((post) => post.status === currentTab);

    // 페이지에 해당하는 게시글만 표시
    const paginatedPosts = filteredPosts.slice(0, page * POSTS_PER_PAGE);
    setDisplayPosts(paginatedPosts);

    // 더 불러올 게시글이 있는지 확인
    setHasMore(paginatedPosts.length < filteredPosts.length);
  }, [currentTab, posts, page]);

  // 무한 스크롤 처리
  useEffect(() => {
    if (inView && hasMore) {
      setPage((prev) => prev + 1);
    }
  }, [inView, hasMore]);

  // 탭 변경 처리
  const handleTabChange = (tab: TabType) => {
    setCurrentTab(tab);
    setPage(1); // 페이지 초기화
  };

  const handlePostClick = (postId: number) => {
    router.push(`/jobList/${postId}`);
  };

  const handleChatClick = () => {
    router.push("/chatList");
  };

  const handleEditClick = () => {
    router.push("/mypage/edit");
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* 프로필 영역 */}
      <div>
        <ProfileCard onEditClick={handleEditClick} />
      </div>

      {/* 컨텐츠 컨테이너 - relative로 설정하여 sticky 포지셔닝의 기준점 제공 */}
      <div className="relative flex-1">
        {/* 탭 그룹 */}
        <div className="sticky top-12 z-50 bg-background shadow-sm">
          <TabGroup
            currentTab={currentTab}
            onTabChange={handleTabChange}
            posts={posts}
          />
        </div>

        {/* 게시글 목록 */}
        <div>
          {displayPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onPostClick={handlePostClick}
              onChatClick={handleChatClick}
              chatCount={post.chatCount}
            />
          ))}

          {/* 무한 스크롤 감지 요소 */}
          {hasMore && (
            <div ref={scrollRef} className="h-10">
              <div className="text-center py-4 text-gray-500">
                게시글을 더 불러오는 중...
              </div>
            </div>
          )}

          {!hasMore && displayPosts.length > 0 && (
            <div className="text-center py-4 text-gray-500">
              모든 게시글을 불러왔습니다.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
