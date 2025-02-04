// src/types/auth.ts

// 로그인 요청시 필요한 데이터 타입
export interface LoginRequestType {
  email: string;
  password: string;
}

// 로그인 응답으로 받는 데이터 타입
export interface LoginResponseType {
  accessToken: string;
  refreshToken: string;
}

// 회원가입 요청시 필요한 데이터 타입
export interface SignUpRequestType {
  email: string;
  password: string;
  nickname: string;
}

// 회원가입 응답으로 받는 데이터 타입
export interface SignUpResponseType {
  email: string;
  nickname: string;
}

// 리프레시 토큰으로 새 액세스 토큰 요청시 필요한 타입
export interface RefreshTokenRequestType {
  refreshToken: string;
}

// 리프레시 토큰 응답 타입
export interface RefreshTokenResponseType {
  accessToken: string;
}

// 사용자 정보 타입
export interface UserType {
  id: number;
  email: string;
  nickname: string;
}

// 인증 상태를 관리하기 위한 타입
export interface AuthStateType {
  user: UserType | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
}