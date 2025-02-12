// src/components/Mypage/hook.ts

/**
* 마이페이지 커스텀 훅
*
* ✨ 수정사항 (2024.02.12):
* 1. API 연동을 통한 데이터 관리
*   - 거래/커뮤니티/후기 게시글 실시간 동기화
*   - 조회수, 북마크, 댓글 수 자동 반영
* 
* 2. 데이터 리프레시 기능
*   - 페이지 진입/이탈 시 데이터 갱신
*   - 상호작용 발생 시 자동 갱신
*
* 3. 데이터 처리 최적화
*   - Promise.all을 통한 병렬 로딩
*   - 데이터 초기 분류로 재연산 최소화
* 
* 4. 실시간 탭 카운트 제공
*   - 모든 탭의 정확한 게시글 수 표시
*   - 탭 변경 시 즉시 반영
*/

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { TokenStorage } from "@/components/auth/utils/tokenUtils";
import { TabType } from "@/components/Mypage/TabGroup/types";
import { TradePost, ApiTradePost, CommunityPost, ReviewPost } from "@/components/Mypage/PostCard/types";

const API_BASE_URL = 'http://3.36.40.240:8001';

interface MyPageData {
 ongoingTradePosts: TradePost[];
 completedTradePosts: TradePost[];
 communityPosts: CommunityPost[];
 reviews: ReviewPost[];
}

export const useMyPosts = (currentTab: TabType) => {
 const router = useRouter();
 const [allData, setAllData] = useState<MyPageData>({
   ongoingTradePosts: [],
   completedTradePosts: [],
   communityPosts: [],
   reviews: [],
 });
 const [currentPosts, setCurrentPosts] = useState<(TradePost | CommunityPost | ReviewPost)[]>([]);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState<Error | null>(null);

 /**
  * ✨ 데이터 로딩 및 상태 업데이트
  * @description
  * - 3개 API 병렬 호출 (거래/커뮤니티/후기)
  * - 응답 데이터 가공 및 상태 업데이트
  * - Number 타입 변환으로 카운트 정확성 보장
  */
 const loadAllData = useCallback(async () => {
   try {
     setLoading(true);
     setError(null);

     const token = TokenStorage.getAccessToken();
     if (!token) {
       router.push('/login');
       return;
     }

     const [tradeResponse, communityResponse, reviewResponse] = await Promise.all([
       fetch(`${API_BASE_URL}/api/users/trade-posts`, {
         headers: {
           Authorization: `Bearer ${token}`,
           Accept: '*/*'
         }
       }),
       fetch(`${API_BASE_URL}/api/users/community-posts`, {
         headers: {
           Authorization: `Bearer ${token}`,
           Accept: '*/*'
         }
       }),
       fetch(`${API_BASE_URL}/api/users/trade-reviews`, {
         headers: {
           Authorization: `Bearer ${token}`,
           Accept: '*/*'
         }
       })
     ]);

     if (!tradeResponse.ok || !communityResponse.ok || !reviewResponse.ok) {
       const errorData = await tradeResponse.json();
       throw new Error(errorData.message || '데이터 로딩 실패');
     }

     const [tradePosts, communityPosts, reviews] = await Promise.all([
       tradeResponse.json() as Promise<ApiTradePost[]>,
       communityResponse.json() as Promise<CommunityPost[]>,
       reviewResponse.json() as Promise<ReviewPost[]>
     ]);

     setAllData({
       ongoingTradePosts: tradePosts
         .filter(post => post.state === 'TRADING')
         .map(post => ({
           ...post,
           state: '게시중' as const,
           viewCount: Number(post.viewCount) || 0,
           likeCount: Number(post.likeCount) || 0,
           chatRoomCount: Number(post.chatRoomCount) || 0
         })),
       completedTradePosts: tradePosts
         .filter(post => post.state === 'COMPLETED')
         .map(post => ({
           ...post,
           state: '게시완료' as const,
           viewCount: Number(post.viewCount) || 0,
           likeCount: Number(post.likeCount) || 0,
           chatRoomCount: Number(post.chatRoomCount) || 0
         })),
       communityPosts: communityPosts.map(post => ({
         ...post,
         viewCount: Number(post.viewCount) || 0,
         bookmarkCount: Number(post.bookmarkCount) || 0,
         commentCount: Number(post.commentCount) || 0
       })),
       reviews
     });

     console.log("✨ 데이터 로드 완료:", {
       거래게시글: tradePosts.length,
       커뮤니티게시글: communityPosts.length,
       후기: reviews.length
     });

   } catch (err) {
     setError(err instanceof Error ? err : new Error('데이터 로딩 실패'));
     if (err instanceof Error && err.message.includes('토큰')) {
       router.push('/login');
     }
   } finally {
     setLoading(false);
   }
 }, [router]);

 /**
  * ✨ 데이터 리프레시 함수
  * @description
  * - 상호작용 발생 시 호출
  * - 최신 데이터로 상태 갱신
  */
 const refresh = useCallback(async () => {
   try {
     await loadAllData();
     console.log("✨ 데이터 리프레시 완료");
   } catch (err) {
     console.error("❌ 데이터 리프레시 실패:", err);
   }
 }, [loadAllData]);

 // ✨ 초기 데이터 로드
 useEffect(() => {
   loadAllData();
 }, [loadAllData]);

 // ✨ 정확한 게시글 수 계산
 const postCounts = useMemo(() => ({
   "게시중": allData.ongoingTradePosts.length,
   "게시완료": allData.completedTradePosts.length,
   "내 커뮤니티": allData.communityPosts.length,
   "받은 후기": allData.reviews.length
 }), [allData]);

 // ✨ 현재 탭에 따른 게시글 필터링
 useEffect(() => {
   switch (currentTab) {
     case "게시중":
       setCurrentPosts(allData.ongoingTradePosts);
       break;
     case "게시완료":
       setCurrentPosts(allData.completedTradePosts);
       break;
     case "내 커뮤니티":
       setCurrentPosts(allData.communityPosts);
       break;
     case "받은 후기":
       setCurrentPosts(allData.reviews);
       break;
     default:
       setCurrentPosts([]);
   }
 }, [currentTab, allData]);

 return {
   posts: currentPosts,
   postCounts,
   loading,
   error,
   refresh
 };
};