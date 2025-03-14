/**
 * 코촉촉 인증 시스템 타입 정의 모듈
 * 
 * 주요 기능:
 * 1. 인증 시스템 전체에서 사용되는 공통 타입 정의
 * 2. JWT 토큰 관련 데이터 구조 정의
 * 3. 권한 체크 및 보안 관련 인터페이스 제공
 * 4. 리소스 접근 제어를 위한 타입 시스템 구현
 * 5. 채팅방 및 지도 페이지 접근 권한 모델 정의
 * 6. 게시글 데이터 구조 및 API 응답 타입 정의
 * 
 * 활용 컴포넌트:
 * - AuthGuard: 페이지 접근 권한 제어 컴포넌트
 * - AuthProvider: 인증 상태 전역 관리 컴포넌트
 * - TokenUtils: 토큰 관리 유틸리티
 * 
 * @version 1.0.0
 * @since 2024.02
 */

import { ReactNode } from "react";

/**
 * 토큰 데이터 구조 정의
 * 액세스/리프레시 토큰과 타임스탬프 저장
 * 
 * @property accessToken - JWT 액세스 토큰
 * @property refreshToken - JWT 리프레시 토큰
 * @property timestamp - 토큰 저장 시간 (밀리초 단위 타임스탬프)
 */
export interface TokenData {
  accessToken: string;
  refreshToken: string;
  timestamp: number;
}

/**
 * 토큰 갱신 상태 관리를 위한 인터페이스
 * 토큰 갱신 시도 추적 및 보안 로깅에 활용
 * 
 * @property lastAttemptTime - 마지막 토큰 갱신 시도 시간 (밀리초 단위)
 * @property failedAttempts - 연속된 갱신 실패 횟수
 * @property successAttempts - 총 갱신 성공 횟수
 * @property lastSuccessTokenInfo - 마지막 성공적인 토큰 갱신 정보 (선택적)
 */
export interface TokenRefreshState {
  lastAttemptTime: number;     // 마지막 갱신 시도 시간
  failedAttempts: number;      // 갱신 실패 횟수
  successAttempts: number;     // 갱신 성공 횟수
  lastSuccessTokenInfo?: {     // 마지막 성공적인 토큰 갱신 정보
    timestamp: string; 
  };
}

/**
 * 인증 응답 데이터 구조
 * 서버로부터 받는 토큰 및 메시지 정의
 * 
 * @property accessToken - 새로 발급된 액세스 토큰
 * @property refreshToken - 새로 발급된 리프레시 토큰
 * @property message - 서버 응답 메시지 (선택적)
 */
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  message?: string;
}

/**
 * 인증 상태 확인 결과 인터페이스
 * 사용자 인증 및 권한 상태 표현
 * 
 * @property isAuthenticated - 사용자 인증 여부 (토큰 유효성)
 * @property isAuthorized - 요청한 리소스에 대한 권한 부여 여부
 * @property message - 추가 상태 메시지 (선택적)
 */
export interface AuthCheckResult {
  isAuthenticated: boolean;    // 인증 여부
  isAuthorized: boolean;       // 권한 부여 여부
  message?: string;            // 추가 메시지
}

/**
 * 보안 이벤트 상세 정보 인터페이스
 * 보안 관련 이벤트 추적 및 로깅에 활용
 * 
 * @property userId - 이벤트 관련 사용자 ID (선택적)
 * @property attemptedBoardId - 접근 시도된 게시글 ID (선택적)
 * @property timestamp - 이벤트 발생 시간 (ISO 문자열)
 * @property message - 이벤트 설명 메시지 (선택적)
 * @property errorMessage - 발생한 오류 메시지 (선택적)
 * @property responseStatus - API 응답 상태 코드 (선택적)
 * @property url - 이벤트 발생 URL (선택적)
 * @property userAgent - 사용자 브라우저 정보 (선택적)
 */
export interface SecurityEventDetails {
  userId?: number;             // 사용자 ID
  attemptedBoardId?: string;   // 접근 시도된 게시글 ID
  timestamp: string;           // 이벤트 발생 시간
  message?: string;            // 이벤트 메시지
  errorMessage?: string;       // 에러 메시지
  responseStatus?: number;     // API 응답 상태 코드
  url?: string;                // 요청 URL
  userAgent?: string;          // 사용자 브라우저 정보
}

/**
 * 확장된 리소스 인터페이스 정의
 * 채팅방과 지도 페이지 접근 권한 검사 개선
 * 
 * @property userId - 리소스 소유자 ID
 * @property boardId - 게시글 ID
 * @property chatId - 채팅방 ID
 * @property path - 현재 접근 경로
 * @property type - 리소스 유형 (trade/community/chat)
 * @property writeUserId - 게시글 작성자 ID
 * @property requestUserId - 채팅 요청자 ID
 */
export interface ResourceInfo {
  userId?: number;
  boardId?: string;
  chatId?: string;      // 채팅방 ID 추가
  path?: string;        // 현재 경로 정보 추가
  type?: "trade" | "community" | "chat";
  writeUserId?: number;
  requestUserId?: number;
}

/**
 * AuthGuard 관련 타입
 * 권한 보호 컴포넌트의 Props 정의
 * 
 * @property children - 보호할 자식 컴포넌트
 * @property resource - 보호할 리소스 정보 (선택적)
 * @property requireAuth - 인증 필요 여부 (기본값: true)
 * @property fallback - 권한 없을 때 표시할 컴포넌트 (선택적)
 * @property redirectTo - 인증 실패 시 리다이렉트 경로 (선택적)
 * @property loadingComponent - 로딩 중 표시할 컴포넌트 (선택적)
 */
export interface AuthGuardProps {
  children: ReactNode;
  resource?: ResourceInfo;   // ResourceInfo 타입으로 변경
  requireAuth?: boolean;
  fallback?: ReactNode;
  redirectTo?: string;
  loadingComponent?: ReactNode;
}

/**
 * 채팅방 정보 인터페이스
 * 채팅방 접근 권한 확인을 위한 기본 구조 정의
 * 
 * @property writeUserId - 채팅방 작성자(게시글 작성자) ID
 * @property requestUserId - 채팅 요청자 ID
 * @property roomId - 채팅방 고유 식별자
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
 * 구인/중고 게시글 데이터 구조
 * 
 * @property userId - 작성자 ID
 * @property title - 게시글 제목
 * @property region - 지역 정보
 * @property price - 가격 정보
 * @property contents - 게시글 내용
 * @property images - 이미지 URL 배열
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
 * 커뮤니티 게시글 데이터 구조
 * 
 * @property userId - 작성자 ID
 * @property title - 게시글 제목
 * @property contents - 게시글 내용
 * @property images - 이미지 URL 배열
 */
export interface CommunityData {
  userId: number;
  title: string;
  contents: string;
  images: string[];
}

/**
 * 커뮤니티 게시글 API 응답 구조
 * 
 * @property message - API 응답 메시지
 * @property data - 커뮤니티 게시글 데이터 또는 null
 */
export interface CommunityResponseData {
  message: string;
  data: CommunityData | null;
}

/**
 * 캐시된 게시글 데이터 구조
 * AuthProvider의 게시글 데이터 캐싱에 사용
 * 
 * @property userId - 작성자 ID
 * @property data - 게시글 데이터
 * @property timestamp - 캐싱 시간 (밀리초 단위)
 */
export interface CachedBoardData {
  userId: number;
  data: TradeData;
  timestamp: number;
}

/**
 * 게시글 API 응답 구조
 * 
 * @property message - API 응답 메시지
 * @property data - 게시글 데이터 또는 null
 */
export interface BoardApiResponse {
  message: string;
  data: TradeData | null;
}

/**
 * 컴포넌트 Props 타입
 * AuthProvider 컴포넌트의 Props 정의
 * 
 * @property children - 자식 컴포넌트
 */
export interface AuthProviderProps {
  children: ReactNode;
}