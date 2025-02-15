// src/components/auth/types/auth.ts

/**
 * 공통 API 응답 타입
 */
export interface ApiResponse<T> {
  status: number;
  message: string;
  data?: T;
  error?: {
    message: string;
    status?: number;
  };
}

/**
 * 로그인 폼 데이터 타입 
 */
export interface LoginFormData {
  mail: string;
  password: string;
}

/**
 * 회원가입 폼 데이터 타입
 */
export interface SignupFormData {
  mail: string;
  name: string;
  password: string;
  passwordConfirm: string;
}

/**
 * 사용자 프로필 타입
 */
export interface UserProfile {
  user_id: string;
  mail: string;
  name: string;
  profile_image?: string | null;
}

/**
 * JWT 토큰 응답 타입
 */
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  message?: string;
}

/**
 * 권한 체크 결과 타입
 */
export interface AuthCheckResult {
  isAuthenticated: boolean;
  isAuthorized: boolean;
  message?: string;
}

/**
 * 리소스 권한 체크용 타입
 */
export interface AuthorizedResource {
  userId: string;
  resourceType: 'post' | 'community' | 'comment' | 'reply';
  resourceId: string;
}

/**
 * 거래 게시글 수정 요청 데이터 타입
 */
export interface TradeUpdateRequest {
  title: string;
  region: string;
  price: number;
  contents: string;
  images: string[];
}

/**
 * 거래 게시글 응답 데이터 타입
 */
export interface TradeResponseData {
  message: string;
  data: TradeData | null;
}

/**
 * 거래 게시글 데이터 타입
 */
export interface TradeData {
  userId: number;
  title: string;
  region: string;
  price: number;
  contents: string;
  images: string[];
}

/**
 * 커뮤니티 게시글 응답 데이터 타입
 */
export interface CommunityResponseData {
  message: string;
  data: CommunityData | null;
}

/**
 * 커뮤니티 게시글 데이터 타입
 */
export interface CommunityData {
  userId: number;
  title: string;
  contents: string;
  images: string[];
}

/**
 * 댓글 응답 데이터 타입
 */
export interface CommentResponseData {
  message: string;
  data: CommentData | null;
}

/**
 * 댓글 데이터 타입
 */
export interface CommentData {
  id: number;
  userId: number;
  content: string;
  createdAt: string;
}

/**
 * 리플 응답 데이터 타입
 */
export interface ReplyResponseData {
  message: string;
  data: ReplyData | null;
}

/**
 * 리플 데이터 타입
 */
export interface ReplyData {
  id: number;
  userId: number;
  content: string;
  createdAt: string;
}