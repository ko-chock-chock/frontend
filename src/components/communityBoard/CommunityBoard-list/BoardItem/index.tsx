"use client";

import Image from "next/image";
import Link from "next/link";
export default function CommunityBoardItem() {
  return (
    <>
      {/* Post Items */}
      <Link href="communityBoard/boardId">
        <div className="flex gap-4 w-full bg-white p-4 hover:bg-gray-50 text-left border-b-[1.5px] border-[#E9E8E3]">
          <div className="flex-1">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="font-medium text-gray-700">홍길동</span>
              <span>•</span>
              <span>2시간 전</span>
            </div>
            <h2 className="font-medium mt-1 mb-1">
              새로 오픈한 레스토랑 후기입니다 👨🍳
            </h2>
            <p className="text-gray-600 text-sm line-clamp-2">
              오늘 새로 오픈한 레스토랑에 다녀왔습니다. 분위기도 좋고 음식도
              맛있어서 추천드려요~ 특히 파스타가 정말 맛있었는데요...
            </p>
            <div className="flex items-center gap-2 mt-2 text-gray-500 text-sm">
              <div className="flex items-center">
                <Image
                  className="w-full h-full"
                  src="/icons/community_detail_bookmark_24px.svg" // 저장수
                  alt="Cancel Icon"
                  width={0} // 크기
                  height={0}
                />
                <span>128</span>
              </div>
              <div className="flex items-center">
                <Image
                  className="w-full h-full"
                  src="/icons/post_list_chat_icon_24px.svg" // 댓글수
                  alt="Cancel Icon"
                  width={0} // 크기
                  height={0}
                />
                <span>32</span>
              </div>
              <div className="flex items-center">
                <Image
                  className="w-full h-full"
                  src="/icons/post_list_view_icon_24px.svg" // 조회수
                  alt="Cancel Icon"
                  width={0} // 크기
                  height={0}
                />
                <span>3</span>
              </div>
            </div>
          </div>
          <div className="w-[8rem] h-[8rem] min-w-[6.25rem] min-h-[6.25rem]">
            <div
              className="w-full h-full rounded-2xl bg-center bg-cover bg-no-repeat flex-shrink-0"
              style={{
                backgroundImage: "url('/path-to-image')", // 여기서 이미지를 적용
                backgroundColor: "#d3d3d3", // 원하는 배경색 (예: 빨간색)
              }}
            ></div>
          </div>
        </div>
      </Link>
    </>
  );
}
