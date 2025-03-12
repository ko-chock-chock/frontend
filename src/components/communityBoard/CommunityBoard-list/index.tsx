"use client";

import CommunityBoardItem from "./BoardItem";
import Image from "next/image";
import Button from "@/commons/Button";
import useCommunityBoard from "./hook";

export default function CommunityBoard() {
  const { posts, loading, writeButton } = useCommunityBoard();

  return (
    <>
      <div className=" mx-auto bg-gray-50">
        {loading && (
          <div className="text-center py-10">⏳ 게시글 불러오는 중...</div>
        )}

        {!loading && posts.length === 0 && (
          <div className="text-center py-10">❌ 게시글이 없습니다.</div>
        )}

        {/* Post List */}
        {!loading && posts.length > 0 && (
          <div className="divide-y">
            {posts.map((post) => (
              <CommunityBoardItem key={post.id} post={post} />
            ))}
          </div>
        )}

        <div className="relative h-full">
          <Button
            design="design3"
            className="fixed bottom-20 right-5 flex items-center gap-2"
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
