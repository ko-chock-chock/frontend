// src/commons/fetchInterceptor.ts

import { TokenStorage } from '../components/auth/utils/tokenUtils';

/**
 * fetch API 인터셉터 설정
 * 
 * 주요 기능:
 * 1. 팀원들의 기존 fetch 코드를 그대로 사용 가능
 * 2. 토큰 만료시 자동 갱신
 * 3. 401 에러 자동 처리
 * 4. /api로 시작하지 않는 요청은 인터셉터 제외
 * 
 * 작동 원리:
 * - 전역 fetch 메서드를 오버라이드하여 토큰 관리 로직 추가
 * - 모든 API 요청에 대해 토큰 유효성 자동 체크
 * - 만료된 토큰은 자동으로 갱신
 * - 인증 관련 에러 발생 시 로그인 페이지로 리다이렉트
 */
const setupInterceptor = () => {
  // 원본 fetch 메서드 백업
  const originalFetch = window.fetch;

  // 전역 fetch 메서드 오버라이드
  window.fetch = async (input: RequestInfo | URL, init: RequestInit = {}) => {
    try {
      const url = input.toString();
      
      // API 요청이 아닌 경우 원본 fetch 그대로 사용
      if (!url.startsWith('/api')) {
        return originalFetch(input, init);
      }

      // 특정 엔드포인트(로그인, 회원가입, 토큰 갱신)는 인터셉터 제외
      if (
        url.includes('/api/users/login') || 
        url.includes('/api/users/signup') ||
        url.includes('/api/users/refresh-token')
      ) {
        return originalFetch(input, init);
      }

      // 현재 토큰 상태 확인
      let currentToken = TokenStorage.getAccessToken();

      // 요청 헤더의 Authorization 토큰 확인
      const headers = init.headers as Record<string, string>;
      const requestToken = headers?.Authorization?.split(' ')[1];
      
      // 토큰 로깅 (보안을 위해 일부만 표시)
      console.log('[Fetch] 요청 토큰 확인:', {
        url,
        method: init.method || 'GET',
        토큰미리보기: requestToken ? `${requestToken.substring(0, 20)}...` : 'none'
      });

      // 토큰 없을 경우 로그인 페이지로 리다이렉트
      if (!currentToken) {
        console.log('[Fetch] 토큰 없음');
        window.location.href = '/login';
        throw new Error('인증이 필요합니다.');
      }

      // 토큰 만료 체크 및 자동 갱신
      if (TokenStorage.isTokenExpired()) {
        console.log('[Fetch] 토큰 만료 감지, 갱신 시도');
        
        try {
          const tokens = TokenStorage.getTokens();
          if (!tokens?.refreshToken) {
            throw new Error('갱신 토큰 없음');
          }

          // 토큰 갱신 요청
          const refreshResponse = await originalFetch(
            `/api/users/refresh-token?refreshToken=${tokens.refreshToken}`,
            {
              method: 'GET',
              headers: {
                'Accept': '*/*'
              }
            }
          );

          // 토큰 갱신 실패 처리
          if (!refreshResponse.ok) {
            const errorText = await refreshResponse.text();
            console.error('[Fetch] 토큰 갱신 실패:', errorText);
            throw new Error('토큰 갱신 실패');
          }

          // 새 토큰 발급 및 저장
          const newToken = await refreshResponse.text();
          console.log('[Fetch] 새 토큰 발급 성공');
          
          TokenStorage.setTokens({
            accessToken: newToken,
            refreshToken: tokens.refreshToken
          });

          currentToken = newToken;
          console.log('[Fetch] 토큰 갱신 완료');
        } catch (error) {
          console.error('[Fetch] 토큰 갱신 중 에러:', error);
          TokenStorage.clearTokens();
          window.location.href = '/login';
          throw new Error('세션이 만료되었습니다.');
        }
      }

      // 최신 토큰으로 요청 헤더 업데이트
      const newHeaders = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${currentToken}`,
        ...(headers || {})
      };

      // 업데이트된 토큰으로 API 요청 실행
      console.log('[Fetch] API 요청 실행:', {
        url,
        method: init.method || 'GET',
        토큰상태: TokenStorage.isTokenExpired() ? '만료됨' : '유효함',
        요청토큰: currentToken.substring(0, 20) + '...'
      });

      const response = await originalFetch(input, {
        ...init,
        headers: newHeaders
      });

      // 401 에러 발생 시 로그인 페이지로 리다이렉트
      if (response.status === 401) {
        console.log('[Fetch] 401 응답 수신');
        TokenStorage.clearTokens();
        window.location.href = '/login';
        throw new Error('인증이 필요합니다.');
      }

      // API 응답 로깅
      console.log('[Fetch] API 응답 완료:', {
        url,
        status: response.status,
        statusText: response.statusText
      });

      return response;
    } catch (error) {
      console.error('[Fetch] 요청 실패:', error);
      throw error;
    }
  };
};

// 클라이언트 사이드에서만 인터셉터 설정
if (typeof window !== 'undefined') {
  setupInterceptor();
}

export default setupInterceptor;