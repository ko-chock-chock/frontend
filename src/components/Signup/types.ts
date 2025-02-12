// src/components/SignUp/types.ts

import { ChangeEvent } from "react";


/**
 * 회원가입 요청 데이터 타입
 * @description POST /api/users/signup 요청 바디
 */

export interface SignUpRequestData {
  email: string; // 이메일
  name: string; // 닉네임
  password: string; // 비밀번호
  confirmPassword: string; // 비밀번호 확인
}

/**
 * 회원가입 폼 데이터 타입
 * @description 실제 폼에서 사용하는 데이터 구조
 */
export interface SignUpFormData {
  email: string; // 이메일 입력 필드명
  name: string; // 닉네임 입력 필드명
  password: string; // 비밀번호 입력 필드명
  passwordConfirm: string; // 비밀번호 확인 입력 필드명
}

/**
 * 회원가입 API 응답 타입
 * @description POST /api/users/signup 성공 응답 (200)
 * @success 응답 바디가 "success" 문자열
 */
export type SignUpResponse = string;

/**
 * API 에러 응답 타입
 * @description 회원가입 실패 시 응답 (400)
 */
export interface SignUpErrorResponse {
  message: string; // 에러 메시지
  data: null; // 데이터 없음
}

/**
 * React Hook Form의 필드 컨트롤러 타입
 * @description form 컨트롤에 필요한 속성들 정의
 */
export interface SignUpFormField {
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
  value: string;
  name: keyof SignUpFormData;
  ref: React.RefCallback<HTMLInputElement>;
}

/**
 * 비밀번호 유효성 검사 결과 타입
 */
export interface PasswordValidation {
  hasMultipleTypes: boolean; // 영문/숫자/특수문자 중 2가지 이상 포함
  hasValidLength: boolean; // 7-32자 길이 제한
  noConsecutive: boolean; // 연속된 문자 3개 이상 사용 금지
}

/**
* ✨ 피드백 메시지 타입
* @property message - 표시할 메시지 내용
* @property type - 메시지 상태 (success | error)
*/
export interface FeedbackMessage {
  message: string;
  type: 'success' | 'error';
}

/**
 * API 응답 상태 코드별 에러 메시지
 */
export const ERROR_MESSAGES = {
  400: "회원가입 형식이 올바르지 않습니다.",
  409: "이미 사용중인 이메일입니다.",
  DEFAULT: "회원가입 처리 중 오류가 발생했습니다.",
} as const;
