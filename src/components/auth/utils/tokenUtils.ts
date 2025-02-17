// src/components/auth/utils/tokenUtils.ts

/**
 * JWT 토큰 관리 유틸리티
 *
 * 주요 기능:
 * 1. 안전하고 투명한 토큰 저장 및 관리 (로컬스토리지 기반)
 * 2. 토큰 만료 자동 체크 및 갱신 메커니즘
 * 3. 보안 강화를 위한 토큰 사용 추적 및 로깅
 * 4. 최대 토큰 갱신 시도 횟수 제한
 * 5. 인증된 API 요청 처리
 * 6. 사용자 인증 상태 종합 관리
 *
 * 설계 목적:
 * - 클라이언트 사이드 인증 보안 강화
 * - 사용자 세션 안전성 확보
 * - 원활하고 안전한 인증 흐름 제공
 */

import {
  AuthResponse,
  AuthCheckResult,
  TokenData,
  TokenRefreshState,
  SecurityEventDetails,
} from "@/components/auth/types/auth";
import { useUserStore } from "@/commons/store/userStore";

// 토큰 갱신 설정 상수
const TOKEN_REFRESH_CONFIG = {
  MAX_ATTEMPTS: 3, // 최대 토큰 갱신 시도 횟수
  RESET_INTERVAL: 5 * 60 * 1000, // 시도 횟수 초기화 간격 (5분)
};

// 토큰 갱신 상태 초기화
let tokenRefreshState: TokenRefreshState = {
  lastAttemptTime: 0,
  attemptCount: 0,
};

/**
 * 보안 이벤트 로깅 함수
 * 현재는 콘솔에만 로깅하도록 구현
 *
 * @param eventType - 보안 이벤트 유형
 * @param details - 이벤트 상세 정보
 */
const logSecurityEvent = (eventType: string, details: SecurityEventDetails) => {
  // 기본 로그 데이터 구성
  const logData = {
    type: eventType,
    ...details,
  };

  // 일반 로그
  console.log("[Token Security Event]", logData);

  // 토큰 관련 중요 이벤트는 경고 레벨로 로깅
  if (
    eventType.includes("TOKEN_REFRESH_LIMIT_EXCEEDED") ||
    eventType.includes("TOKEN_REFRESH_FAILED") ||
    eventType.includes("TOKEN_REFRESH_ERROR")
  ) {
    console.warn("⚠️ Token Security Warning:", logData);
  }
};

/**
 * 테스트 및 개발 환경을 위한 만료 토큰 생성 함수
 *
 * @param originalToken 원본 토큰
 * @returns 만료된 상태의 토큰
 */
export const createExpiredToken = (originalToken: string): string => {
  try {
    // 토큰을 . 기준으로 분리
    const tokenParts = originalToken.split(".");

    // Base64 디코딩 후 페이로드 추출
    const payload = JSON.parse(atob(tokenParts[1]));

    // 만료 시간을 현재 시간보다 5분 이전으로 설정
    payload.exp = Math.floor(Date.now() / 1000) - 60 * 5;

    // 수정된 페이로드를 다시 Base64 인코딩
    const modifiedPayloadBase64 = btoa(JSON.stringify(payload));

    // 원본 토큰 헤더, 수정된 페이로드, 원본 서명으로 재구성
    return `${tokenParts[0]}.${modifiedPayloadBase64}.${tokenParts[2]}`;
  } catch (error) {
    console.error("[Token] 만료 토큰 생성 실패:", error);
    return originalToken;
  }
};

// 토큰 저장소 관리 객체
export const TokenStorage = {
  /**
   * 토큰 저장 메서드
   * 로컬스토리지에 토큰과 타임스탬프 저장
   *
   * @param tokens 액세스 및 리프레시 토큰
   */
  setTokens: (tokens: { accessToken: string; refreshToken: string }) => {
    try {
      // 토큰 데이터에 현재 타임스탬프 추가
      const tokenData: TokenData = {
        ...tokens,
        timestamp: new Date().getTime(),
      };

      // 로컬스토리지에 토큰 정보 저장
      localStorage.setItem("token-storage", JSON.stringify(tokenData));

      // 저장 로그 (보안을 위해 토큰 길이만 로깅)
      console.log("[TokenStorage] 토큰 저장 완료:", {
        storedAt: new Date().toISOString(),
        accessTokenLength: tokens.accessToken.length,
        refreshTokenLength: tokens.refreshToken.length,
      });
    } catch (error) {
      console.error("[TokenStorage] 토큰 저장 실패:", error);
      throw new Error("토큰 저장 중 오류가 발생했습니다.");
    }
  },

  /**
   * 저장된 토큰 정보 조회
   *
   * @returns 저장된 토큰 데이터 또는 null
   */
  getTokens: (): TokenData | null => {
    try {
      const tokens = localStorage.getItem("token-storage");
      const parsedTokens = tokens ? JSON.parse(tokens) : null;

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
   * 액세스 토큰 단독 조회
   *
   * @returns 액세스 토큰 또는 null
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
   * 모든 토큰 정보 삭제
   */
  clearTokens: () => {
    try {
      localStorage.removeItem("token-storage");
      console.log("[TokenStorage] 토큰 삭제 완료");
    } catch (error) {
      console.error("[TokenStorage] 토큰 삭제 실패:", error);
      throw new Error("토큰 삭제 중 오류가 발생했습니다.");
    }
  },

  /**
   * 토큰 만료 여부 확인
   *
   * @returns 토큰 만료 상태 (true: 만료, false: 유효)
   */
  isTokenExpired: (): boolean => {
    try {
      const tokens = TokenStorage.getTokens();
      if (!tokens?.accessToken) {
        console.log("[Token] 토큰 없음");
        return true;
      }

      const parts = tokens.accessToken.split(".");
      const payload = JSON.parse(atob(parts[1]));

      const expTimeSeconds = payload.exp;
      const currentTimeSeconds = Math.floor(Date.now() / 1000);
      const remainingSeconds = expTimeSeconds - currentTimeSeconds;

      console.log("[Token] 만료 체크:", {
        현재시간: new Date(currentTimeSeconds * 1000).toISOString(),
        만료시간: new Date(expTimeSeconds * 1000).toISOString(),
        남은초: remainingSeconds,
        남은분: Math.floor(remainingSeconds / 60),
        시간차이:
          ((expTimeSeconds - currentTimeSeconds) / 60).toFixed(2) + "분",
        만료여부:
          remainingSeconds <= 0
            ? "만료됨"
            : remainingSeconds <= 300
            ? "만료 임박"
            : "유효함",
      });

      return remainingSeconds <= 0 || remainingSeconds <= 300;
    } catch (error) {
      console.error("[Token] 토큰 만료 체크 실패:", error);
      return true;
    }
  },
};

/**
 * 액세스 토큰 자동 갱신 함수
 * 토큰 갱신 시도 횟수 제한 및 보안 로깅 추가
 *
 * @returns 새로 발급된 액세스 토큰 또는 null
 */
export const refreshAccessToken = async (): Promise<string | null> => {
  const now = Date.now();

  // 토큰 갱신 시도 횟수 초기화 로직
  if (
    now - tokenRefreshState.lastAttemptTime >
    TOKEN_REFRESH_CONFIG.RESET_INTERVAL
  ) {
    tokenRefreshState = { lastAttemptTime: now, attemptCount: 0 };
  }

  // 최대 갱신 시도 횟수 초과 시 처리
  if (tokenRefreshState.attemptCount >= TOKEN_REFRESH_CONFIG.MAX_ATTEMPTS) {
    console.error("[Token] 토큰 갱신 최대 시도 횟수 초과");
    TokenStorage.clearTokens();

    // 보안 이벤트 로깅
    // 1. TOKEN_REFRESH_LIMIT_EXCEEDED 케이스
    logSecurityEvent("TOKEN_REFRESH_LIMIT_EXCEEDED", {
      message: "토큰 갱신 최대 시도 횟수 초과",
      timestamp: new Date().toISOString(), // timestamp 추가
    });

    window.location.href = "/login";
    return null;
  }

  // 갱신 시도 횟수 및 시간 업데이트
  tokenRefreshState.attemptCount++;
  tokenRefreshState.lastAttemptTime = now;

  try {
    const tokens = TokenStorage.getTokens();
    if (!tokens?.refreshToken) {
      console.log("[Token] RefreshToken 없음");
      window.location.href = "/login";
      return null;
    }

    const response = await fetch(
      `/api/users/refresh-token?refreshToken=${tokens.refreshToken}`,
      {
        method: "GET",
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      console.error("[Token] 토큰 갱신 실패");
      TokenStorage.clearTokens();

      // 토큰 갱신 실패 보안 이벤트 로깅
      // 2. TOKEN_REFRESH_FAILED 케이스
      logSecurityEvent("TOKEN_REFRESH_FAILED", {
        responseStatus: response.status,
        timestamp: new Date().toISOString(), // timestamp 추가
      });

      window.location.href = "/login";
      return null;
    }

    const newAccessToken = await response.text();
    console.log("[Token] 새로운 AccessToken 발급 성공");

    TokenStorage.setTokens({
      accessToken: newAccessToken,
      refreshToken: tokens.refreshToken,
    });

    return newAccessToken;
  } catch (error) {
    console.error("[Token] 토큰 갱신 중 에러");
    TokenStorage.clearTokens();

    // 예외 발생 보안 이벤트 로깅
    // 3. TOKEN_REFRESH_ERROR 케이스
    logSecurityEvent("TOKEN_REFRESH_ERROR", {
      errorMessage: error instanceof Error ? error.message : "알 수 없는 오류", // error를 errorMessage로 수정
      timestamp: new Date().toISOString(), // timestamp 추가
    });

    window.location.href = "/login";
    return null;
  }
};

/**
 * 토큰에서 사용자 ID 추출
 *
 * @param token JWT 토큰
 * @returns 사용자 ID 또는 null
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
 * 사용자 인증 상태 확인
 *
 * @returns 인증 상태 정보
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
 *
 * @param url API 엔드포인트
 * @param options 요청 옵션
 * @param retryCount 토큰 갱신 재시도 횟수
 * @returns API 응답
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

    // 토큰 사용 로깅 추가
    console.log("[Auth] 토큰 사용 로그", {
      url,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
    });

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

    const response = await fetch(`${url}`, {
      ...options,
      headers,
    });

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
 * 인증 응답 처리 함수
 *
 * @param response 인증 응답 데이터
 * @returns 추출된 사용자 ID 또는 null
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
