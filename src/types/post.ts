// src/types/post.ts
// 게시글 목록, 상세, 작성 페이지, 마이페이지의 게시물 목록 관련 타입
/**
* 게시글 정보를 위한 인터페이스
* 게시글의 모든 필수 및 선택적 속성을 정의합니다.
*/
export interface Post {
  id: number;                    // 게시글의 고유 식별자
  title: string;                 // 게시글 제목
  location: string;              // 거래 희망 지역 (예: "서울시 강남구")
  price: number;                 // 거래 가격 (단위: 원)
  createdAt: string;            // 작성 시간 (예: "3시간 전")
  status: '구인중' | '구인완료';  // 게시글의 현재 상태
  views: number;                // 조회수
  likes: number;                // 좋아요 수
  chatCount: number;            // 해당 게시글의 채팅방 수
  isMyPost: boolean;            // 현재 로그인한 사용자의 게시글 여부
  imageUrl?: string;            // 게시글 이미지 URL (선택적)
  writer: string;               // 작성자 이름
 }
 
 export interface JobState {
  posts: Post[];
}


