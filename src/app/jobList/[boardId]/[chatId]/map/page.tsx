/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import Button from "@/commons/Button";
// import KakaoMapComponent from "@/commons/kakaoMap-socket";
import KakaoMapComponent from "@/commons/kakakoMap";
import { useUserStore } from "@/commons/store/userStore";
import { useParams, useRouter } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";

type ChatUserDataType = {
  writeUserId: number;
  requestUserId: number;
};
const WalkMap = () => {
  const [isWalking, setIsWalking] = useState<boolean>(false); // 산책 상태 관리
  const [hasEnded, setHasEnded] = useState<boolean>(false); // 산책 종료 여부 (종료 후 재시작 불가)
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { boardId, chatId } = useParams() as {
    boardId: string;
    chatId: string;
  };
  const [chatUserData, setChatUserData] = useState<ChatUserDataType | null>(
    null
  );
  const router = useRouter();

  // 엑세스 토큰 가져옴
  const getAccessToken = (): string | null => {
    const tokenStorageStr = localStorage.getItem("token-storage");
    if (!tokenStorageStr) return null;
    const tokenData = JSON.parse(tokenStorageStr);
    return tokenData?.accessToken || null;
  };

  // 로그인 유저정보
  const loggedInUserId = useUserStore((state) => state.user?.id);

  useEffect(() => {
    const checkParticipant = async () => {
      const token = getAccessToken();
      if (!token || !boardId || !chatId || !loggedInUserId) return;
      try {
        const res = await fetch(`/api/trade/${boardId}/chat-rooms/${chatId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) return;
        const result = await res.json();
        console.log("ChatUserData result", result);
        // 참여자가 아닌 경우 바로 리다이렉트
        if (
          loggedInUserId !== result.writeUserId &&
          loggedInUserId !== result.requestUserId
        ) {
          alert("접근 권한이 없습니다.");
          router.push("/");
        } else {
          setChatUserData(result);
        }
      } catch (error) {
        console.error("Error checking chat room participants:", error);
      }
    };
    checkParticipant();
  }, [boardId, chatId, loggedInUserId, router]);

  // 산책 시작 정지 핸들러
  const toggleWalking = () => {
    // 산책 종료 후에는 재시작 불가
    if (hasEnded) return;
    if (isWalking) {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
      setIsWalking(false);
      setHasEnded(true);
    } else {
      setIsWalking(true);
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <div className="relative w-full h-screen">
      {/* 지도 컨테이너 */}
      <div className="relative w-full h-[calc(100%-150px)]">
        <KakaoMapComponent
          isWalking={isWalking}
          boardId={boardId}
          hasEnded={hasEnded}
        />
      </div>

      {/* 하단 패널 */}
      <div className="z-10 px-5 pt-5 pb-20 fixed bottom-0 w-full bg-white text-center flex flex-col items-center gap-3 bg-gray-15 rounded-t-[2rem] shadow-[0_-4px_50px_rgba(0,0,0,0.35)]">
        <Button
          design="design1"
          width="full"
          className="flex justify-center items-center gap-1 p-5 self-stretch h-14 text-base-bold"
          onClick={
            chatUserData &&
            useUserStore.getState().user?.id === chatUserData.writeUserId
              ? undefined
              : toggleWalking
          }
          disabled={
            (chatUserData &&
              useUserStore.getState().user?.id === chatUserData.writeUserId) ||
            hasEnded
          }
        >
          {chatUserData &&
          useUserStore.getState().user?.id === chatUserData.writeUserId
            ? "산책 중입니다"
            : hasEnded
            ? "산책 종료됨"
            : isWalking
            ? "산책 종료하기"
            : "산책 시작하기"}
        </Button>
      </div>
    </div>
  );
};

export default WalkMap;
