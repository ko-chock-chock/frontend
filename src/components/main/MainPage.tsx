"use client";

import { useEffect } from "react";
import styles from "./MainPage.module.css"

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

  // useEffect(() => {
  //   const sell = document.querySelector("#lottie-sell") as HTMLElement;
  //   if (sell) {
  //     sell.style.width = "6.25rem";
  //     sell.style.height = "6.25rem";
  //     sell.style.transform = "scale(1.3)";
  //   }
  //   const walk = document.querySelector("#lottie-walk") as HTMLElement;
  //   if (walk) {
  //     walk.style.width = "6.25rem";
  //     walk.style.height = "6.25rem";
  //     walk.style.transform = "scale(1.8)";
  //   }
  //   const free = document.querySelector("#lottie-free") as HTMLElement;
  //   if (free) {
  //     free.style.width = "6.25rem";
  //     free.style.height = "6.25rem";
  //     free.style.transform = "scale(1.8)";
  //   }
  // }, []);

  return (
    <main className="bg-main_bg_color flex h-screen p-3.5 px-5 flex-col justify-center items-center gap-4">
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
              className={styles.lottieLogo}
              // id="lottie-sell"
              src="/lottiefiles/lottiesell.json"
              speed="0.4"
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
              id="lottie-walk"
              src="/lottiefiles/lottiewalk.json"
              speed="1"
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
            className="relative left-[50px]"
            id="lottie-free"
            src="/lottiefiles/lottiefree.json"
            speed="0.5"
            loop
            autoplay
          ></dotlottie-player>
        </div>
      </div>
      <div className={styles.a}>아 왜안됨</div>
    </main>
  );
}
