/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import Button from "@/commons/Button";
import KakaoMapComponent from "@/commons/kakakoMap";
import { useUserStore } from "@/commons/store/userStore";
import useWalkMap from "./hook";

const WalkMap = () => {
  const { isWalking, boardId, hasEnded, chatUserData, toggleWalking, chatId } =
    useWalkMap();
  return (
    <div className="relative w-full h-screen">
      {/* 지도 컨테이너 */}
      <div className="relative w-full h-[calc(100%-150px)]">
        <KakaoMapComponent
          isWalking={isWalking}
          boardId={boardId}
          hasEnded={hasEnded}
          chatId={chatId}
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
