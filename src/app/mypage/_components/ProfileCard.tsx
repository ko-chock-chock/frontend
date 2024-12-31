// src/app/mypage/components/ProfileCard.tsx

import Image from "next/image";
import Button from "@/commons/Button";

interface ProfileCardProps {
  onEditClick: () => void;
}

export default function ProfileCard({ onEditClick }: ProfileCardProps) {
  return (
    <div className="max-w-full flex justify-center">
      <div className="w-full mx-5 py-5 bg-list-line rounded-xl  items-center">
        <div className="flex justify-between items-center mx-4">
          <div className="flex justify-between gap-3 ">
            <Image
              src="/images/mypage_profile_img_48px.svg"
              alt="프로필사진 기본 이미지"
              width={48}
              height={48}
            />
            <div className="flex flex-col">
              <h1 className="text-title-xl">닉네임</h1>
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
