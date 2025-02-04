// src/commons/TopNavBar.tsx
"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { NavType } from "./NavWrapper";

interface TopNavBarProps {
  title?: string;
  type: NavType;
}

const TopNavBar = ({ title, type }: TopNavBarProps) => {
  const router = useRouter();

  return (
    // type에 따라 배경색 조건부 적용
    <header className="z-[1000] fixed top-0 left-0 w-screen h-12 bg-nav-bg">
      <div className="h-12 flex justify-between items-center">
        <button
          onClick={() => router.back()}
          className="w-11 h-11 flex items-center justify-center"
        >
          <Image
            src="/icons/Back_icon_24px.svg"
            width={24}
            height={24}
            alt="뒤로가기"
          />
        </button>
        {/* type이 default일 때만 타이틀 표시 */}
        {type === 'default' && (
          <h1 className="absolute left-1/2 -translate-x-1/2 text-title-xl">
            {title}
          </h1>
        )}
        <div className="w-11" aria-hidden="true" />
      </div>
    </header>
  );
};

export default TopNavBar;
