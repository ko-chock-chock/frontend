import Image from "next/image";
import Button from "@/commons/Button";
import { useUserStore } from "@/store/userStore";
import { useEffect } from 'react'; // ✨ 추가: useEffect import

interface ProfileCardProps {
  onEditClick: () => void;
}

export default function ProfileCard({ onEditClick }: ProfileCardProps) {
  const user = useUserStore((state) => state.user);
  
  // ✨ 추가: 디버깅을 위한 useEffect
  useEffect(() => {
    console.log("=== ProfileCard 현재 상태 ===");
    console.log("UserStore 전체 상태:", useUserStore.getState());
    console.log("현재 사용자 정보:", user);
  }, [user]);

  // ✨ 추가: 상수 정의
  const DEFAULT_PROFILE_IMAGE = "/images/mypage_profile_img_48px.svg";
  
  // ✨ 추가: 사용자 정보 처리 함수
  const getUserInfo = () => {
    if (!user) {
      console.log("사용자 정보 없음");
      return {
        name: "닉네임 없음",
        profileImage: DEFAULT_PROFILE_IMAGE
      };
    }

    console.log("현재 표시될 사용자 정보:", {
      이름: user.name,
      프로필이미지: user.profile_image || DEFAULT_PROFILE_IMAGE
    });

    return {
      name: user.name,
      profileImage: user.profile_image || DEFAULT_PROFILE_IMAGE
    };
  };

  const { name, profileImage } = getUserInfo();

  return (
    <div className="max-w-full flex justify-center">
      <div className="w-full mx-5 py-5 bg-list-line rounded-xl items-center">
        <div className="flex justify-between items-center mx-4">
          <div className="flex justify-between gap-3">
            {/* ✨ 수정: 이미지 처리 로직 개선 */}
            <div className="relative w-12 h-12">
              <Image
                src={profileImage}
                alt={`${name} 프로필 사진`}
                width={48}
                height={48}
                className="rounded-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = DEFAULT_PROFILE_IMAGE;
                  console.log("프로필 이미지 로드 실패 - 기본 이미지로 대체");
                }}
              />
            </div>
            <div className="flex flex-col">
              <h1 className="text-title-xl">{name}</h1>
              <div className="flex flex-start gap-1">
                <span className="text-base-medium text-text-secondary">
                  새싹집사
                </span>
                <span className="text-base-semibold text-primary">LV.1</span>
              </div>
            </div>
          </div>
          <span>
            <Button design="design4" width="full" onClick={onEditClick}>
              프로필 수정
            </Button>
          </span>
        </div>
      </div>
    </div>
  );
}