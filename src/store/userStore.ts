// src/store/userStore.ts

import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * 사용자 정보 타입 정의
 * @property user_id - 사용자 고유 ID
 * @property mail - 사용자 이메일
 * @property name - 사용자 이름(닉네임)
 * @property profile_image - 프로필 이미지 URL (optional)
 */
export interface UserProfile {
  user_id: string;
  mail: string;
  name: string;
  profile_image?: string;
}

/**
 * 사용자 상태 관리를 위한 인터페이스
 * @property user - 현재 로그인된 사용자 정보
 * @property setUser - 사용자 정보 설정 함수
 * @property clearUser - 사용자 정보 초기화 함수
 * @property updateUserInfo - 사용자 정보 부분 업데이트 함수
 */
interface UserState {
  user: UserProfile | null;
  setUser: (user: UserProfile) => void;
  clearUser: () => void;
  updateUserInfo: (updateData: Partial<UserProfile>) => void;
}

/**
 * Zustand store for user management
 * persist middleware를 사용하여 새로고침 시에도 데이터 유지
 */
export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,

      setUser: (user) => {
        console.log("[UserStore] 사용자 정보 설정:", {
          id: user.user_id,
          name: user.name,
          time: new Date().toISOString()
        });
        set({ user });
      },

      clearUser: () => {
        console.log("[UserStore] 사용자 정보 초기화");
        set({ user: null });
      },

      updateUserInfo: (updateData) => {
        console.log("[UserStore] 사용자 정보 업데이트:", updateData);
        set((state) => ({
          user: state.user ? { ...state.user, ...updateData } : null
        }));
      },
    }),
    {
      name: "user-storage",
      partialize: (state) => ({ user: state.user }),
    }
  )
);

/**
 * 👋 UserStore 활용 가이드
 * 
 * 1. 컴포넌트에서 사용자 정보 접근하기
 * ```typescript
 * import { useUserStore } from '@/store/userStore';
 * 
 * function MyComponent() {
 *   // 전체 사용자 정보 가져오기
 *   const user = useUserStore((state) => state.user);
 * 
 *   // 특정 정보만 가져오기 (선택적)
 *   const userName = useUserStore((state) => state.user?.name);
 * 
 *   return (
 *     <div>
 *       <h1>안녕하세요, {user?.name}님!</h1>
 *       <img src={user?.profile_image || '/default-profile.png'} alt="프로필" />
 *     </div>
 *   );
 * }
 * ```
 * 
 * 2. 로그인 시 사용자 정보 저장
 * ```typescript
 * const { setUser } = useUserStore();
 * 
 * // API 응답 후:
 * setUser({
 *   user_id: "user_id_from_api",
 *   mail: "user@email.com",
 *   name: "사용자명",
 *   profile_image: "이미지URL" // 선택적
 * });
 * ```
 * 
 * 3. 사용자 정보 업데이트 (예: 프로필 수정)
 * ```typescript
 * const { updateUserInfo } = useUserStore();
 * 
 * // 닉네임만 업데이트
 * updateUserInfo({ name: "새로운닉네임" });
 * 
 * // 프로필 이미지 업데이트
 * updateUserInfo({ profile_image: "새로운이미지URL" });
 * ```
 * 
 * 4. 로그아웃 처리
 * ```typescript
 * const { clearUser } = useUserStore();
 * 
 * function handleLogout() {
 *   clearUser();
 *   // 추가로 필요한 로그아웃 로직...
 * }
 * ```
 * 
 * 5. 인증 여부 확인
 * ```typescript
 * function isAuthenticated() {
 *   const user = useUserStore.getState().user;
 *   return !!user;
 * }
 * ```
 * 
 * 6. 조건부 렌더링
 * ```typescript
 * function AuthenticatedComponent() {
 *   const user = useUserStore((state) => state.user);
 * 
 *   if (!user) {
 *     return <div>로그인이 필요합니다.</div>;
 *   }
 * 
 *   return <div>인증된 사용자: {user.name}</div>;
 * }
 * ```
 * 
 * ⚠️ 주의사항
 * 1. 컴포넌트 외부에서 상태를 변경할 때는 getState() 사용
 * 2. 불필요한 리렌더링을 피하기 위해 필요한 상태만 선택적으로 구독
 * 3. 민감한 정보는 저장하지 않도록 주의
 * 
 * 🔍 디버깅 팁
 * 1. 콘솔에서 현재 상태 확인:
 *    console.log(useUserStore.getState());
 * 
 * 2. 스토어 변경 모니터링:
 *    useUserStore.subscribe(
 *      state => console.log('스토어 변경:', state)
 *    );
 */