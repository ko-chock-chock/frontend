// src/components/auth/components/AuthProvider.tsx
"use client";

/**
 * AuthProvider 컴포넌트
 * 애플리케이션의 인증/인가 상태를 관리하는 최상위 컴포넌트
 * 
 * 주요 기능:
 * 1. 리소스별 권한 검증 (게시글, 프로필 등)
 * 2. 페이지 접근 제어
 * 3. 토큰 유효성 검증
 * 
 * 수정사항 (2024.02.04):
 * - TokenStorage로 토큰 관리 일원화
 * - 권한 체크 로직 최적화
 * - 캐싱 메커니즘 추가
 * - 에러 처리 강화
 */

import { usePathname, useParams, useRouter } from "next/navigation";
import { useEffect, useCallback, useRef } from "react";
import { TokenStorage } from "../utils/tokenUtils";
import { useUserStore } from "@/commons/store/userStore";

interface AuthProviderProps {
  children: React.ReactNode;
}

// 게시글 데이터 캐싱을 위한 인터페이스
interface BoardData {
  userId: number;
  data: any;
  timestamp: number;
}

/**
 * 권한이 필요한 경로 패턴 정의
 */
const PROTECTED_PATHS = {
  EDIT_POST: /^\/jobList\/.*\/edit$/,
  USER_PROFILE: /^\/mypage\/.*$/
};

/**
 * 캐시 유효 시간 (5분)
 */
const CACHE_DURATION = 5 * 60 * 1000;

const AuthProvider = ({ children }: AuthProviderProps) => {
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  
  // 게시글 데이터 캐시
  const boardCache = useRef<Map<string, BoardData>>(new Map());

  /**
   * 게시글 데이터 조회 함수
   * 캐싱 메커니즘 포함
   */
  const fetchBoardData = useCallback(async (boardId: string): Promise<any> => {
    try {
      // 캐시 확인
      const cached = boardCache.current.get(boardId);
      const now = Date.now();
      
      if (cached && (now - cached.timestamp < CACHE_DURATION)) {
        console.log('[AuthProvider] 캐시된 게시글 데이터 사용:', boardId);
        return cached.data;
      }

      // 토큰 가져오기
      const tokens = TokenStorage.getTokens();
      if (!tokens?.accessToken) {
        throw new Error('인증 토큰이 없습니다.');
      }

      console.log('[AuthProvider] 게시글 데이터 요청:', boardId);
      const response = await fetch(
        `http://13.209.11.201:8001/api/trade/${boardId}`,
        {
          headers: {
            Authorization: `Bearer ${tokens.accessToken}`
          }
        }
      );

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`게시글 조회 실패: ${errorData}`);
      }

      const data = await response.json();
      
      // 캐시 업데이트
      boardCache.current.set(boardId, {
        userId: data.userId,
        data,
        timestamp: now
      });

      return data;
    } catch (error) {
      console.error('[AuthProvider] 게시글 조회 실패:', error);
      throw error;
    }
  }, []);

  /**
   * 리소스 접근 권한 검증
   */
  const checkResourcePermission = useCallback(async () => {
    try {
      // 게시글 수정 페이지 권한 체크
      if (PROTECTED_PATHS.EDIT_POST.test(pathname)) {
        const boardId = params.boardId as string;
        console.log('[AuthProvider] 게시글 수정 권한 체크:', boardId);

        const boardData = await fetchBoardData(boardId);
        const isAuthorized = user?.id === boardData.userId;

        console.log('[AuthProvider] 권한 체크 결과:', {
          userId: user?.id,
          authorId: boardData.userId,
          isAuthorized
        });

        if (!isAuthorized) {
          alert('게시글 수정 권한이 없습니다.');
          router.push('/');
          return false;
        }
      }

      // 사용자 프로필 페이지 권한 체크
      if (PROTECTED_PATHS.USER_PROFILE.test(pathname)) {
        const profileId = params.userId as string;
        if (user?.id !== Number(profileId)) {
          router.push('/');
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error('[AuthProvider] 권한 체크 실패:', error);
      router.push('/');
      return false;
    }
  }, [pathname, params, router, user, fetchBoardData]);

  // 페이지 접근 시 권한 체크
  useEffect(() => {
    let isMounted = true;

    const verifyAccess = async () => {
      try {
        // 보호된 경로에 대한 권한 체크
        if (Object.values(PROTECTED_PATHS).some(pattern => pattern.test(pathname))) {
          console.log('[AuthProvider] 보호된 경로 접근:', pathname);
          
          const tokens = TokenStorage.getTokens();
          if (!tokens?.accessToken) {
            console.log('[AuthProvider] 토큰 없음, 로그인 페이지로 이동');
            router.push('/login');
            return;
          }

          if (isMounted) {
            await checkResourcePermission();
          }
        }
      } catch (error) {
        console.error('[AuthProvider] 접근 권한 확인 실패:', error);
        if (isMounted) {
          router.push('/');
        }
      }
    };

    verifyAccess();

    return () => {
      isMounted = false;
    };
  }, [pathname, checkResourcePermission, router]);

  return <>{children}</>;
};

export default AuthProvider;