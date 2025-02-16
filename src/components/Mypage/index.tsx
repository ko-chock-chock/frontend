// src/components/Mypage/index.tsx
"use client";

/**
 * 마이페이지 컴포넌트
 *
 * 주요 기능:
 * 1. 프로필 카드 표시 및 수정 페이지 연결
 * 2. 게시글 상태별 탭 관리 (게시중/거래완료/받은 후기)
 * 3. URL 파라미터를 통한 탭 상태 관리
 * 4. 게시글 목록 표시 및 게시글 타입별 상세 페이지 라우팅
 * 5. 로딩 및 에러 상태 처리
 * 6. BottomSheetModal을 통한 게시글 관리 기능 제공
 *
 * 수정사항 (2024.02.15):
 * 1. 상태 변경 로직 수정
 *   - 게시중 -> 게시완료 변경만 가능하도록 변경
 *   - 게시완료 상태에서는 상태 변경 버튼 제거
 * 2. 코드 가독성 개선
 *   - 불필요한 타입 정의 제거
 *   - 명확한 주석 추가
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import ProfileCard from "./ProfileCard";
import TabGroup from "./TabGroup";
import { useMyPosts } from "./hook";
import PostCard from "./PostCard";
import { TabType } from "./TabGroup/types";
import { Post, isTradePost, isCommunityPost } from "./PostCard/types";
import { TokenStorage } from "@/components/auth/utils/tokenUtils";
import BottomSheetModal, {
  BottomSheetMenuItem,
} from "@/commons/BottomSheetModal";

export default function MypageComponent() {
  // 1️⃣ 컴포넌트 초기 설정
  const router = useRouter();
  const [currentTab, setCurrentTab] = useState<TabType>("게시중");
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false); // 상태 변경 처리 중 여부

  // 2️⃣ 게시글 데이터 및 상태 관리
  const { posts, postCounts, loading, error, refresh } = useMyPosts(currentTab);

  // 3️⃣ 탭 변경 처리
  const handleTabChange = (tab: TabType) => {
    setCurrentTab(tab);
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set("tab", tab);
    const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
    window.history.pushState({}, "", newUrl);
  };

  // 4️⃣ 게시글 클릭 처리
  const handlePostClick = (id: number, post: Post) => {
    if (isTradePost(post)) {
      router.push(`/jobList/${id}`);
    } else if (isCommunityPost(post)) {
      router.push(`/communityBoard/${id}`);
    }
  };

  // 5️⃣ 더보기 버튼 클릭 처리
  const handleMoreClick = (post: Post) => {
    setSelectedPost(post);
    setIsBottomSheetOpen(true);
  };

  // 6️⃣ BottomSheetModal 메뉴 아이템 생성
  const getBottomSheetMenuItems = (
    post: Post | null,
    currentTab: TabType
  ): BottomSheetMenuItem[] => {
    if (!post || currentTab === "받은 후기") return [];

    const menuItems: BottomSheetMenuItem[] = [];

    // 7️⃣ 게시중 상태일 때만 상태 변경 버튼 표시
    if (currentTab === "게시중") {
      const handleStateChange = async (postId: number) => {
        if (isProcessing) return;

        try {
          setIsProcessing(true);
          const token = TokenStorage.getAccessToken();

          // 8️⃣ 상태 변경 API 호출
          const response = await fetch(`/api/trade/${postId}/state`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              Accept: "*/*",
            },
            body: JSON.stringify({ state: "COMPLETED" }),
          });

          if (!response.ok) {
            throw new Error("상태 변경에 실패했습니다");
          }

          // 9️⃣ 성공 시 데이터 갱신 및 UI 업데이트
          await refresh();
          setIsBottomSheetOpen(false);
          alert("게시완료로 변경되었습니다.");
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "상태 변경에 실패했습니다";
          alert(errorMessage);
        } finally {
          setIsProcessing(false);
        }
      };

      // 🔟 상태 변경 버튼 추가
      menuItems.push({
        label: isProcessing ? "처리 중..." : "게시완료로 변경",
        onClick: async () => {
          if (!isProcessing) {
            await handleStateChange(post.id);
          }
        },
        type: "default",
      });
    }

    // 1️⃣1️⃣ 공통 메뉴 아이템 추가
    menuItems.push(
      {
        label: "게시글 수정",
        onClick: () => {
          if (isTradePost(post)) {
            router.push(`/jobList/${post.id}/edit`);
          } else if (isCommunityPost(post)) {
            router.push(`/communityBoard/${post.id}/edit`);
          }
        },
        type: "default",
      },
      {
        label: "삭제",
        onClick: async () => {
          try {
            const token = TokenStorage.getAccessToken();
            const url = isCommunityPost(post)
              ? `/api/community/${post.id}`
              : `/api/trade/${post.id}`;

            const response = await fetch(url, {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            });

            if (response.ok) {
              await refresh();
              setIsBottomSheetOpen(false);
            } else {
              throw new Error("삭제 실패");
            }
          } catch (error) {
            console.error("게시글 삭제 실패:", error);
            alert("게시글 삭제에 실패했습니다.");
          }
        },
        type: "danger",
      },
      {
        label: "창 닫기",
        onClick: () => setIsBottomSheetOpen(false),
        type: "cancel",
      }
    );

    return menuItems;
  };

  // 1️⃣2️⃣ 컴포넌트 렌더링
  return (
    <main className="flex flex-col px-5 min-h-screen bg-background">
      {/* 프로필 카드 섹션 */}
      <div className="py-5">
        <ProfileCard onEditClick={() => router.push("/mypage/edit")} />
      </div>

      {/* 탭 그룹 섹션 */}
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
        {(!posts || posts.length === 0) && (
          <div className="text-sm-medium text-center py-4">
            게시글이 없습니다.
          </div>
        )}

        {posts.map((post: Post) => (
          <PostCard
            key={post.id}
            post={post}
            onPostClick={(id) => handlePostClick(id, post)}
            onMoreClick={handleMoreClick}
          />
        ))}
      </div>

      {/* BottomSheetModal */}
      <BottomSheetModal
        isOpen={isBottomSheetOpen}
        onClose={() => setIsBottomSheetOpen(false)}
        menuItems={getBottomSheetMenuItems(selectedPost, currentTab)}
      />
    </main>
  );
}
