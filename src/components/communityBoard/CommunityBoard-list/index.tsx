"use client";

import React from "react";
import CommunityBoardItem from "./BoardItem";
import Image from "next/image";
import Button from "@/commons/Button";
import { useRouter } from "next/navigation";
// import { Heart, MessageCircle, Image } from "lucide-react";

export default function CommunityBoard() {
  const router = useRouter();

  const writeButton = () => {
    router.push("/communityBoard/new");
  };

  return (
    <>
      <div className="max-w-lg mx-auto bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="sticky top-0 bg-white shadow-sm p-4 border-b z-10">
          <h1 className="text-xl font-bold text-center">커뮤니티</h1>
        </div>

        {/* Post List */}
        <div className="divide-y">
          {/* Post Items */}
          <CommunityBoardItem />
          <CommunityBoardItem />
          <CommunityBoardItem />
          <CommunityBoardItem />
          <CommunityBoardItem />
          <CommunityBoardItem />
          <CommunityBoardItem />
        </div>

        <div className="relative h-full">
          <Button
            design="design3"
            className="fixed bottom-10 right-5 flex items-center gap-2"
            onClick={writeButton}
          >
            <Image
              className="w-[1.5rem] h-[1.5rem]"
              src="/icons/icon-pencil-plus_icon_24px.svg"
              alt="Pencil Icon"
              width={0}
              height={0}
            />
            글쓰기
          </Button>
        </div>
      </div>
    </>
  );
}
