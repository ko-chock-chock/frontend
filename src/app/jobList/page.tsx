'use client';
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

const JobListWithToggle = () => {
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
    <div className="p-4 min-h-screen">
      {/* 헤더 */}
      <div className="overflow-hidden text-gray-900 truncate font-suit text-[20px] font-bold leading-[1.5] tracking-[-0.5px]">집사 구인</div>

      {/* 지역 선택 드롭다운 */}
      <div className="relative mb-4">
        <button
          className="flex items-center gap-1 px-2 py-1 rounded-full bg-gray-200"
          onClick={toggleDropdown}
        >
          <span>{selectedRegion}</span>
          <span>{isDropdownOpen ? "▲" : "▼"}</span>
        </button>

        {isDropdownOpen && (
          <div className="absolute z-10 mt-2 bg-white border rounded-lg shadow w-full">
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

      {/* 잡사 리스트 */}
      <div className="flex flex-col items-center gap-3 w-full p-5 bg-black" >
          <div
            // key={index}
            className="flex items-center w-full bg-white p-4 rounded-lg shadow-sm"
          >
            {/* 이미지 박스 */}
            <div className="w-[100px] h-[100px] rounded-[12px] bg-cover bg-no-repeat bg-center bg-slate-500"></div>

            {/* 텍스트 컨텐츠 */}
            <div className="ml-4 flex-1">
              <div className="text-lg font-medium">제목</div >
              <div className="text-sm text-gray-500">{selectedRegion} · 1주 전</div>
              <div className="text-lg font-bold mt-1 text-gray-700">0,000원</div>

              {/* 상태 및 아이콘 */}
              <div className="text-sm text-gray-500 flex items-center space-x-2 mt-1">
                <span>홍길동</span>
                <span>•</span>
                <span className="flex items-center">
                  ❤️ <span className="ml-1">5</span>
                </span>
                <span>•</span>
                <span className="flex items-center">
                  👀 <span className="ml-1">5</span>
                </span>
              </div>
            </div>
          </div>
      </div>

      {/* 하단 고정 버튼 */}
      <button className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-full shadow-lg hover:bg-green-600 flex items-center">
        <span className="mr-2">✏️</span> 글쓰기
      </button>
    </div>
  );
};

export default JobListWithToggle;
