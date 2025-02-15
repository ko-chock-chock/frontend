"use client";
import Button from "@/commons/Button";
import KakaoMapComponent from "@/commons/kakaoMap";

import React, { useState, useEffect, useRef } from "react";

const WalkMap = () => {
  const [time, setTime] = useState<number>(0); // 타이머 초기값: 0초
  const [isWalking, setIsWalking] = useState<boolean>(false); // 산책 상태 관리
  const timerRef = useRef<NodeJS.Timeout | null>(null); // 타이머 참조

  // 시간을 시:분:초 형식으로 변환
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "4"
    )}:${String(secs).padStart(2, "0")}`;
  };

  // 타이머 시작 및 정지 핸들러
  const toggleWalking = () => {
    if (isWalking) {
      // 타이머 정지
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
    } else {
      // 타이머 시작
      timerRef.current = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    }
    setIsWalking(!isWalking); // 상태 전환
  };

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <div className="relative w-full h-screen">
      {/* 지도 컨테이너 */}
      <div className="relative w-full h-[calc(100%-150px)]">
        <KakaoMapComponent />
      </div>

      {/* 하단 패널 */}
      <div className="z-10 px-5 pt-5 pb-20 fixed bottom-0 w-full bg-white text-center flex flex-col items-center gap-3 bg-gray-15 rounded-t-[2rem] shadow-[0_-4px_50px_rgba(0,0,0,0.35)]">
        {/* 타이머 표시 */}
        <div className="text-text-timerFontColor text-[3rem] leading-[4.5rem] tracking-[-0.075rem] font-extrabold text-center text-main-80 font-suit">
          {formatTime(time)}
        </div>
        {/* 시작/종료 버튼 */}
        <Button
          design="design1"
          width="full"
          className="flex justify-center items-center gap-1 p-5 px-5 self-stretch h-14 text-base-bold"
          onClick={toggleWalking}
        >
          {isWalking ? "산책 종료하기" : "산책 시작하기"}
        </Button>
      </div>
    </div>
  );
};

export default WalkMap;
