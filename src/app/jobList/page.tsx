'use client';
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { useRegionSelector } from "@/components/regionsInput";

const JobListPage = () => {
  const {
    regions,
    isDropdownOpen,
    selectedRegion,
    currentSubRegions,
    toggleDropdown,
    handleRegionClick,
    handleSubRegionClick,
  } = useRegionSelector();

  const router = useRouter();

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
      <div className="relative mb-4 flex flex-col items-end gap-[0.625rem] px-[1.25rem] self-stretch">
        <button
          className="flex items-center gap-[0.25rem] px-[0.7rem] py-[0.25rem] rounded-[1.5rem] bg-list-line"
          onClick={toggleDropdown}
        >
          <span className="text-center text-text-secondary font-suit text-[0.875rem] font-sm leading-[1.5] tracking-[-0.021875rem]">
            {selectedRegion}
          </span>
          <Image
            src="/icons/post_list_region_dropdown_icon_16px.svg"
            alt="드롭다운 메뉴 토글 아이콘"
            width={16}
            height={16}
          />
        </button>

        {isDropdownOpen && (
          <div className="absolute z-10 mt-8 bg-white border rounded-lg shadow">
            {/* 하위 구 표시 */}
            {currentSubRegions.length > 0 ? (
              <ul>
                {currentSubRegions.map((subRegion) => (
                  <li
                    key={subRegion}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleSubRegionClick(subRegion)}
                  >
                    {subRegion}
                  </li>
                ))}
              </ul>
            ) : (
              // 상위 지역 목록 표시
              <ul>
                {regions.map((region) => (
                  <li
                    key={region.name}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleRegionClick(region.name)}
                  >
                    {region.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {/* 집사 리스트 */}
      <div>
        <div className="flex flex-col items-center gap-3 w-full p-4 border-b-[1.5px] border-borderBottom">
          <div className="flex items-center w-full rounded-lg">
            {/* 이미지 박스 */}
            <div className="w-[100px] h-[100px] rounded-[12px] bg-cover bg-no-repeat bg-center bg-gray-300"></div>

            {/* 텍스트 컨텐츠 */}
            <div className="ml-4 flex-1">
              <div className="text-text-primary text-section font-semibold leading-[1.5] tracking-[-0.025rem]">
                제목
              </div>
              <div className="text-text-tertiary font-suit text-sm font-medium leading-[1.5] tracking-[-0.021875rem]">
                서울시 강동구 · 1주 전
              </div>
              <div className="text-base-semibold mt-1 text-text-primary">
                0,000원
              </div>

              {/* 상태 및 아이콘 */}
              <div className="text-sm flex items-center mt-1 justify-between">
                <div className="flex space-x-1">
                  <div className="w-5 h-5 bg-gray-300 rounded-full flex items-center justify-center"></div>
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
      </div>

      {/* 하단 고정 버튼 */}
      <button
        onClick={writeButton}
        className="fixed bottom-[5.5rem] right-5 bg-primary flex h-[3.5rem] px-[1rem] justify-center items-center gap-[0.25rem] rounded-[3rem] shadow-[0_0.25rem_1.5625rem_rgba(0,0,0,0.25)]"
      >
        <div className="text-white flex gap-1 justify-center items-center">
          <Image
            src="/icons/icon-pencil-plus_icon_24px.svg"
            alt="Post List View Icon"
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
