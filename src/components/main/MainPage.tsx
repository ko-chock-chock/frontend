"use client";

import { useEffect } from "react";
import styles from "./MainPage.module.css";

export default function MainPage() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://unpkg.com/@dotlottie/player-component@2.7.12/dist/dotlottie-player.mjs";
    script.type = "module";
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <main className="flex h-screen p-3.5 px-5 flex-col justify-center items-center gap-4">
      <div className="flex h-[40rem] p-3.5 px-5 flex-col justify-center items-center gap-4 self-stretch">
        <div className="flex flex-col items-start  flex-1 self-stretch p-5 rounded-2xl bg-[#80CC66] shadow-lg">
          <span className="text-[#332400] text-[1.125rem] font-semibold font-sandoll font-normal leading-[1.6875rem] tracking-[-0.05625rem]">
            어플 소개
          </span>
          <span className="text-[#664700] text-[0.875rem] font-medium leading-[1.3125rem] tracking-[-0.02188rem] font-suit">
            기능 설명
          </span>
        </div>
        <div className="flex gap-4 w-full">
          <div className="flex-1 h-[9rem] p-5 flex-col items-start rounded-2xl bg-[#C3D13F] shadow-lg">
            <span className="text-[#332400] text-[1rem] font-semibold font-sandoll font-normal leading-[1.6875rem] tracking-[-0.05625rem]">
              판매 커뮤니티
            </span>
            {/* <span>기능 설명</span> */}
            <dotlottie-player
              style={{
                transform: "scale(1.5)",
                position: "relative",
                bottom: "0px",
              }}
              src="/lottiefiles/lottiesell.json"
              speed="0.3"
              loop
              autoplay
            ></dotlottie-player>
          </div>
          <div className="flex-1 h-[9rem] p-5 flex-col items-start rounded-2xl bg-[#B0DA86] shadow-lg">
            <span className="text-[#332400] text-[1rem] font-semibold font-sandoll font-normal leading-[1.6875rem] tracking-[-0.05625rem]">
              구인 커뮤니티
            </span>
            {/* <span>기능 설명</span> */}
            <dotlottie-player
              style={{
                transform: "scale(2)",
                position: "relative",
                bottom: "38px",
              }}
              id="lottie-walk"
              src="/lottiefiles/lottiewalk.json"
              speed="0.8"
              loop
              autoplay
            ></dotlottie-player>
          </div>
        </div>
        <div className="flex h-[9rem] p-5 flex-col items-start flex-shrink-0 self-stretch rounded-2xl bg-[#92D7B3] shadow-lg">
          <span className="text-[#332400] text-[1rem] font-semibold font-sandoll font-normal leading-[1.6875rem] tracking-[-0.05625rem]">
            자유 커뮤니티
          </span>
          {/* <span>기능 설명</span> */}
          <dotlottie-player
            style={{
              transform: "scale(2)",
              position: "relative",
              bottom: "13px",
              left: "10px",
            }}
            src="/lottiefiles/lottiefree.json"
            speed="0.5"
            loop
            autoplay
          ></dotlottie-player>
        </div>
      </div>
      <div className={styles.ad}>아 왜안됨</div>
    </main>
  );
}
