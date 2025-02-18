// src/commons/fetch-interceptor.ts
"use client";

/**
* Fetch 인터셉터 유틸리티
* 
* 주요 기능:
* 1. 모든 API 요청에 대한 전역 인터셉터 설정
* 2. JWT 토큰 기반 인증 관리
* 3. 토큰 만료 자동 갱신 
* 4. 인증 오류에 대한 사용자 알림 및 리다이렉트
* 5. 보안 강화를 위한 요청/응답 인터셉션
* 6. 클라이언트 사이드 토큰 관리
* 7. 무중단 세션 유지
* 
* @description 
* - 모든 API 요청을 중간에 가로채어 토큰 검증 및 갱신
* - 인증 실패 시 자동으로 로그인 페이지로 리다이렉트
* - 보안 및 사용자 경험 최적화
*/

import { TokenStorage, refreshAccessToken } from '../components/auth/utils/tokenUtils';
import { useUserStore } from '@/commons/store/userStore';
import toast from 'react-hot-toast';

/**
* Fetch 인터셉터 설정 함수
* 
* @description 
* - window.fetch를 오버라이딩하여 전역 인터셉터 구현
* - 모든 API 요청에 대해 토큰 검증 및 갱신 로직 적용
*/
const setupInterceptor = () => {
 // 원본 fetch 메서드 저장
 const originalFetch = window.fetch;

 // fetch 메서드 재정의
 window.fetch = async (input: RequestInfo | URL, init: RequestInit = {}) => {
   try {
     const url = input.toString();
     
     // 파일 업로드 요청 감지 (FormData 사용 여부)
      // 디버깅 추가
    const isFileUpload = init.body instanceof FormData;
    console.log('[FetchInterceptor] 요청 감지:', {
      url,
      method: init.method || 'GET',
      isFileUpload,
      bodyType: init.body ? typeof init.body : 'none',
      headers: init.headers
    });
     
     // 특정 API 경로 제외 처리
     // 로그인, 회원가입, 토큰 갱신 API는 별도 처리
     if (!url.startsWith('/api') || 
         ['/api/users/login', '/api/users/signup', '/api/users/refresh-token']
         .some(path => url.includes(path))) {
       return originalFetch(input, init);
     }
     
     // 파일 업로드 요청이면 Content-Type 헤더를 설정하지 않고 토큰만 추가
     if (isFileUpload) {
       const token = TokenStorage.getAccessToken();
       // 원본 헤더 유지
       const originalHeaders = init.headers || {};
       
       // 새 헤더 객체 생성 (Content-Type은 자동 설정되도록 생략)
       const headers: Record<string, string> = {};
       
       // 원본 헤더의 각 항목을 새 헤더에 복사 (Content-Type 제외)
       if (originalHeaders instanceof Headers) {
         originalHeaders.forEach((value, key) => {
           if (key.toLowerCase() !== 'content-type') {
             headers[key] = value;
           }
         });
       } else if (typeof originalHeaders === 'object') {
         Object.entries(originalHeaders).forEach(([key, value]) => {
           if (key.toLowerCase() !== 'content-type') {
             headers[key] = value as string;
           }
         });
       }
       
       // 토큰이 있으면 Authorization 헤더 추가
       if (token) {
         headers['Authorization'] = `Bearer ${token}`;
       }
       
       // 새 요청 옵션 생성
       const newInit = {
         ...init,
         headers
       };
       
       return originalFetch(input, newInit);
     }

     /**
      * 토큰 및 사용자 정보 사전 검증 함수
      * 
      * @description
      * - 토큰 존재 여부 확인
      * - 토큰 만료 체크 
      * - 필요 시 자동 갱신
      * - 사용자 정보 동기화
      */
     const validateTokenAndUser = async () => {
       // 현재 토큰 및 사용자 상태 조회
       const currentToken = TokenStorage.getAccessToken();
       const userStore = useUserStore.getState();

       // 토큰 없음 처리
       if (!currentToken) {
         toast.error('로그인이 필요합니다.');
         window.location.href = '/login';
         throw new Error('No token');
       }

       // 토큰 만료 시 자동 갱신
       if (TokenStorage.isTokenExpired()) {
         console.log('[Fetch] 토큰 만료 감지, 자동 갱신 시도');
         
         const newToken = await refreshAccessToken();
         
         // 토큰 갱신 실패 처리
         if (!newToken) {
           userStore.clearUser();
           toast.error('세션이 만료되었습니다. 다시 로그인해주세요.');
           window.location.href = '/login';
           throw new Error('Token refresh failed');
         }
         
         return newToken;
       }
       
       // 사용자 정보 자동 갱신
       if (userStore.user && TokenStorage.isTokenExpired()) {
         await userStore.fetchUserInfo();
       }
       
       return currentToken;
     };

     // 토큰 갱신 및 요청
     const token = await validateTokenAndUser();
     
     // 요청 헤더에 갱신된 토큰 추가
     const requestOptions = {
       ...init,
       headers: {
         'Content-Type': 'application/json',
         'Authorization': `Bearer ${token}`,
         'Accept': '*/*',
         ...(init.headers || {})
       }
     };

     // 원본 fetch 호출
     const response = await originalFetch(input, requestOptions);

     // 추가 에러 처리
     if (!response.ok) {
       const errorText = await response.clone().text();
       
       // 토큰 관련 오류 재시도
       if (errorText.includes('토큰') || response.status === 401) {
         const refreshedToken = await refreshAccessToken();
         
         if (refreshedToken) {
           requestOptions.headers['Authorization'] = `Bearer ${refreshedToken}`;
           return originalFetch(input, requestOptions);
         }
       }
     }

     return response;

   } catch (error) {
     // 전역 에러 핸들링
     console.error('[Fetch Interceptor] 요청 중 오류:', error);
     
     // 에러 타입별 처리
     if (error instanceof Error) {
       switch (error.message) {
         case 'No token':
         case 'Token refresh failed':
           window.location.href = '/login';
           break;
         default:
           toast.error('요청 처리 중 오류가 발생했습니다.');
       }
     }
     
     throw error;
   }
 };
};

// 브라우저 환경에서만 인터셉터 설정
if (typeof window !== 'undefined') {
 setupInterceptor();
}

export default setupInterceptor;