// src/components/Mypage/index.tsx
"use client";

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import ProfileCard from './ProfileCard';
import TabGroup from './TabGroup';
import { useMyPosts } from './hook';
import PostCard from './PostCard';
import { TabType } from './TabGroup/types';
import { 
  Post, 
  isTradePost,
  isCommunityPost,
  isReviewPost 
} from './PostCard/types';     
    
/**
 * 마이페이지 메인 컴포넌트
 * 
 * 주요 기능:
 * 1. 프로필 정보 표시
 *   - 사용자 기본 정보
 *   - 프로필 수정 기능
 * 
 * 2. 탭 기반 게시글 관리
 *   - 거래글 관리: 게시중/게시완료 상태 구분
 *   - 커뮤니티글 관리
 *   - 받은 후기 목록
 * 
 * 3. 게시글 목록 표시
 *   - 무한 스크롤 지원
 *   - 상태별 필터링
 *   - 빈 목록 처리
 * 
 * 컴포넌트 구조:
 * 1. ProfileCard
 *   - 사용자 프로필 표시
 *   - 프로필 수정 페이지 연결
 * 
 * 2. TabGroup
 *   - 탭 전환 UI
 *   - 게시글 상태별 카운트
 *   - Sticky 포지셔닝
 * 
 * 3. PostCard
 *   - 게시글 타입별 레이아웃
 *   - 상호작용 정보 표시
 *   - 상대시간 표시
 * 
 * 수정사항 (2024.02.04):
 * 1. 게시글 수 계산 로직 최적화
 * 2. 탭 상태 관리 개선
 * 3. 타입 안정성 강화
 */
export default function MypageComponent() {
  // 라우터 초기화
  const router = useRouter();
  
  // 현재 선택된 탭 상태 관리
  const [currentTab, setCurrentTab] = useState<TabType>("게시중");
  
  // 게시글 데이터 및 상태 가져오기
  const { posts, loading, error } = useMyPosts(currentTab);

  /**
   * 상태별 게시글 수 계산
   * - 메모이제이션으로 불필요한 재계산 방지
   * - posts 배열이 변경될 때만 재계산
   * - 모든 탭의 게시글 수를 동시에 계산하여 저장
   */
  const postCounts = useMemo(() => {
    // 기본값 설정
    const counts = {
      "게시중": 0,
      "게시완료": 0,
      "내 커뮤니티": 0,
      "받은 후기": 0
    };

    // posts가 없는 경우 기본값 반환
    if (!posts || !Array.isArray(posts)) return counts;

    // 게시글 수 계산 - 전체 posts 배열을 순회하며 각 탭별 카운트
    return posts.reduce((acc, post) => {
      if (isTradePost(post)) {
        // 거래 게시글인 경우
        if (post.state === "게시중") {
          acc["게시중"] += 1;
        } else if (post.state === "게시완료") {
          acc["게시완료"] += 1;
        }
      } else if (isCommunityPost(post)) {
        // 커뮤니티 게시글인 경우
        acc["내 커뮤니티"] += 1;
      } else if (isReviewPost(post)) {
        // 후기인 경우
        acc["받은 후기"] += 1;
      }
      return acc;
    }, {...counts}); // 초기값으로 기본 counts 객체의 복사본 사용

  }, [posts]); // posts 배열이 변경될 때만 재계산

  /**
   * 탭 변경 핸들러
   * @param tab 선택된 새로운 탭
   */
  const handleTabChange = (tab: TabType) => {
    setCurrentTab(tab);
  };

  /**
   * 게시글 클릭 핸들러
   * @param postId 클릭된 게시글의 ID
   */
  const handlePostClick = (postId: number) => {
    switch(currentTab) {
      case "게시중":
      case "게시완료":
        router.push(`/jobList/${postId}`);
        break;
      case "내 커뮤니티":
        router.push(`/communityBoard/${postId}`);
        break;
      // "받은 후기"는 상세페이지 이동 없음
    }
  };

  /**
   * 프로필 수정 클릭 핸들러
   * 프로필 수정 페이지(/mypage/edit)로 이동
   */
  const handleEditClick = () => {
    router.push("/mypage/edit");
  };

  // 로딩 상태 UI
  if (loading) {
    return <div className="text-sm-medium text-center py-4">로딩 중...</div>;
  }

  // 에러 상태 UI
  if (error) {
    return (
      <div className="text-sm-medium text-error text-center py-4">
        에러가 발생했습니다: {error.message}
      </div>
    );
  }

  return (
    <main className="flex flex-col min-h-screen bg-background">
      {/* 프로필 카드 영역 */}
      <div className="py-5">
        <ProfileCard onEditClick={handleEditClick} />
      </div>

      {/* 탭 그룹 영역 - postCounts prop 전달 */}
      <div className="sticky top-12 z-50 bg-background">
        <TabGroup
          currentTab={currentTab}
          onTabChange={handleTabChange}
          postCounts={postCounts}
        />
      </div>

      {/* 게시글 목록 영역 */}
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
            onPostClick={handlePostClick}
          />
        ))}
      </div>
    </main>
  );
}