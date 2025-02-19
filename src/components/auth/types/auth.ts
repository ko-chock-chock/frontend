// src/components/auth/types/auth.ts
import { ReactNode } from "react";

/**
 * 토큰 관련 타입
 */
export interface TokenData {
  accessToken: string;
  refreshToken: string;
  timestamp: number;
}

export interface TokenRefreshState {
  lastAttemptTime: number;
  attemptCount: number;
}

/**
 * 인증 응답 관련 타입
 */
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  message?: string;
}

export interface AuthCheckResult {
  isAuthenticated: boolean;
  isAuthorized: boolean;
  message?: string;
}

/**
 * 보안 이벤트 로깅을 위한 상세 정보 인터페이스
 * 보안 관련 이벤트 발생시 서버에 전송되는 데이터 구조 정의
 */
export interface SecurityEventDetails {
  /** 사용자 고유 식별자 */
  userId?: number;
  /** 접근 시도된 게시글 ID */
  attemptedBoardId?: string;
  /** 이벤트 발생 시간 */
  timestamp: string;
  /** 이벤트 관련 메시지 */
  message?: string;
  /** 에러 발생시 에러 메시지 */
  errorMessage?: string;
  /** API 응답 상태 코드 */
  responseStatus?: number;
  /** 요청 URL */
  url?: string;
  /** 사용자 브라우저 정보 */
  userAgent?: string;
}

/**
 * AuthGuard 관련 타입
 */
export interface AuthGuardProps {
  children: ReactNode;
  resource?: {
    userId?: number;
    boardId?: string;
    type?: "trade" | "community" | "chat";
    writeUserId?: number;
    requestUserId?: number;
  };
  requireAuth?: boolean;
  fallback?: ReactNode;
  redirectTo?: string;
  loadingComponent?: ReactNode;
}

/**
 * 채팅방 정보 인터페이스
 * 채팅방 접근 권한 확인을 위한 기본 구조 정의
 */
export interface ChatRoom {
  /** 채팅방 작성자 ID */
  writeUserId: number;
  /** 채팅 요청자 ID */
  requestUserId: number;
  /** 채팅방 고유 식별자 */
  roomId: string;
}

/**
 * 게시글 데이터 관련 타입
 */
export interface TradeData {
  userId: number;
  title: string;
  region: string;
  price: number;
  contents: string;
  images: string[];
}

export interface CommunityData {
  userId: number;
  title: string;
  contents: string;
  images: string[];
}

export interface CommunityResponseData {
  message: string;
  data: CommunityData | null;
}

export interface CachedBoardData {
  userId: number;
  data: TradeData;
  timestamp: number;
}

export interface BoardApiResponse {
  message: string;
  data: TradeData | null;
}

/**
 * 컴포넌트 Props 타입
 */
export interface AuthProviderProps {
  children: ReactNode;
}