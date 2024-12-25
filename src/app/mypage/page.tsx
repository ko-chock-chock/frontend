// src/app/mypage/page.tsx
"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import Button from "@/commons/Button";

export default function MyPage() {
  const router = useRouter();

  const handleChatClick = () => {
    router.push("/chatList"); // 채팅 목록 페이지로 이동
  };

  const handleEditClick = () => {
    router.push("/mypage/edit"); // 정보 수정 페이지로 이동 (경로는 임의로 설정)
  };

  return (
    <div className="p-5 flex flex-col gap-4">
      {/* flex와 gap을 이용해 버튼들 사이 간격을 두고 세로로 배치 */}
      {/* 정보 수정 버튼 */}
      <Button design="design4" width="full" onClick={handleEditClick}>
        정보 수정
      </Button>
      <Button design="design2" width="full" onClick={handleChatClick}>
        <Image
          src="/icons/chat_icon_24px.svg"
          alt="채팅 아이콘"
          width={24}
          height={24}
        />
        채팅방 보러가기
      </Button>
    </div>
  );
}
