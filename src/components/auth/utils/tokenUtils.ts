// src/components/auth/utils/tokenUtils.ts

/**
 * JWT 토큰 관리 및 API 인증 유틸리티
 *
 * 주요 기능:
 * 1. 토큰 저장 및 관리 (TokenStorage)
 * 2. 토큰 자동 갱신
 * 3. 인증된 API 요청 처리
 * 4. 사용자 인증 상태 관리
 *
 * 수정사항 (2024.02.04):
 * - credentials: 'include' 제거로 CORS 이슈 해결
 * - 토큰 갱신 로직 개선
 * - 에러 처리 강화
 * - 디버깅 로그 추가
 */

import { AuthResponse, AuthCheckResult } from "../types/auth";
import { useUserStore } from "../../../commons/store/userStore";

// API 설정
const API_BASE_URL = "http://3.36.40.240:8001";
const API_CONFIG = {
  AUTH: {
    SIGNUP: "/api/users/signup",
    LOGIN: "/api/users/login",
    REFRESH: "/api/users/refresh-token",
  },
  USER: {
    DELETE: "/api/users",
    UPDATE: {
      PROFILE_IMAGE: "/api/users/profile-image",
      PASSWORD: "/api/users/password",
      NAME: "/api/users/name",
    },
  },
};

/**
 * 토큰 데이터 인터페이스
 */
interface TokenData {
  accessToken: string;
  refreshToken: string;
  timestamp: number; // 토큰 저장 시점
}

// 테스트용 만료 토큰 생성 함수 추가
export const createExpiredToken = (originalToken: string): string => {
  try {
    const tokenParts = originalToken.split(".");
    const payload = JSON.parse(atob(tokenParts[1]));

    // 현재 시간보다 5분 전으로 만료 시간 설정
    payload.exp = Math.floor(Date.now() / 1000) - 60 * 5;

    const modifiedPayloadBase64 = btoa(JSON.stringify(payload));

    return `${tokenParts[0]}.${modifiedPayloadBase64}.${tokenParts[2]}`;
  } catch (error) {
    console.error("[Token] 만료 토큰 생성 실패:", error);
    return originalToken;
  }
};

/**
 * 토큰 저장소 - localStorage 기반 토큰 관리
 */
export const TokenStorage = {
  /**
   * 토큰 저장
   * @param tokens accessToken과 refreshToken을 포함한 객체
   */
  setTokens: (tokens: { accessToken: string; refreshToken: string }) => {
    try {
      const tokenData: TokenData = {
        ...tokens,
        timestamp: new Date().getTime(),
      };
      localStorage.setItem("token-storage", JSON.stringify(tokenData));
      console.log("[TokenStorage] 토큰 저장 완료:", {
        storedAt: new Date().toISOString(),
        accessTokenLength: tokens.accessToken.length,
        refreshTokenLength: tokens.refreshToken.length, // 추가된 로그
      });
    } catch (error) {
      console.error("[TokenStorage] 토큰 저장 실패:", error);
      throw new Error("토큰 저장 중 오류가 발생했습니다."); // 에러 처리 추가
    }
  },

  /**
   * 저장된 토큰 조회
   */
  getTokens: (): TokenData | null => {
    try {
      const tokens = localStorage.getItem("token-storage");
      const parsedTokens = tokens ? JSON.parse(tokens) : null;

      // 디버깅을 위한 로그 추가
      if (parsedTokens) {
        console.log("[TokenStorage] 토큰 조회 성공:", {
          hasAccessToken: !!parsedTokens.accessToken,
          hasRefreshToken: !!parsedTokens.refreshToken,
          timestamp: new Date(parsedTokens.timestamp).toISOString(),
        });
      } else {
        console.log("[TokenStorage] 저장된 토큰 없음");
      }

      return parsedTokens;
    } catch (error) {
      console.error("[TokenStorage] 토큰 가져오기 실패:", error);
      return null;
    }
  },

  /**
   * AccessToken만 조회
   */
  getAccessToken: (): string | null => {
    const tokens = TokenStorage.getTokens();
    if (tokens?.accessToken) {
      console.log("[TokenStorage] AccessToken 조회 성공");
      return tokens.accessToken;
    }
    console.log("[TokenStorage] AccessToken 없음");
    return null;
  },

  /**
   * 모든 토큰 삭제
   */
  clearTokens: () => {
    try {
      localStorage.removeItem("token-storage");
      console.log("[TokenStorage] 토큰 삭제 완료");
    } catch (error) {
      console.error("[TokenStorage] 토큰 삭제 실패:", error);
      throw new Error("토큰 삭제 중 오류가 발생했습니다."); // 에러 처리 추가
    }
  },

  /**
   * AccessToken 만료 여부 체크
   * @returns boolean - true: 만료됨, false: 유효함
   */
  isTokenExpired: (): boolean => {
    try {
      const tokens = TokenStorage.getTokens();
      if (!tokens?.accessToken) {
        console.log("[Token] 토큰 없음");
        return true;
      }

      const payload = JSON.parse(atob(tokens.accessToken.split(".")[1]));
      const expTime = payload.exp * 1000; // 초 단위를 밀리초로 변환
      const currentTime = Date.now();
      const remainingTime = Math.floor((expTime - currentTime) / 1000 / 60); // 분 단위로 변환

      console.log("[Token] 만료 시간 체크:", {
        현재시간: new Date(currentTime).toISOString(),
        만료시간: new Date(expTime).toISOString(),
        남은시간: `${remainingTime}분`,
      });

      // 토큰 만료 5분 전부터 갱신 시도
      return remainingTime <= 5;
    } catch (error) {
      console.error("[Token] 토큰 만료 체크 실패:", error);
      return true;
    }
  },
};

/**
 * AccessToken 재발급 함수
 * @returns Promise<string | null> 새로운 accessToken 또는 null
 */
const refreshAccessToken = async (): Promise<string | null> => {
  try {
    console.log("[Token] 토큰 갱신 시작");
    const tokens = TokenStorage.getTokens();
    if (!tokens?.refreshToken) {
      console.log("[Token] RefreshToken 없음");
      return null;
    }

    const response = await fetch(
      `${API_BASE_URL}/api/users/refresh-token?refreshToken=${tokens.refreshToken}`,
      {
        method: "GET",
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error("[Token] 토큰 갱신 실패:", errorData);

      if (response.status === 400) {
        console.log("[Token] RefreshToken 유효하지 않음");
        TokenStorage.clearTokens();
        return null;
      }

      throw new Error(errorData || "토큰 갱신 실패");
    }

    const newAccessToken = await response.text();
    console.log("[Token] 새로운 AccessToken 발급 성공");

    // 새로운 토큰 저장 (refreshToken은 유지)
    TokenStorage.setTokens({
      accessToken: newAccessToken,
      refreshToken: tokens.refreshToken,
    });

    return newAccessToken;
  } catch (error) {
    console.error("[Token] 토큰 갱신 중 에러:", error);
    TokenStorage.clearTokens();
    return null;
  }
};

/**
 * JWT 토큰에서 사용자 ID 추출
 */
export const extractUserIdFromToken = (token: string): number | null => {
  try {
    const tokenParts = token.split(".");
    const payload = JSON.parse(atob(tokenParts[1]));
    return payload.sub ? Number(payload.sub) : null;
  } catch (error) {
    console.error("[TokenUtils] 토큰 파싱 실패:", error);
    return null;
  }
};

/**
 * 인증 상태 확인
 * @returns Promise<AuthCheckResult>
 */
export const checkAuthStatus = async (): Promise<AuthCheckResult> => {
  try {
    const tokens = TokenStorage.getTokens();
    console.log(
      "[AuthCheck] 토큰 확인:",
      tokens?.accessToken ? "존재" : "없음"
    );

    if (tokens?.accessToken && TokenStorage.isTokenExpired()) {
      console.log("[AuthCheck] 토큰 만료됨, 갱신 시도");
      const newToken = await refreshAccessToken();
      if (newToken) {
        return {
          isAuthenticated: true,
          isAuthorized: true,
        };
      }
    }

    const isAuthenticated =
      !!tokens?.accessToken && !TokenStorage.isTokenExpired();

    // Zustand store 확인
    const store = useUserStore.getState();
    console.log("[AuthCheck] Store 상태:", {
      hasUser: !!store.user,
      timestamp: new Date().toISOString(),
    });

    return {
      isAuthenticated,
      isAuthorized: isAuthenticated,
      message: isAuthenticated ? undefined : "로그인이 필요합니다",
    };
  } catch (error) {
    console.error("[AuthCheck] 인증 상태 확인 실패:", error);
    return {
      isAuthenticated: false,
      isAuthorized: false,
      message: "인증 확인 중 오류 발생",
    };
  }
};

/**
 * 인증된 API 요청 함수
 * - 토큰 만료 시 자동 갱신
 * - 갱신 실패 시 로그인 페이지 이동
 */
export const authenticatedFetch = async (
  url: string,
  options: RequestInit = {},
  retryCount = 1
): Promise<Response> => {
  try {
    const token = TokenStorage.getAccessToken();
    if (!token) {
      console.log("[Auth] 토큰 없음");
      throw new Error("인증이 필요합니다");
    }

    // 요청 전에 토큰 만료 여부 확인
    if (TokenStorage.isTokenExpired()) {
      console.log("[Auth] 토큰 만료됨, 갱신 시도");
      const newToken = await refreshAccessToken();
      if (!newToken) {
        window.location.href = "/login";
        throw new Error("세션이 만료되었습니다.");
      }
    }

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TokenStorage.getAccessToken()}`,
      ...options.headers,
    };

    // credentials: 'include' 제거하여 CORS 이슈 해결
    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers,
    });

    // API 응답 로깅
    console.log("[Auth] API 응답:", {
      url,
      status: response.status,
      statusText: response.statusText,
      timestamp: new Date().toISOString(),
    });

    if (response.status === 401 && retryCount > 0) {
      console.log("[Auth] 401 응답, 토큰 갱신 후 재시도");
      const newToken = await refreshAccessToken();

      if (newToken) {
        return authenticatedFetch(url, options, retryCount - 1);
      } else {
        window.location.href = "/login";
        throw new Error("세션이 만료되었습니다.");
      }
    }

    return response;
  } catch (error) {
    console.error("[Auth] Request failed:", error);
    throw error;
  }
};

/**
 * API 응답에서 토큰 처리
 */
export const handleAuthResponse = (response: AuthResponse) => {
  try {
    if (response.accessToken) {
      TokenStorage.setTokens({
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
      });
      return extractUserIdFromToken(response.accessToken);
    }
    return null;
  } catch (error) {
    console.error("[Auth] 응답 처리 실패:", error);
    return null;
  }
};
