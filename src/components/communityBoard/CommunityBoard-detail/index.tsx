"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

import Comment from "./Comment";
import { useCommunityBoardDetail } from "./hook";

export default function CommunityBoardDetail({
  params,
}: {
  params: {
    boardId: string;
  };
}) {
  const { post, loading, error } = useCommunityBoardDetail(params?.boardId);

  if (loading) {
    return <div className="text-center py-10">⏳ 게시글 불러오는 중...</div>;
  }

  if (error) {
    return <div className="text-center py-10">❌ {error}</div>;
  }

  if (!post) {
    return (
      <div className="text-center py-10">❌ 게시글을 찾을 수 없습니다.</div>
    );
  }

  return (
    <div className="flex flex-col">
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
          {post?.images && post.images.length > 0 ? (
            post.images.map((img: string, index: number) => (
              <SwiperSlide key={index}>
                <div className="relative w-full h-full">
                  <Image
                    src={img}
                    alt={`Slide ${index}`}
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover"
                  />
                </div>
              </SwiperSlide>
            ))
          ) : (
            <SwiperSlide>
              <div className="relative w-full h-full bg-gray-300" />
            </SwiperSlide>
          )}
        </Swiper>
      </div>

      <div>
        <div className="flex items-start space-x-3 mt-6 px-3">
          <div
            className="w-12 h-12 rounded-3xl bg-center bg-cover bg-no-repeat flex-shrink-0"
            style={{
              backgroundImage: `url(${
                post.writeUserProfileImage ?? "/images/default-profile.png"
              })`,
              backgroundColor: post.writeUserProfileImage
                ? "transparent"
                : "#d3d3d3",
            }}
          ></div>
          <div className="flex-1">
            <div className="flex justify-between items-center w-full">
              <div className="text-text-primary font-sm">
                {post.writeUserName}
              </div>
              <div className="flex space-x-1">
                <span className="flex items-center">
                  <Image
                    src="/icons/post_list_view_icon_24px.svg"
                    alt="View count"
                    width={24}
                    height={24}
                  />
                  <span className="text-text-quaternary text-sm ml-1">
                    {post.viewCount}
                  </span>
                </span>
                <span className="flex items-center">
                  <Image
                    src="/icons/community_detail_bookmark_24px.svg"
                    alt="Like count"
                    width={24}
                    height={24}
                  />
                  <span className="text-text-quaternary text-sm ml-1">
                    {post.bookmarkCount}
                  </span>
                </span>
                <span className="flex items-center">
                  <Image
                    src="/icons/post_list_chat_icon_24px.svg"
                    alt="Chat count"
                    width={24}
                    height={24}
                  />
                  <span className="text-text-quaternary text-sm ml-1">
                    {post.commentCount}
                  </span>
                </span>
              </div>
            </div>
            <p className="text-text-tertiary text-sm">
              {new Date(post.createdAt)
                .toLocaleDateString("ko-KR", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                })
                .replace(/-/g, ".")}
            </p>
          </div>
        </div>
        <h1 className="text-base font-bold text-text-primary mt-6 px-3">
          {post.title}
        </h1>
        <p className="text-sm text-text-primary leading-6 mt-4 mb-4 px-5">
          {post.contents}
        </p>
      </div>

      <section>
        <div className="bg-nav-bg p-5">
          <h3 className="text-text-primary text-base mb-3">
            댓글 {post.commentCount}개
          </h3>
        </div>
        <Comment />
      </section>
    </div>
  );
}
