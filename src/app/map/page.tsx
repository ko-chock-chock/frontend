import Button from "@/commons/Button";
import KakaoMap from "@/components/kakaoMap";
import React from "react";

const WalkMap = () => {
  return (
    <div className="relative w-full h-screen">
      {/* 지도 컨테이너 */}
      <div className="relative w-full h-[calc(100%-150px)]">
        <KakaoMap />
      </div>

      {/* 하단 패널 */}
      <div className="z-10 px-5 pt-5 pb-20 fixed bottom-0 w-full bg-white text-center flex flex-col items-center gap-3 bg-gray-15 rounded-t-[2rem] shadow-[0_-4px_50px_rgba(0,0,0,0.35)]">
        <div className="text-text-timerFontColor text-[3rem] leading-[4.5rem] tracking-[-0.075rem] font-extrabold text-center text-main-80 font-suit">
          01:30:59
        </div>
        <Button
          design="design1"
          width="full"
          className="flex justify-center items-center gap-1 p-5 px-5 self-stretch h-14 text-base-bold"
        >
          산책 종료하기
        </Button>
      </div>
    </div>
  );
};

export default WalkMap;
