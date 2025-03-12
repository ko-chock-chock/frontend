"use client";

import Link from "next/link";
import { useEffect } from "react";

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
    <main className="flex box-border overflow-hidden px-5 flex-col justify-center items-center gap-4">
      <div className="flex-1 w-full flex flex-col p-3.5 px-5 gap-4">
        <section
          className="h-[40vh] flex flex-col items-start self-stretch p-5 rounded-2xl shadow-lg mb-0"
          style={{
            backgroundImage: "url('/images/mainpageImage.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <span className="text-[#332400] text-[1.3rem] font-semibold font-sandoll leading-[2rem] tracking-[-0.05625rem]">
            세상에 모든 코촉촉이들을 위한
          </span>
          <span className="text-[#332400] text-[1.6rem] font-semibold font-sandoll leading-[2rem] tracking-[-0.05625rem]">
            집사들의 선택
          </span>
        </section>

        <section className="h-[30vh] flex gap-4 w-full">
          <Link
            className="relative flex flex-1 min-h-[14rem] h-full p-5 flex-col items-start rounded-2xl bg-[#FDECFE] shadow-lg"
            href="../jobList"
          >
            <span className="text-[#332400] text-[0.8rem] font-semibold font-sandoll leading-[1.6875rem] tracking-[-0.05625rem]">
              판매 & 구인 커뮤니티
            </span>
            <div className="absolute bottom-0 left-0 flex justify-center items-center max-w-[200px] ">
              <dotlottie-player
                className="w-full h-auto max-w-[200px] max-h-[200px]"
                src="/lottiefiles/lottiewalk.json"
                speed="0.8"
                loop
                autoplay
              ></dotlottie-player>
            </div>
          </Link>

          <Link
            className="relative flex flex-1 min-h-[14rem] h-full p-5 flex-col items-start rounded-2xl bg-[#DDE1FF] shadow-lg"
            href="../communityBoard"
          >
            <span className="text-[#332400] text-[0.8rem] font-semibold font-sandoll leading-[1.6875rem] tracking-[-0.05625rem]">
              자유 커뮤니티
            </span>
            <div className="absolute bottom-0 left-0 flex justify-center max-w-[200px] max-h-[200px]">
              <dotlottie-player
                className="w-full h-auto max-w-[200px] max-h-[200px]"
                src="/lottiefiles/lottiefree.json"
                speed="0.5"
                loop
                autoplay
              ></dotlottie-player>
            </div>
          </Link>
        </section>
      </div>
    </main>
  );
}
