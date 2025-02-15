// src/components/MypageEdit/types.ts

/**
 * 프로필 수정 폼 데이터 타입
 */
export interface ProfileEditFormData {
  nickname: string;
  currentPassword?: string;
  newPassword?: string;
  profileImage?: File | null;
}

/**
 * 모달 타입 정의
 */
export type ModalType = "logout" | "withdraw" | null;

/**
 * 이름 변경 요청 타입
 * PUT /api/users/name
 */
export interface NameUpdateRequest {
  name: string;
}

/**
 * 비밀번호 변경 요청 타입
 * PUT /api/users/password
 */
export interface PasswordUpdateRequest {
  currentPassword: string;
  newPassword: string;
}

/**
 * 프로필 이미지 업로드 요청 타입
 * PUT /api/users/profile-image
 */
export interface ProfileImageRequest {
  profileImage: string;
}

/**
 * API 응답 타입
 */
export interface ApiResponse {
  message?: string;
  data: null;
}

/**
 * API 에러 응답 타입
 */
export interface ApiErrorResponse {
  message: string;
  data: null;
}

/**
 * 프로필 수정 컴포넌트 Props 타입
 */
export interface ProfileEditProps {
  onClose?: () => void;
}

/**
 * API 엔드포인트 상수
 */
export const API_ENDPOINTS = {
  NAME_UPDATE: '/api/users/name',
  PASSWORD_UPDATE: '/api/users/password',
  PROFILE_IMAGE: '/api/users/profile-image',
  USER_DELETE: '/api/users'
} as const;

/**
 * API 메서드 상수
 */
export const HTTP_METHODS = {
  PUT: 'PUT',
  DELETE: 'DELETE'
} as const;

/**
 * 에러 메시지 상수
 */
export const ERROR_MESSAGES = {
  PASSWORD_MISMATCH: "현재 비밀번호가 일치하지 않습니다.",
  IMAGE_UPLOAD_FAILED: "이미지 업로드에 실패했습니다.",
  PROFILE_UPDATE_FAILED: "프로필 수정에 실패했습니다.",
  INVALID_REQUEST: "요청 본문을 읽을 수 없습니다."
} as const;