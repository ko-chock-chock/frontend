"use client";

import Input from "@/commons/input";
import Image from "next/image";
import { useFooter } from "./hook";
import { FooterProps } from "./type";

export default function Footer({ postId, fetchComments }: FooterProps) {
  const {
    bookmarkToggle,
    toggleBookmark,
    inputValue,
    setInputValue,
    onClickSubmit,
  } = useFooter(postId, fetchComments);

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t">
      <div className="flex justify-between items-center gap-2">
        {/* 북마크 버튼 */}
        <div
          className="min-w-[3rem] h-full"
          onClick={() => toggleBookmark(postId)}
        >
          <Image
            src={
              bookmarkToggle
                ? "/images/community_detailPage_unBookmark_44px.svg"
                : "/images/community_detailPage_bookmark_44px.svg"
            }
            alt="Bookmark Icon"
            width={44}
            height={44}
          />
        </div>

        {/* 메시지 입력창 */}
        <div className="w-full">
          <Input
            className="w-full h-12 flex items-center gap-2 rounded-[5rem] border border-[#BBB8AB] bg-[#F4F3F1] text-base font-medium px-4"
            placeholder="메세지를 입력해주세요."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </div>

        {/* 전송 버튼 */}
        <div className="min-w-[3rem] h-full">
          <Image
            onClick={() => onClickSubmit(postId, inputValue)}
            src="/images/chat_send_btn_img_44px.svg"
            alt="Send Icon"
            width={44}
            height={44}
          />
        </div>
      </div>
    </footer>
  );
}
