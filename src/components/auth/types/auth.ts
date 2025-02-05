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
 * @description login/page.tsx에서 사용
 */
export interface LoginFormData {
  mail: string;
  password: string;
}

/**
 * 회원가입 폼 데이터 타입
 * @description signup/page.tsx에서 사용
 */
export interface SignupFormData {
  mail: string;
  name: string;
  password: string;
  passwordConfirm: string;
}

/**
 * 사용자 프로필 타입
 * @description userStore.ts, ProfileCard.tsx에서 사용
 */
export interface UserProfile {
  user_id: string;
  mail: string;
  name: string;
  profile_image?: string | null;
}

/**
 * JWT 토큰 응답 타입
 * @description login/page.tsx에서 API 응답 처리에 사용
 */
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;  // 추가
  message?: string;
}

/**
 * 권한 체크 결과 타입
 * @description 게시글 수정 등 권한 검증이 필요한 곳에서 사용
 */
export interface AuthCheckResult {
  isAuthenticated: boolean;
  isAuthorized: boolean;
  message?: string;
}

/**
 * 리소스 권한 체크용 타입
 * @description 게시글 수정 등에서 사용되는 권한 체크 데이터 구조
 */
export interface AuthorizedResource {
  userId: string;      // 리소스 소유자 ID
  resourceType: 'post';  // 현재는 post만 사용
  resourceId: string;  // 리소스 ID
}