"use client";
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
    <main className="flex h-[40rem] p-3.5 px-5 flex-col justify-center items-center gap-4">
      <div className="flex h-full p-3.5 px-5 flex-col justify-center items-center gap-4 self-stretch">
        <div
          className="flex flex-col items-start flex-1 self-stretch p-5 rounded-2xl shadow-lg"
          style={{
            backgroundImage: "url('/images/mainpageImage.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <span className="text-[#332400] text-[1.3rem] font-semibold font-sandoll font-normal leading-[2rem] tracking-[-0.05625rem]">
            세상에 모든 코촉촉이들을 위한
          </span>
          <span className="text-[#332400] text-[1.6rem] font-semibold font-sandoll font-normal leading-[2rem] tracking-[-0.05625rem]">
            집사들의 선택
          </span>
        </div>

        <div className="flex gap-4 w-full">
          <div className="flex-1 h-[9rem] p-5 flex-col items-start rounded-2xl bg-[#FDECFE] shadow-lg">
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
          <div className="flex-1 h-[9rem] p-5 flex-col items-start rounded-2xl bg-[#DDE1FF] shadow-lg">
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

        <div className="flex h-[9rem] p-5 flex-col items-start flex-shrink-0 self-stretch rounded-2xl bg-[#FEF7C1] shadow-lg">
          <span className="text-[#332400] text-[1rem] font-semibold font-sandoll font-normal leading-[1.6875rem] tracking-[-0.05625rem]">
            자유 커뮤니티
          </span>
          {/* <span>기능 설명</span> */}
          <dotlottie-player
            style={{
              // transform: "scale(2)", 이게 문제!
              width: "200px", // 원하는 너비
              height: "200px", // 원하는 높이
              position: "relative",
              bottom: "58px",
              left: "70px",
            }}
            src="/lottiefiles/lottiefree.json"
            speed="0.5"
            loop
            autoplay
          ></dotlottie-player>
        </div>
      </div>
    </main>
  );
}
