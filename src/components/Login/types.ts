// src/components/Login/types.ts /

import { ChangeEvent } from 'react';

/**
 * 로그인 폼 데이터 타입
 */
export interface LoginFormData {
  email: string;
  password: string;
}

/**
 * 로그인 API 응답 타입
 * POST /api/users/login
 * @success 200
 */
export interface LoginResponse {
  name: string;
  profileImage: string;
  accessToken: string;
  refreshToken: string;
}

/**
 * API 에러 응답 타입
 * @error 400 | 401 | 404
 */
export interface LoginErrorResponse {
  message: string;
  data: null;
}

/**
 * 사용자 정보 조회 API 응답 타입
 * GET /api/users/{userId}
 * @success 200
 */
export interface UserResponse {
  id: number;
  email: string;
  name: string;
  profileImage: string;
}

/**
 * 컨트롤러 필드 타입 정의
 */
export interface LoginFormField {
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
  value: string;
  name: keyof LoginFormData;
  ref: React.RefCallback<HTMLInputElement>;
}

/**
 * API 응답 상태 코드별 에러 메시지
 */
export const ERROR_MESSAGES = {
  400: "이메일 또는 비밀번호가 올바르지 않습니다",
  401: "인증에 실패했습니다",
  404: "등록되지 않은 사용자입니다",
  DEFAULT: "로그인 처리 중 오류가 발생했습니다"
} as const;