"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import useJobBoardList from "./hook";

const JobBoardDetail = () => {
  const { images, boardData } = useJobBoardList();
  return (
    <div className="min-h-screen flex flex-col pb-24">
      {/* 상단 이미지 */}
      <div className="relative w-full h-[23.4375rem]">
        <Swiper
          pagination={{
            clickable: true,
            bulletClass: "swiper-pagination-bullet",
            bulletActiveClass: "swiper-pagination-bullet-active",
          }}
          modules={[Pagination]}
          className="w-full h-full"
          slidesPerView={1}
          spaceBetween={0}
        >
          {images?.map((url, index) => (
            <SwiperSlide key={index}>
              <div className="relative w-full h-full">
                <Image
                  src={url}
                  alt={`Slide ${index + 1}`}
                  fill
                  priority={index === 0}
                  sizes="100vw"
                  className="object-cover"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* 본문 내용 */}
      <div className="px-5">
        {/* 프로필 및 상단 정보 */}
        <div className="flex items-start space-x-3 mt-6">
          {/* 프로필사진 */}
          <div className="w-12 h-12 rounded-full bg-gray-300 overflow-hidden">
            {boardData?.data.user.profile_image && (
              <img
                src={boardData.data.user.profile_image}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            )}
          </div>
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
                    alt="View count"
                    width={24}
                    height={24}
                  />
                  <span className="text-text-quaternary text-sm ml-1">5</span>
                </span>
                <span className="flex items-center">
                  <Image
                    src="/icons/post_list_like_icon_24px.svg"
                    alt="Like count"
                    width={24}
                    height={24}
                  />
                  <span className="text-text-quaternary text-sm ml-1">5</span>
                </span>
                <span className="flex items-center">
                  <Image
                    src="/icons/post_list_chat_icon_24px.svg"
                    alt="Chat count"
                    width={24}
                    height={24}
                  />
                  <span className="text-text-quaternary text-sm ml-1">5</span>
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
        <h1 className="text-base font-bold text-text-primary mt-6">
          {boardData?.data?.title}
        </h1>

        {/* 가격 */}
        <p className="text-jobListPrice text-text-primary mt-1">
          {Number(boardData?.data?.price).toLocaleString()}원
        </p>

        {/* 상세 설명 */}
        <p className="text-sm text-text-primary leading-6 mt-4">
          {boardData?.data?.contents}
        </p>
      </div>

      {/* 하단 고정 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white flex items-center w-full py-5 px-5 rounded-t-[2rem] shadow-[0_-4px_30px_rgba(0,0,0,0.1)] space-x-3">
        <button className="flex justify-center items-center rounded-xl">
          <Image
            src="/images/post_detail_like_selected_img_56px.svg"
            alt="Like"
            width={56}
            height={56}
          />
        </button>
        <button className="flex px-5 py-4 justify-center items-center gap-1 flex-1 rounded-xl bg-primary text-base font-bold text-white">
          채팅하기
        </button>
      </div>
    </div>
  );
};

export default JobBoardDetail;
