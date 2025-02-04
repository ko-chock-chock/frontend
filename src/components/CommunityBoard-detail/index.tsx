"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const CommunityBoardDetail = () => {
  return (
    <div className="min-h-screen flex flex-col">
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
          <SwiperSlide>
            <div className="relative w-full h-full">
              <Image
                src="/images/default-placeholder.png"
                alt="Slide"
                fill
                priority
                sizes="100vw"
                className="object-cover"
              />
            </div>
          </SwiperSlide>
        </Swiper>
      </div>

      {/* 본문 내용 */}
      <div>
        <div className="flex items-start space-x-3 mt-6">
          <div className="w-12 h-12 rounded-full overflow-hidden"></div>
          <div className="flex-1">
            <div className="flex justify-between items-center w-full">
              <div className="text-text-primary font-sm">사용자 이름</div>
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
            <p className="text-text-tertiary text-sm">지역 정보 · 날짜</p>
          </div>
        </div>
        <h1 className="text-base font-bold text-text-primary mt-6">
          게시글 제목
        </h1>
        <p className="text-jobListPrice text-text-primary mt-1">2000 원</p>
        <p className="text-sm text-text-primary leading-6 mt-4 mb-4">
          엄청 긴 상세 설명엄청 긴 상세 설명엄청 긴 상세 설명엄청 긴 상세
          설명엄청 긴 상세 설명엄청 긴 상세 설명엄청 긴 상세 설명 엄청 긴 상세
          설명엄청 긴 상세 설명엄청 긴 상세 설명엄청 긴 상세 설명엄청 긴 상세
          설명엄청 긴 상세 설명엄청 긴 상세 설명엄청 긴 상세 설명엄청 긴 상세
          설명엄청 긴 상세 설명엄청 긴 상세 설명 엄청 긴 상세 설명엄청 긴 상세
          설명엄청 긴 상세 설명엄청 긴 상세 설명엄청 긴 상세 설명엄청 긴 상세
          설명엄청 긴 상세 설명
        </p>
      </div>

      {/* 댓글 */}
      <div className="bg-nav-bg p-3">
        <h3 className=" text-text-primary text-bases mb-3">댓글 32개</h3>

        {/* Comments List */}
        <div className="space-y-6">
          {/* First Comment Thread */}
          <div className="w-full">
            <div className="flex gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-200 shrink-0" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">맛집탐험가</span>
                  <span className="text-xs text-gray-500">2시간 전</span>
                </div>
                <p className="text-sm mt-1">
                  저도 이 레스토랑 가보고 싶네요! 위치가 어디인가요?
                </p>
                <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                  <button className="hover:text-gray-700">답글 달기</button>
                </div>
              </div>
            </div>

            {/* Replies to First Comment */}
            <div className="mt-3 space-y-3">
              <div className="flex gap-2 ml-10">
                <div className="w-8 h-8 rounded-full bg-gray-200 shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">글쓴이</span>
                    <span className="text-xs text-gray-500">1시간 전</span>
                  </div>
                  <span className="text-sm text-blue-500 mr-1">
                    @맛집탐험가
                  </span>
                  <p className="text-sm mt-1">
                    강남역 3번 출구에서 도보 5분 거리에 있어요! 구체적인 위치는
                    DM으로 보내드릴게요 😊
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    <button className="hover:text-gray-700">답글 달기</button>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 ml-10">
                <div className="w-8 h-8 rounded-full bg-gray-200 shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">맛집탐험가</span>
                    <span className="text-xs text-gray-500">30분 전</span>
                  </div>
                  <span className="text-sm text-blue-500 mr-1">@글쓴이</span>
                  <p className="text-sm mt-1">
                    친절한 답변 감사합니다! 주말에 꼭 가보려구요~
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    <button className="hover:text-gray-700">답글 달기</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityBoardDetail;
