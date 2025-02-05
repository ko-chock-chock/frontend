// src/components/Mypage/hook.ts

import { useState, useEffect } from 'react';
import { TradePost, CommunityPost, ReviewPost } from '../Mypage/PostCard/types';
import { TabType } from '../Mypage/TabGroup/types';

/**
 * ⚠️ 테스트용 더미 데이터
 * 코촉촉 서비스 특성 반영:
 * - 반려동물 도우미 구인글
 * - 반려동물 용품 중고거래
 * - 반려동물 관련 커뮤니티 정보
 * - 서비스 이용 후기
 */
const DUMMY_TRADE_POSTS: TradePost[] = [
  // 반려동물 도우미 구인글 (게시중)
  {
    id: 1,
    thumbnailImage: "/images/post_list_default_img_100px.svg",
    title: "[구인] 주말 반려견 산책 도우미 구합니다",
    region: "서울시 강남구",
    price: 30000,
    contents: "토요일 오전 2시간 반려견 산책 도우미 구합니다. 3개월 이상 정기적으로 활동하실 분 구해요.",
    state: "게시중",
    images: [],
    writeUserId: 1,
    writeUserProfileImage: "/images/post_list_profile_default_img_20px.svg",
    writeUserName: "멍멍이맘",
    likeCount: 8,
    viewCount: 45,
    chatRoomCount: 3,
    isLiked: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30분 전
    updatedAt: new Date().toISOString()
  },
  // 반려동물 용품 중고거래 (게시중)
  {
    id: 2,
    thumbnailImage: "/images/post_list_default_img_100px.svg",
    title: "[판매] 강아지 유모차 판매합니다",
    region: "서울시 서초구",
    price: 50000,
    contents: "3개월 사용한 강아지 유모차 판매합니다. 상태 양호해요.",
    state: "게시중",
    images: [],
    writeUserId: 1,
    writeUserProfileImage: "/images/post_list_profile_default_img_20px.svg",
    writeUserName: "멍멍이맘",
    likeCount: 12,
    viewCount: 89,
    chatRoomCount: 4,
    isLiked: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2시간 전
    updatedAt: new Date().toISOString()
  },
  // 도우미 구인 완료글
  {
    id: 3,
    thumbnailImage: "/images/post_list_default_img_100px.svg",
    title: "[완료] 강아지 호텔링 도우미 구인",
    region: "서울시 강남구",
    price: 100000,
    contents: "2박3일 강아지 호텔링 도우미 구했습니다.",
    state: "게시완료",
    images: [],
    writeUserId: 1,
    writeUserProfileImage: "/images/post_list_profile_default_img_20px.svg",
    writeUserName: "멍멍이맘",
    likeCount: 5,
    viewCount: 120,
    chatRoomCount: 3,
    isLiked: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3일 전
    updatedAt: new Date().toISOString()
  }
];

const DUMMY_COMMUNITY_POSTS: CommunityPost[] = [
  // 반려동물 정보 공유
  {
    id: 4,
    thumbnailImage: "/images/post_list_default_img_100px.svg",
    title: "우리 동네 착한 동물병원 추천",
    contents: "야간진료도 가능하고 원장님이 친절하세요. 위치는 강남역 3번출구...",
    images: [],
    writeUserId: 1,
    writeUserProfileImage: "/images/post_list_profile_default_img_20px.svg",
    writeUserName: "멍멍이맘",
    bookmarkCount: 45,
    viewCount: 230,
    commentCount: 15,
    isBookmarked: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1시간 전
    updatedAt: new Date().toISOString()
  },
  // 반려동물 산책 코스 공유
  {
    id: 5,
    thumbnailImage: "/images/post_list_default_img_100px.svg",
    title: "반려견 산책하기 좋은 코스 공유",
    contents: "한강공원 산책코스 추천드려요. 반려견 놀이터도 있고...",
    images: [],
    writeUserId: 1,
    writeUserProfileImage: "/images/post_list_profile_default_img_20px.svg",
    writeUserName: "멍멍이맘",
    bookmarkCount: 33,
    viewCount: 180,
    commentCount: 8,
    isBookmarked: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5시간 전
    updatedAt: new Date().toISOString()
  }
];

const DUMMY_REVIEWS: ReviewPost[] = [
  // 도우미 서비스 이용 후기
  {
    id: 6,
    title: "산책 도우미 친절하고 좋았어요",
    contents: "정시에 와주시고 강아지랑 잘 놀아주셨어요. 산책 경로도 실시간으로 공유해주셔서 안심되었습니다.",
    rating: "5",
    writeUserId: 2,
    writeUserProfileImage: "/images/post_list_profile_default_img_20px.svg",
    writeUserName: "댕댕이집사",
    targetUserId: 1,
    targetUserProfileImage: "/images/post_list_profile_default_img_20px.svg",
    targetUserName: "펫시터영희",
    isWriteUser: false,
    isTargetUser: true,
   
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30분 전
    updatedAt: new Date().toISOString()
  },
  // 중고거래 후기
  {
    id: 7,
    title: "강아지 유모차 상태 좋았어요",
    contents: "사진 그대로고 깨끗했습니다. 판매자분이 세척까지 해주셔서 좋았어요.",
    rating: "5",
    writeUserId: 3,
    writeUserProfileImage: "/images/post_list_profile_default_img_20px.svg",
    writeUserName: "차차맘",
    targetUserId: 1,
    targetUserProfileImage: "/images/post_list_profile_default_img_20px.svg",
    targetUserName: "멍멍이맘",
    isWriteUser: false,
    isTargetUser: true,
    
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2시간 전
    updatedAt: new Date().toISOString()
  }
];

/**
 * API 엔드포인트 상수
 * - 추후 환경변수로 관리 필요
 */
const API_ENDPOINTS = {
  TRADE_POSTS: '/api/users/trade-posts',
  COMMUNITY_POSTS: '/api/users/community-posts',
  TRADE_REVIEWS: '/api/users/trade-reviews'
} as const;

/**
 * 마이페이지 게시글 목록을 관리하는 커스텀 훅
 * 
 * @param currentTab 현재 선택된 탭
 * 
 * 실제 API 연동 시 필요한 작업:
 * 1. 토큰 처리:
 *    - 요청 헤더에 Bearer 토큰 추가
 *    - 토큰 만료 시 갱신 로직 구현
 * 
 * 2. 에러 처리:
 *    - 401: 인증 에러 (로그인 페이지로 리디렉션)
 *    - 403: 권한 에러
 *    - 404: 데이터 없음
 *    - 500: 서버 에러
 * 
 * 3. 캐싱 전략:
 *    - React-Query 또는 SWR 도입 고려
 *    - 불필요한 API 호출 최소화
 */
export const useMyPosts = (currentTab: TabType) => {
  const [posts, setPosts] = useState<(TradePost | CommunityPost | ReviewPost)[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);

        // ⚠️ 테스트용 더미 데이터 반환
        // TODO: API 연동 시 아래 주석 해제
        setTimeout(() => {
          switch(currentTab) {
            case "게시중":
              setPosts(DUMMY_TRADE_POSTS.filter(post => post.state === "게시중"));
              break;
            case "게시완료":
              setPosts(DUMMY_TRADE_POSTS.filter(post => post.state === "게시완료"));
              break;
            case "내 커뮤니티":
              setPosts(DUMMY_COMMUNITY_POSTS);
              break;
            case "받은 후기":
              setPosts(DUMMY_REVIEWS);
              break;
            default:
              setPosts([]);
          }
          setLoading(false);
        }, 500);

        /* 실제 API 연동 시 사용할 코드
        const token = localStorage.getItem('accessToken');
        if (!token) {
          throw new Error('인증 정보가 없습니다.');
        }

        let endpoint = '';
        switch(currentTab) {
          case "게시중":
          case "게시완료":
            endpoint = API_ENDPOINTS.TRADE_POSTS;
            break;
          case "내 커뮤니티":
            endpoint = API_ENDPOINTS.COMMUNITY_POSTS;
            break;
          case "받은 후기":
            endpoint = API_ENDPOINTS.TRADE_REVIEWS;
            break;
        }

        const response = await fetch(endpoint, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('데이터를 불러오는데 실패했습니다.');
        }

        const data = await response.json();
        
        // 거래글의 경우 상태에 따라 필터링
        if (currentTab === "게시중" || currentTab === "게시완료") {
          const filteredData = data.filter((post: TradePost) => 
            post.state === currentTab
          );
          setPosts(filteredData);
        } else {
          setPosts(data);
        }
        */

      } catch (err) {
        setError(err instanceof Error ? err : new Error('알 수 없는 에러가 발생했습니다.'));
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [currentTab]);

  return { posts, loading, error };
};