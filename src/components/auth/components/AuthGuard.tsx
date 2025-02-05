// src/auth/components/AuthGuard.tsx

/**
 * AuthGuard 컴포넌트
 * 페이지 접근 권한을 관리하고 인증 상태를 검증하는 컴포넌트
 *
 * 주요 기능:
 * 1. 페이지별 인증 상태 검증
 * 2. 권한 없는 접근 차단
 * 3. 로딩 상태 관리
 * 4. 조건부 리다이렉션
 *
 * 수정사항 (2024-02-04):
 * 1. 인증 체크 로직 최적화
 * 2. 메모리 누수 방지를 위한 cleanup 함수 추가
 * 3. 디버깅 로그 개선
 * 4. 권한 체크 로직 강화
 */

import { useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/commons/store/userStore";
import { checkAuthStatus } from "../utils/tokenUtils";
import type { AuthorizedResource } from "../types/auth";

interface AuthGuardProps {
  children: ReactNode; // 보호할 컴포넌트/페이지
  resource?: AuthorizedResource; // 권한 체크가 필요한 리소스
  requireAuth?: boolean; // 인증 필요 여부
  fallback?: ReactNode; // 권한 없을 때 표시할 컴포넌트
  redirectTo?: string; // 리다이렉트 경로
  loadingComponent?: ReactNode; // 로딩 중 표시할 컴포넌트
}

export const AuthGuard = ({
  children,
  resource,
  requireAuth = true,
  fallback,
  redirectTo = "/login",
  loadingComponent = <div>Loading...</div>,
}: AuthGuardProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    let isMounted = true; // cleanup을 위한 마운트 상태 관리

    const verifyAuth = async () => {
      try {
        // 1. 인증이 필요없는 페이지 처리
        if (!requireAuth) {
          console.log("[AuthGuard] 인증이 필요없는 페이지");
          if (isMounted) {
            setIsAuthorized(true);
            setIsLoading(false);
          }
          return;
        }

        // 2. 인증 상태 체크
        const authResult = await checkAuthStatus();
        console.log("[AuthGuard] 인증 상태 확인:", {
          isAuthenticated: authResult.isAuthenticated,
          isAuthorized: authResult.isAuthorized,
          message: authResult.message,
          timestamp: new Date().toISOString(),
        });

        if (!authResult.isAuthenticated) {
          console.log("[AuthGuard] 인증 실패. 리다이렉트:", redirectTo);
          if (isMounted) {
            router.push(redirectTo);
          }
          return;
        }

        // 3. 리소스 접근 권한 체크
        if (resource) {
          const hasResourceAccess = user?.id === Number(resource.userId);
          console.log("[AuthGuard] 리소스 접근 권한 체크:", {
            userId: user?.id,
            resourceUserId: resource.userId,
            hasAccess: hasResourceAccess,
          });

          if (!hasResourceAccess) {
            console.log("[AuthGuard] 리소스 접근 권한 없음");
            if (isMounted) {
              if (!fallback) {
                router.push("/");
              }
              setIsAuthorized(false);
              setIsLoading(false);
            }
            return;
          }
        }

        // 4. 모든 검증 통과
        if (isMounted) {
          setIsAuthorized(true);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("[AuthGuard] 인증 체크 중 에러:", error);
        if (isMounted) {
          router.push(redirectTo);
        }
      }
    };

    verifyAuth();

    // cleanup 함수
    return () => {
      isMounted = false;
    };
  }, [requireAuth, redirectTo, resource, router, user?.id]);

  // 로딩 상태 처리
  if (isLoading) {
    return loadingComponent;
  }

  // 인증/권한 체크 실패 시 fallback 컴포넌트 표시
  if (requireAuth && !isAuthorized) {
    return fallback || null;
  }

  // 모든 검증 통과 시 children 렌더링
  return <>{children}</>;
};

export default AuthGuard;
