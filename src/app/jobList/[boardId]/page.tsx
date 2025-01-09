"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";

interface Image {
  image_url: string;
  is_thumbnail: boolean;
}

interface User {
  name: string;
  profile_image: string;
}

interface BoardData {
  board_id: number;
  title: string;
  contents: string;
  price: string;
  location: string;
  status: string;
  created_date: string;
  updated_date: string;
  images: Image[];
  user: User;
}

interface ApiResponse {
  message: string;
  data: BoardData;
}

const JobDetailPage = () => {
  const param = useParams();

  const [boardData, setBoardData] = useState<ApiResponse | null>(null);

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          throw new Error("토큰이 없습니다. 로그인이 필요합니다.");
        }

        const response = await fetch(
          `https://api.kochokchok.shop/api/v1/boards/${param.boardId}`,
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
        const result = await response.json();
        setBoardData(result);
      } catch (err) {
        console.error("Failed to fetch boards:", err);
      }
    };
    fetchBoards();
  }, []);

  const images = boardData?.data?.images.map((item) => item.image_url);

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* 상단 이미지 */}
      <div className="flex items-stretch h-[23.4375rem]">
        <Swiper pagination={true} modules={[Pagination]} className="mySwiper">
          {images?.map((url, index) => (
            <SwiperSlide key={index}>
              <img src={url} alt={`Slide ${index}`} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* 본문 내용 */}
      <div className="px-5">
        {/* 프로필 및 상단 정보 */}
        <div className="flex items-start space-x-3 mt-[1.5rem]">
          {/* 프로필사진 */}
          <div className="w-12 h-12 rounded-full bg-gray-300"></div>
          <div className="flex-1">
            {/* 이름과 아이콘 그룹 */}
            <div className="flex justify-between items-center w-full">
              <div className="text-text-primary font-sm">
                {boardData?.data.user.name}
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
            <p className="text-text-tertiary text-sm">
              {boardData?.data?.location} ·{" "}
              {new Date(
                boardData?.data?.created_date ?? ""
              ).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* 제목 */}
        <h1 className="text-base font-bold text-text-primary mt-[1.5rem]">
          {boardData?.data?.title}
        </h1>

        {/* 가격 */}
        <p className="text-jobListPrice text-text-primary mt-1">
          {Number(boardData?.data?.price).toLocaleString()}원
        </p>

        {/* 상세 설명 */}
        <p className="text-sm text-text-secondary leading-6 mt-4">
          {boardData?.data?.contents}
        </p>
      </div>

      {/* 하단 고정 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white flex items-center w-full py-[1.25rem] px-[1.25rem] rounded-t-[2rem] shadow-[0_-0.25rem_1.875rem_rgba(0,0,0,0.1)] space-x-3">
        {/* 좋아요 버튼 */}
        <button className="flex justify-center items-center rounded-[0.75rem]">
          <Image
            src="/images/post_detail_like_selected_img_56px.svg"
            alt="Post List View Icon"
            width={56}
            height={56}
          />
        </button>

        {/* 채팅하기 버튼 */}
        <button className="flex px-[1.25rem] py-[1rem] justify-center items-center gap-[0.25rem] flex-1 rounded-[0.75rem] bg-primary text-base-bold text-white">
          채팅하기
        </button>
      </div>
    </div>
  );
};

export default JobDetailPage;
