"use client";

import Input from "@/commons/input";
import Image from "next/image";
import { useState } from "react";

export default function Comment() {
  const [bookmarkToggle, setBookmarkToggle] = useState(false);
  const [inputValue, setInputValue] = useState(""); // 입력 필드 상태

  return (
    <>
      <section>
        {/* 하단 입력 & 북마크 버튼 */}
        <div className="w-full">
          <footer className="flex w-full items-end">
            <div className="mx-0 flex justify-between p-4 items-center gap-2 w-full bg-[#FDFCF8]">
              <div
                className="min-w-[3rem] h-full"
                onClick={() => setBookmarkToggle(!bookmarkToggle)}
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
              <div className="w-full">
                <Input
                  className="w-full max-h-[3rem] flex items-center gap-2 rounded-[5rem] border border-[#BBB8AB] bg-[#F4F3F1] text-base font-medium leading-[1.5rem] tracking-[-0.025rem]"
                  placeholder="메세지를 입력해주세요."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
              </div>
              <div className="min-w-[3rem] h-full">
                <Image
                  src="/images/chat_send_btn_img_44px.svg"
                  alt="Send Icon"
                  width={44}
                  height={44}
                />
              </div>
            </div>
          </footer>
        </div>
      </section>
    </>
  );
}
