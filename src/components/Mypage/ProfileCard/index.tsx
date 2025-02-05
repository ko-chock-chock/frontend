// src/components/Mypage/ProfileCard/index.tsx

/**
 * ProfileCard 컴포넌트
 * 사용자의 프로필 정보를 표시하는 카드 컴포넌트
 *
 * 주요 기능:
 * 1. 사용자 프로필 이미지 표시
 * 2. 사용자 이름 표시
 * 3. 프로필 수정 버튼 제공
 *
 * 수정사항 (2024.02.05):
 * - 불필요한 로깅 제거
 * - 성능 최적화
 * - 에러 처리 강화
 */

import Image from "next/image";
import Button from "@/commons/Button";
import { useUserStore } from "@/commons/store/userStore";
import { ProfileCardProps, PROFILE_CONSTANTS } from "./types";
import { useMemo } from "react";

export default function ProfileCard({ onEditClick }: ProfileCardProps) {
  // UserStore에서 사용자 정보 구독
  const user = useUserStore((state) => state.user);

  /**
   * 사용자 정보 메모이제이션
   * - 불필요한 재계산 방지
   * - 기본값 처리 포함
   */
  const userInfo = useMemo(() => {
    if (!user) {
      return {
        name: "닉네임 없음",
        profileImage: PROFILE_CONSTANTS.DEFAULT_IMAGE,
        isDefaultProfile: true,
      };
    }

    return {
      name: user.name,
      profileImage: user.profileImage || PROFILE_CONSTANTS.DEFAULT_IMAGE,
      isDefaultProfile: !user.profileImage,
    };
  }, [user]);

  /**
   * 이미지 로드 에러 핸들러
   */
  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    const target = e.target as HTMLImageElement;
    target.src = PROFILE_CONSTANTS.DEFAULT_IMAGE;

    // 개발 환경에서만 로깅
    if (process.env.NODE_ENV === "development") {
      console.warn("프로필 이미지 로드 실패 - 기본 이미지로 대체됨");
    }
  };

  return (
    <div className="w-full bg-mypage-profile-card rounded-xl">
      {/* 프로필 카드 컨테이너 */}
      <div className="h-[5.875rem] px-4 py-5 flex justify-between items-center">
        {/* 프로필 이미지와 닉네임 */}
        <div className="flex items-center gap-3">
          {/* 프로필 이미지 */}
          <div
            className="relative w-12 h-12"
            role="img"
            aria-label={`${userInfo.name}의 프로필 사진`}
          >
            <Image
              src={userInfo.profileImage}
              alt={`${userInfo.name} 프로필 사진`}
              width={PROFILE_CONSTANTS.IMAGE_SIZE}
              height={PROFILE_CONSTANTS.IMAGE_SIZE}
              className={`rounded-[2rem] object-cover ${
                userInfo.isDefaultProfile ? "bg-black/20" : ""
              }`}
              onError={handleImageError}
              priority // LCP 최적화
            />
          </div>

          {/* 닉네임 */}
          <div className="flex flex-col">
            <h1
              className="text-title-xl text-text-primary"
              title={userInfo.name}
            >
              {userInfo.name}
            </h1>
          </div>
        </div>

        {/* 정보 수정 버튼 */}
        <div className="w-fix">
          <Button
            design="design4"
            onClick={onEditClick}
            className="text-text-quaternary text-[0.8125rem] font-semibold leading-tight"
            aria-label="프로필 정보 수정"
          >
            정보 수정
          </Button>
        </div>
      </div>
    </div>
  );
}

/**
 * 사용 예시:
 *
 * ```tsx
 * function MyPage() {
 *   const handleEditClick = () => {
 *     // 프로필 수정 페이지로 이동
 *     router.push('/mypage/edit');
 *   };
 *
 *   return (
 *     <div>
 *       <ProfileCard onEditClick={handleEditClick} />
 *       {/* 다른 마이페이지 컴포넌트들 *\/}
 *     </div>
 *   );
 * }
 * ```
 */
