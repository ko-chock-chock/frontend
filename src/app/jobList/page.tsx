/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import RegionDropdown from "@/components/regionsInput";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, useEffect, useMemo } from "react";

interface Image {
  image_id: number;
  image_url: string;
  is_thumbnail: boolean;
}

interface Board {
  board_id: number;
  title: string;
  contents: string;
  price: string;
  location: string;
  status: string;
  images: Image[];
  created_date: string;
}

interface ApiResponse {
  message: string;
  data: {
    data: Board[];
  };
}

const JobListPage = () => {
  const router = useRouter();
  const [boards, setBoards] = useState<Board[]>([]);

  // 지역 선택 상태
  const [selectedMainRegion, setSelectedMainRegion] = useState<string>("");
  const [selectedSubRegion, setSelectedSubRegion] = useState<string>("");

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          throw new Error("토큰이 없습니다. 로그인이 필요합니다.");
        }

        const response = await fetch(
          "https://api.kochokchok.shop/api/v1/boards",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const data: ApiResponse = await response.json();
        setBoards(data.data.data); // Board[]만 상태로 저장
      } catch (err) {
        console.error("Failed to fetch boards:", err);
      }
    };

    fetchBoards();
  }, []);

  const filteredBoards = useMemo(() => {
    if (!selectedMainRegion) {
      return boards; // boards 자체가 Board[]이므로 그대로 반환
    }
    return boards.filter((board) => {
      const loc = board.location || "";
      return (
        loc.includes(selectedMainRegion) && loc.includes(selectedSubRegion)
      );
    });
  }, [boards, selectedMainRegion, selectedSubRegion]);

  const writeButton = () => {
    router.push("/jobList/new");
  };

  return (
    <div className="p-5">
      {/* 헤더 */}
      <div className="p-2 overflow-hidden text-text-secondary truncate font-suit text-title leading-[1.5] tracking-[-0.5px]">
        집사 구인
      </div>

      {/* 지역 선택 드롭다운 */}
      <RegionDropdown
        selectedMainRegion={selectedMainRegion}
        setSelectedMainRegion={setSelectedMainRegion}
        selectedSubRegion={selectedSubRegion}
        setSelectedSubRegion={setSelectedSubRegion}
        buttonClassName="flex items-center gap-[0.25rem] px-[0.7rem] py-[0.25rem] rounded-[1.5rem] bg-list-line"
      />

      {/* 집사 리스트 */}
      <div>
        {filteredBoards.map((board) => (
          <div
            key={board.board_id}
            className="flex flex-col items-center gap-3 w-full p-4 border-b-[1.5px] border-borderBottom"
            onClick={() => router.push(`/jobList/${board.board_id}`)}
          >
            <div className="flex items-center w-full rounded-lg">
              {/* 이미지 박스 */}
              <div className="w-[100px] h-[100px] rounded-[12px] bg-cover bg-no-repeat bg-center bg-gray-300"></div>

              {/* 텍스트 컨텐츠 */}
              <div className="ml-4 flex-1">
                <div className="text-text-primary text-section font-semibold leading-[1.5] tracking-[-0.025rem]">
                  {board.title}
                </div>
                <div className="text-text-tertiary font-suit text-sm font-medium leading-[1.5] tracking-[-0.021875rem]">
                  {board.location} ·{" "}
                  {new Date(board.created_date).toLocaleDateString()}
                </div>
                <div className="text-base-semibold mt-1 text-text-primary">
                  {Number(board.price).toLocaleString()}원
                </div>

                {/* 상태 및 아이콘 */}
                <div className="text-sm flex items-center mt-1 justify-between">
                  <div className="flex space-x-1">
                    <div className="w-5 h-5 bg-gray-300 rounded-full flex items-center justify-center" />
                    <span className="text-sm text-text-quaternary">홍길동</span>
                  </div>

                  <div className="flex space-x-1">
                    <span className="flex items-center">
                      <Image
                        src="/icons/post_list_view_icon_24px.svg"
                        alt="Post List View Icon"
                        width={24}
                        height={24}
                      />
                      <span className="text-text-quaternary font-suit text-[0.875rem] text-sm leading-[1.5] tracking-[-0.021875rem]">
                        5
                      </span>
                    </span>

                    <span className="flex items-center">
                      <Image
                        src="/icons/post_list_like_icon_24px.svg"
                        alt="Post List View Icon"
                        width={24}
                        height={24}
                      />
                      <span className="text-text-quaternary font-suit text-[0.875rem] text-sm leading-[1.5] tracking-[-0.021875rem]">
                        5
                      </span>
                    </span>

                    <span className="flex items-center">
                      <Image
                        src="/icons/post_list_chat_icon_24px.svg"
                        alt="Post List View Icon"
                        width={24}
                        height={24}
                      />
                      <span className="text-text-quaternary font-suit text-[0.875rem] text-sm leading-[1.5] tracking-[-0.021875rem]">
                        5
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 하단 고정 버튼 */}
      <button
        onClick={writeButton}
        className="fixed bottom-[5.5rem] right-5 bg-primary flex h-[3.5rem] px-[1rem] justify-center items-center gap-[0.25rem] rounded-[3rem] shadow-[0_0.25rem_1.5625rem_rgba(0,0,0,0.25)]"
      >
        <div className="text-white flex gap-1 justify-center items-center">
          <Image
            src="/icons/icon-pencil-plus_icon_24px.svg"
            alt="글쓰기 아이콘"
            width={24}
            height={24}
          />
          <span>글쓰기</span>
        </div>
      </button>
    </div>
  );
};

export default JobListPage;
