/**
 * src/_store/jobStore.ts
 * 게시글(Post) 관련 전역 상태 관리를 위한 Zustand 스토어
 * - 게시글 목록 조회, 추가, 수정, 삭제 등의 기능 제공
 * - 현재는 모의 데이터(mockPosts)를 사용하며, 추후 API 연동 예정
 */

import { Post } from "@/types/post";
import { create } from "zustand";

/**
 * JobStore의 상태와 액션 타입 정의
 * @interface JobStore
 * @property {Post[]} posts - 게시글 목록 상태
 * @property {function} setPosts - 전체 게시글 목록 설정
 * @property {function} addPost - 새 게시글 작성 시 추가
 * @property {function} removePost - 게시글 삭제 (기본)
 * @property {function} updatePost - 게시글 정보 일부 수정
 * @property {function} updatePostStatus - 구인 상태 변경 (구인중 <-> 구인완료)
 * @property {function} deletePost - 게시글 삭제 (API 연동용)
 */
interface JobStore {
  posts: Post[];
  setPosts: (newPosts: Post[]) => void;
  addPost: (post: Post) => void;
  removePost: (postId: number) => void;
  updatePost: (postId: number, updatedPost: Partial<Post>) => void;
  updatePostStatus: (postId: number) => void;
  deletePost: (postId: number) => void;
}

/**
 * 모의 게시글 데이터 생성 함수 (개발용)
 * - 내 게시글 60개 + 다른 사용자 게시글 40개 = 총 100개 생성
 * - 실제 서비스와 유사한 더미 데이터 제공
 * @returns {Post[]} 무작위로 정렬된 게시글 배열
 */
const generateMockPosts = () => {
  // 게시글 생성에 사용될 고정 데이터
  const locations = [
    "서울시 강남구",
    "서울시 서초구",
    "서울시 송파구",
    "서울시 강동구",
    "서울시 마포구",
  ];
  const writers = [
    "김철수",
    "이영희",
    "박지성",
    "최민수",
    "정수연",
    "강다희",
    "윤서준",
  ];
  const titles = [
    "강아지 산책 도와주실 분 구합니다",
    "고양이랑 놀아주실 분 구함",
    "강아지 호텔 1박 추천해주세요",
    "고양이 사료 필요하신 분",
    "강아지 미용 함께 가실 분",
    "고양이 캣타워 나눔",
    "강아지 산책 메이트 구해요",
    "반려동물 간식 나눔합니다",
    "강아지 유치원 데려다주실 분",
    "고양이 집사 하루 대타 구해요",
  ];

  const posts: Post[] = [];

  // 내 게시글 생성 (60개)
  for (let i = 0; i < 60; i++) {
    posts.push({
      id: i + 1,
      title: `[내 게시글] ${titles[i % titles.length]}`,
      location: locations[i % locations.length],
      price: Math.floor((Math.random() * 50000) / 1000) * 1000, // 1000원 단위 가격
      createdAt: `${Math.floor(Math.random() * 24)}시간 전`,
      status: i < 30 ? "구인중" : "구인완료", // 첫 30개는 구인중
      views: Math.floor(Math.random() * 300) + 100,
      likes: Math.floor(Math.random() * 20),
      chatCount: Math.floor(Math.random() * 10),
      isMyPost: true,
      writer: "김철수",
      imageUrl:
        Math.random() < 0.7 // 70% 확률로 강아지 이미지
        ? `/images/post_mock/post_img_dog${(i % 4) + 1}.jpg`
        : "/images/post_mock/post_list_default_img_100px.svg",
    });
  }

  // 다른 사람의 게시글 생성 (40개)
  for (let i = 60; i < 100; i++) {
    posts.push({
      id: i + 1,
      title: titles[i % titles.length],
      location: locations[i % locations.length],
      price: Math.floor((Math.random() * 50000) / 1000) * 1000,
      createdAt: `${Math.floor(Math.random() * 24)}시간 전`,
      status: i < 80 ? "구인중" : "구인완료", // 20개는 구인완료
      views: Math.floor(Math.random() * 300) + 100,
      likes: Math.floor(Math.random() * 20),
      chatCount: Math.floor(Math.random() * 10),
      isMyPost: false,
      writer: writers[(i % (writers.length - 1)) + 1],
      imageUrl:
        Math.random() < 0.7
          ? `/images/post_mock/post_img_dog${(i % 4) + 1}.jpg`
          : "/images/post_mock/post_list_default_img_100px.svg",
    });
  }

  return posts.sort(() => Math.random() - 0.5); // 무작위 정렬
};

// 초기 모의 데이터 생성
const mockPosts = generateMockPosts();

/**
 * Zustand store 생성 및 내보내기
 * 게시글 관련 상태 관리를 위한 스토어
 */
export const useJobStore = create<JobStore>((set) => ({
  /**
   * 게시글 목록 상태
   * @type {Post[]}
   */
  posts: mockPosts,

  /**
   * 전체 게시글 목록을 새로 설정
   * @param newPosts 새로 설정할 게시글 배열
   */
  setPosts: (newPosts: Post[]) => set({ posts: newPosts }),

  /**
   * 새 게시글 작성하여 목록에 추가
   * @param post 추가할 새 게시글 객체
   * @example
   * // 새 게시글 작성 시
   * addPost({
   *   id: 101,
   *   title: "새로운 게시글",
   *   location: "서울시 강남구",
   *   price: 30000,
   *   createdAt: "방금 전",
   *   status: "구인중",
   *   views: 0,
   *   likes: 0,
   *   chatCount: 0,
   *   isMyPost: true,
   *   writer: "작성자명"
   * });
   */
  addPost: (post: Post) =>
    set((state) => ({
      posts: [...state.posts, post],
    })),

  /**
   * 게시글 삭제 (기본)
   * @param postId 삭제할 게시글의 ID
   */
  removePost: (postId: number) =>
    set((state) => ({
      posts: state.posts.filter((post) => post.id !== postId),
    })),

  /**
   * 게시글 정보 업데이트
   * @param postId 수정할 게시글의 ID
   * @param updatedPost 업데이트할 게시글 정보 (일부 속성만 가능)
   */
  updatePost: (postId: number, updatedPost: Partial<Post>) =>
    set((state) => ({
      posts: state.posts.map((post) =>
        post.id === postId ? { ...post, ...updatedPost } : post
      ),
    })),

  /**
   * 게시글 상태 토글 (구인중 <-> 구인완료)
   * @param postId 상태를 변경할 게시글의 ID
   */
  updatePostStatus: (postId: number) =>
    set((state) => ({
      posts: state.posts.map((post) => {
        if (post.id === postId) {
          const newStatus = post.status === "구인중" ? "구인완료" : "구인중";
          return {
            ...post,
            status: newStatus,
          };
        }
        return post;
      }),
    })),

  /**
   * 게시글 삭제 (API 연동용)
   * 현재는 removePost와 동일하나, 추후 API 연동 시 서버 요청 처리를 위해 별도 분리
   * @param postId 삭제할 게시글의 ID
   */
  deletePost: (postId: number) =>
    set((state) => ({
      posts: state.posts.filter((post) => post.id !== postId),
    })),
}));
