// src/commons/BottomNavBar.tsx
"use client";

import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";

export default function BottomNavBar() {
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    {
      label: "게시글",
      path: "/jobList",
      icon: "/icons/nav/nav_post_unselected_icon.svg",
      activeIcon: "/icons/nav/nav_post_selected_icon.svg",
    },
    {
      label: "채팅",
      path: "/chatList",
      icon: "/icons/nav/nav_chat_unselected_icon.svg",
      activeIcon: "/icons/nav/nav_chat_selected_icon.svg",
    },
    {
      label: "홈",
      path: "/",
      icon: "/icons/nav/nav_home_unselected_icon.svg",
      activeIcon: "/icons/nav/nav_home_selected_icon.svg",
    },
    {
      label: "찜",
      path: "/bookMark",
      icon: "/icons/nav/nav_bookmark_unselected_icon.svg",
      activeIcon: "/icons/nav/nav_bookmark_selected_icon.svg",
    },
    {
      label: "MY",
      path: "/mypage",
      icon: "/icons/nav/nav_mypage_unselected_icon.svg",
      activeIcon: "/icons/nav/nav_mypage_selected_icon.svg",
    },
  ];

  return (
    <nav className="z-50 h-[62px] bg-nav-bg fixed bottom-0 left-0 w-screen border rounded-tr-[42px] rounded-tl-[42px] border-list-line shadow-[0px_-4px_32px_0px_rgba(0,0,0,0.15)]">
      <div className="h-full max-w-screen-sm mx-auto px-6 py-2">
        <ul className="flex h-full justify-between items-center">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <li key={item.path}>
                <button
                  onClick={() => router.push(item.path)}
                  className="flex flex-col items-center gap-1 px-2 py-1"
                >
                  <Image
                    src={isActive ? item.activeIcon : item.icon}
                    alt={item.label}
                    width={24}
                    height={24}
                  />
                  <span
                    className={`text-xs ${
                      isActive
                        ? "text-primary font-bold"
                        : "text-text-quaternary font-medium"
                    }`}
                  >
                    {item.label}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
