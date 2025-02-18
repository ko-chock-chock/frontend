// src/app/test/page.tsx
'use client';

/**
 * 토큰 자동 갱신 테스트 컴포넌트
 * 
 * 주요 기능:
 * 1. 토큰 유효성 검증
 * 2. 토큰 자동 갱신 테스트
 * 3. 사용자 정보 조회 테스트
 * 
 * 테스트 방법:
 * 1. 만료된 토큰을 로컬스토리지에 설정
 * 2. 페이지 새로고침
 * 3. 토큰 갱신 및 API 요청 과정 확인
 */




import { authenticatedFetch, TokenStorage, extractUserIdFromToken, createExpiredToken } from '@/components/auth/utils/tokenUtils';
import { useState, useEffect } from 'react';
import { UserResponse } from '@/components/Login/types';

export default function TestComponent() {
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [responseData, setResponseData] = useState<UserResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const testAuth = async () => {
      try {
        // 토큰 확인 및 강제 만료 처리
        const tokens = TokenStorage.getTokens();
        if (!tokens?.accessToken) {
          throw new Error('토큰이 존재하지 않습니다.');
        }

        // 토큰을 강제로 만료 토큰으로 변경
        const expiredToken = createExpiredToken(tokens.accessToken);
        TokenStorage.setTokens({
          accessToken: expiredToken,
          refreshToken: tokens.refreshToken
        });

        const extractedUserId = extractUserIdFromToken(expiredToken);
        if (!extractedUserId) {
          throw new Error('사용자 ID를 추출할 수 없습니다.');
        }

        setUserId(extractedUserId);
        console.log('[Test] 토큰 확인:', {
          userId: extractedUserId,
          tokenExpired: TokenStorage.isTokenExpired()
        });

        // API 요청 테스트
        const response = await authenticatedFetch(`/api/users/${extractedUserId}`);
        const data = await response.json();
        
        setLoading(false);
        setSuccess(true);
        setResponseData(data);
        console.log('[Test] API 응답:', data);

      } catch (error) {
        setLoading(false);
        setSuccess(false);
        setError(error instanceof Error ? error.message : '알 수 없는 오류');
        console.error('[Test] 에러:', error);
      }
    };

    testAuth();
  }, []);

  if (loading) {
    return <div className="p-4">사용자 정보 로딩 중...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">오류 발생: {error}</div>;
  }

  if (success && responseData) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">토큰 갱신 테스트 결과</h2>
        <div className="mb-4">
          <h3 className="font-semibold">사용자 ID:</h3>
          <p>{userId}</p>
        </div>
        <div>
          <h3 className="font-semibold">사용자 정보:</h3>
          <pre className="bg-gray-100 p-4 rounded mt-2">
            {JSON.stringify(responseData, null, 2)}
          </pre>
        </div>
      </div>
    );
  }

  return null;
}