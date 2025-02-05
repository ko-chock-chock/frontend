// app/login/page.tsx

/**
 * 로그인 페이지 라우트
 * @see components/Login/index.tsx - 실제 구현체
 */

import LoginComponent from "@/components/Login";

export default function LoginPage() {
  return <LoginComponent />;
}

/**
 * 활용 예시:
 * 
 * 1. 기본 라우팅
 * ```tsx
 * // app/page.tsx에서
 * router.push('/login');
 * ```
 * 
 * 2. 보호된 라우트에서 리디렉션
 * ```tsx
 * // 인증이 필요한 페이지에서
 * if (!isAuthenticated) {
 *   router.push('/login');
 *   return null;
 * }
 * ```
 * 
 */