// src/components/Mypage/hook.ts

/**
 * 마이페이지 게시글 목록을 관리하는 커스텀 훅
 * 
 * API 스펙:
 * 1. GET /api/users/trade-posts : 내 거래 게시글 목록 (최신순)
 * 2. GET /api/users/community-posts : 내 커뮤니티 게시글 목록 (최신순)
 * 
 * 주요 기능:
 * 1. 게시물 상태별 필터링 (게시중/게시완료)
 * 2. 데이터 선로딩 및 캐싱
 * 3. 에러 상태 관리
 */

import { useState, useEffect, useCallback } from "react";
import { TokenStorage } from "@/components/auth/utils/tokenUtils";
import { useRouter } from "next/navigation";
import { TabType } from "@/components/Mypage/TabGroup/types";
import { TradePost, CommunityPost, ReviewPost } from "@/components/Mypage/PostCard/types";

// API 엔드포인트 상수
const API_BASE_URL = 'http://13.209.11.201:8001';

interface ApiResponse<T> {
  message?: string;
  data: T | null;
}

export const useMyPosts = (currentTab: TabType) => {
  const router = useRouter();
  const [allPosts, setAllPosts] = useState<{
    tradePosts: TradePost[];
    communityPosts: CommunityPost[];
  }>({
    tradePosts: [],
    communityPosts: [],
  });
  const [currentPosts, setCurrentPosts] = useState<(TradePost | CommunityPost)[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * API 요청 함수
   * 토큰 처리 및 에러 핸들링 포함
   */
  const fetchData = useCallback(async (endpoint: string) => {
    const token = TokenStorage.getAccessToken();
    if (!token) {
      router.push('/login');
      throw new Error('로그인이 필요합니다.');
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': '*/*'
      }
    });

    if (!response.ok) {
      if (response.status === 400) {
        const errorData: ApiResponse<null> = await response.json();
        if (errorData.message === "토큰이 만료되었습니다.") {
          // 토큰 갱신 로직으로 연결
          router.push('/login');
        }
        throw new Error(errorData.message);
      }
      throw new Error('데이터 로딩 실패');
    }

    return response.json();
  }, [router]);

  /**
   * 모든 게시글 데이터를 병렬로 로드
   */
  const loadAllPosts = useCallback(async () => {
    try {
      setLoading(true);
      const [tradePostsResponse, communityPostsResponse] = await Promise.all([
        fetchData('/api/users/trade-posts'),
        fetchData('/api/users/community-posts')
      ]);

      setAllPosts({
        tradePosts: tradePostsResponse || [],
        communityPosts: communityPostsResponse || []
      });

      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : '데이터 로드 실패');
    } finally {
      setLoading(false);
    }
  }, [fetchData]);

  // 초기 데이터 로드
  useEffect(() => {
    loadAllPosts();
  }, [loadAllPosts]);

  // 현재 탭에 따른 게시글 필터링
  useEffect(() => {
    switch(currentTab) {
      case "게시중":
        setCurrentPosts(allPosts.tradePosts.filter(post => post.state === "게시중"));
        break;
      case "게시완료":
        setCurrentPosts(allPosts.tradePosts.filter(post => post.state === "게시완료"));
        break;
      case "내 커뮤니티":
        setCurrentPosts(allPosts.communityPosts);
        break;
      default:
        setCurrentPosts([]);
    }
  }, [currentTab, allPosts]);

  /**
   * 각 탭별 게시글 수 계산
   */
  const postCounts = {
    "게시중": allPosts.tradePosts.filter(post => post.state === "게시중").length,
    "게시완료": allPosts.tradePosts.filter(post => post.state === "게시완료").length,
    "내 커뮤니티": allPosts.communityPosts.length,
    "받은 후기": 0 // 후기 API 추가 시 업데이트 필요
  };

  return {
    posts: currentPosts,
    loading,
    error,
    postCounts,
    refresh: loadAllPosts
  };
};