// src/commons/store/userStore.ts

/**
 * UserStore - 사용자 정보 전역 상태 관리
 *
 * 주요 기능:
 * 1. 사용자 프로필 정보 관리
 * 2. 사용자 정보 CRUD 작업
 * 3. 전역 상태 영속성 처리
 *
 * 수정사항 (2024.02.05):
 * - 토큰 관련 로직을 TokenStorage로 이관
 * - 사용자 정보 관리 기능 강화
 * - 상세한 로깅 추가
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { TokenStorage } from "@/components/auth/utils/tokenUtils";

/**
 * 사용자 프로필 정보 타입
 */
export interface UserProfile {
  id: number;
  email: string;
  name: string;
  profileImage?: string;
}

/**
 * UserStore 상태 및 액션 타입
 */
interface UserState {
  // 상태 (State)
  user: UserProfile | null;

  // 액션 (Actions)
  setUser: (user: UserProfile) => void;
  clearUser: () => void;
  updateUserInfo: (updateData: Partial<UserProfile>) => void;
  fetchUserInfo: () => Promise<void>;
}

/**
 * UserStore 구현
 * persist 미들웨어로 로컬 스토리지에 상태 유지
 */
export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      // 초기 상태
      user: null,

      // 사용자 정보 설정
      setUser: (user) => {
        console.log("[UserStore] 사용자 정보 설정:", {
          id: user.id,
          name: user.name,
          email: user.email,
          timestamp: new Date().toISOString(),
        });
        set({ user });
      },

      // 사용자 정보 초기화
      clearUser: () => {
        console.log("[UserStore] 사용자 정보 초기화");
        set({ user: null });
        // 토큰도 함께 삭제
        TokenStorage.clearTokens();
      },

      // 사용자 정보 부분 업데이트
      updateUserInfo: (updateData) => {
        console.log("[UserStore] 사용자 정보 업데이트:", updateData);
        set((state) => ({
          user: state.user ? { ...state.user, ...updateData } : null,
        }));
      },

      // 사용자 정보 조회 및 갱신
      fetchUserInfo: async () => {
        const currentUser = get().user;
        const token = TokenStorage.getAccessToken();

        if (!token || !currentUser?.id) {
          console.log("[UserStore] 토큰 또는 사용자 ID 없음");
          return;
        }

        try {
          console.log("[UserStore] 사용자 정보 조회 시작:", currentUser.id);
          const response = await fetch(
            `/api/users/${currentUser.id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (!response.ok) {
            throw new Error("사용자 정보 조회 실패");
          }

          const userInfo = await response.json();
          set({ user: userInfo });
          console.log("[UserStore] 사용자 정보 갱신 성공:", userInfo);
        } catch (error) {
          console.error("[UserStore] 사용자 정보 갱신 실패:", error);
        }
      },
    }),
    {
      name: "user-storage",
      partialize: (state: UserState): Partial<UserState> => ({
  user: state.user,
}),
    }
  )
);

/**
 * UserStore 사용 예시
 *
 * 1. 컴포넌트에서 사용자 정보 접근
 * ```tsx
 * function ProfileComponent() {
 *   const user = useUserStore((state) => state.user);
 *
 *   return (
 *     <div>
 *       <h1>프로필</h1>
 *       {user && (
 *         <div>
 *           <p>이름: {user.name}</p>
 *           <p>이메일: {user.email}</p>
 *         </div>
 *       )}
 *     </div>
 *   );
 * }
 * ```
 *
 * 2. 사용자 정보 업데이트
 * ```tsx
 * function UpdateProfileComponent() {
 *   const updateUserInfo = useUserStore((state) => state.updateUserInfo);
 *
 *   const handleUpdateName = (newName: string) => {
 *     updateUserInfo({ name: newName });
 *   };
 *
 *   return (
 *     <button onClick={() => handleUpdateName("새이름")}>
 *       이름 변경
 *     </button>
 *   );
 * }
 * ```
 *
 * 3. 로그아웃 처리
 * ```tsx
 * function LogoutButton() {
 *   const clearUser = useUserStore((state) => state.clearUser);
 *
 *   const handleLogout = () => {
 *     clearUser(); // 사용자 정보와 토큰을 모두 제거
 *   };
 *
 *   return <button onClick={handleLogout}>로그아웃</button>;
 * }
 * ```
 *
 * 4. 사용자 정보 갱신
 * ```tsx
 * function UserProfilePage() {
 *   const fetchUserInfo = useUserStore((state) => state.fetchUserInfo);
 *
 *   useEffect(() => {
 *     fetchUserInfo(); // 컴포넌트 마운트 시 최신 정보 조회
 *   }, [fetchUserInfo]);
 *
 *   return <div>프로필 페이지</div>;
 * }
 * ```
 */
