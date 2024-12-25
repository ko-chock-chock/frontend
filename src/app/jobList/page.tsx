'use client';
import Image from "next/image";
import React, { useState } from "react";

const regions = [
  {
    name: "서울",
    subRegions: [
      "강남구", "강동구", "강북구", "강서구", "관악구", "광진구", "구로구", "금천구",
      "노원구", "도봉구", "동대문구", "동작구", "마포구", "서대문구", "서초구", "성동구",
      "성북구", "송파구", "양천구", "영등포구", "용산구", "은평구", "종로구", "중구", "중랑구",
    ],
  },
  {
    name: "부산",
    subRegions: [
      "강서구", "금정구", "남구", "동구", "동래구", "부산진구", "북구", "사상구",
      "사하구", "서구", "수영구", "연제구", "영도구", "중구", "해운대구",
    ],
  },
  {
    name: "대구",
    subRegions: ["남구", "달서구", "달성군", "동구", "북구", "서구", "수성구", "중구"],
  },
  {
    name: "제주",
    subRegions: ["제주시", "서귀포시"],
  },
];

const JobListPage = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // 드롭다운 열림/닫힘 상태
  const [selectedRegion, setSelectedRegion] = useState("지역 선택"); // 선택한 지역
  const [currentSubRegions, setCurrentSubRegions] = useState([]); // 하위 구 목록 상태

  // 드롭다운 토글 핸들러
  const toggleDropdown = () => {
    // 드롭다운을 열 때 하위 구 목록 초기화
    if (!isDropdownOpen) {
      setCurrentSubRegions([]);
    }
    setIsDropdownOpen(!isDropdownOpen);
  };

  // 상위 지역 선택 핸들러
  const handleRegionClick = (region) => {
    setCurrentSubRegions(region.subRegions); // 선택된 지역의 하위 구 업데이트
    setSelectedRegion(region.name); // 상위 지역 이름 설정
  };

  // 하위 구 선택 핸들러
  const handleSubRegionClick = (subRegion) => {
    setSelectedRegion(`${selectedRegion.split(" ")[0]} ${subRegion}`); // 선택한 구로 리셋
    setIsDropdownOpen(false); // 드롭다운 닫기
  };

  return (
    <div className="p-5 min-h-screen">
      {/* 헤더 */}
      <div className="p-2 overflow-hidden text-text-secondary truncate font-suit text-title leading-[1.5] tracking-[-0.5px]">집사 구인</div>

      {/* 지역 선택 드롭다운 */}
      <div className="relative mb-4 flex flex-col items-end gap-[0.625rem] px-[1.25rem] self-stretch">
        <button
          className="flex items-center gap-[0.25rem] px-[0.7rem] py-[0.25rem] rounded-[1.5rem] bg-list-line"
          onClick={toggleDropdown}
        >
          <span className="text-center text-text-secondary font-suit text-[0.875rem] font-sm leading-[1.5] tracking-[-0.021875rem]">{selectedRegion}</span>
          <Image
            src="/icons/post_list_region_dropdown_icon_16px.svg"
            alt="드롭다운 메뉴 토글 아이콘"
            width={16}
            height={16}
          />
        </button>

        {isDropdownOpen && (
          <div className="absolute z-10 mt-8 bg-white border rounded-lg shadow w-full">
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
                    onClick={() => handleRegionClick(region)}
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
        <div className="flex flex-col items-center gap-3 w-full p-4 border-b-[1.5px] border-borderBottom" >
            <div
              // key={index}
              className="flex items-center w-full rounded-lg"
            >
              {/* 이미지 박스 */}
              <div className="w-[100px] h-[100px] rounded-[12px] bg-cover bg-no-repeat bg-center bg-gray-300"></div>

              {/* 텍스트 컨텐츠 */}
              <div className="ml-4 flex-1">
                <div className="text-text-primary text-section font-semibold leading-[1.5] tracking-[-0.025rem]">제목</div >
                <div className="text-text-tertiary font-suit text-sm font-medium leading-[1.5] tracking-[-0.021875rem]"
                >서울시 강동구 · 1주 전</div>
                <div className="text-base-semibold mt-1 text-text-primary">0,000원</div>

                {/* 상태 및 아이콘 */}
                <div className="text-sm flex items-center mt-1 justify-between">
                  <div className="flex space-x-1">
                    <div className="w-5 h-5 bg-gray-300 rounded-full flex items-center justify-center">
                      {/* 만약 텍스트나 이미지를 넣고 싶다면 아래 코드를 사용 */}
                      {/* <img src="path-to-image" alt="Profile" className="w-full h-full rounded-full" /> */}
                    </div>
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
                      <span className="text-text-quaternary font-suit text-[0.875rem] text-sm leading-[1.5] tracking-[-0.021875rem]">5</span>
                    </span>

                    <span className="flex items-center">
                    <Image
                      src="/icons/post_list_like_icon_24px.svg"
                      alt="Post List View Icon"
                      width={24}
                      height={24}
                    />
                      <span className="text-text-quaternary font-suit text-[0.875rem] text-sm leading-[1.5] tracking-[-0.021875rem]">5</span>
                    </span>

                    <span className="flex items-center">
                    <Image
                      src="/icons/post_list_chat_icon_24px.svg"
                      alt="Post List View Icon"
                      width={24}
                      height={24}
                    />
                      <span className="text-text-quaternary font-suit text-[0.875rem] text-sm leading-[1.5] tracking-[-0.021875rem]">5</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
        </div>
      </div>
      
      

      {/* 하단 고정 버튼 */}
      <button className="fixed bottom-[8.125rem] right-5 bg-primary flex h-[3.5rem] px-[1rem] justify-center items-center gap-[0.25rem] rounded-[3rem] shadow-[0_0.25rem_1.5625rem_rgba(0,0,0,0.25)]">
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
