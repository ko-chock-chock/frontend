import Image from "next/image";
import { useState } from "react";

const regions = [
  {
    name: "전체 보기",
  },
  {
    name: "서울",
    subRegions: [
      "강남구",
      "강동구",
      "강북구",
      "강서구",
      "관악구",
      "광진구",
      "구로구",
      "금천구",
      "노원구",
      "도봉구",
      "동대문구",
      "동작구",
      "마포구",
      "서대문구",
      "서초구",
      "성동구",
      "성북구",
      "송파구",
      "양천구",
      "영등포구",
      "용산구",
      "은평구",
      "종로구",
      "중구",
      "중랑구",
    ],
  },
  {
    name: "부산",
    subRegions: [
      "강서구",
      "금정구",
      "남구",
      "동구",
      "동래구",
      "부산진구",
      "북구",
      "사상구",
      "사하구",
      "서구",
      "수영구",
      "연제구",
      "영도구",
      "중구",
      "해운대구",
    ],
  },
  {
    name: "대구",
    subRegions: [
      "남구",
      "달서구",
      "달성군",
      "동구",
      "북구",
      "서구",
      "수성구",
      "중구",
    ],
  },
  {
    name: "제주",
    subRegions: ["제주시", "서귀포시"],
  },
];

interface RegionDropdownProps {
  selectedMainRegion: string;
  setSelectedMainRegion: (region: string) => void;
  selectedSubRegion: string;
  setSelectedSubRegion: (region: string) => void;
  buttonClassName?: string;
}

const RegionDropdown: React.FC<RegionDropdownProps> = ({
  selectedMainRegion,
  setSelectedMainRegion,
  selectedSubRegion,
  setSelectedSubRegion,
  buttonClassName = "flex items-center gap-[0.25rem] px-[0.7rem] py-[0.25rem] rounded-[1.5rem] bg-list-line",
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const allSubRegions = regions
    .filter((region) => region.subRegions)
    .flatMap((region) => region.subRegions || []);

  const currentSubRegions = (() => {
    if (selectedMainRegion === "전체 보기") {
      return allSubRegions; // "전체 보기"를 선택했을 경우 모든 하위 지역을 반환
    }
    const found = regions.find((r) => r.name === selectedMainRegion);
    return found?.subRegions || [];
  })();

  const toggleDropdown = () => {
    if (isDropdownOpen) {
      setIsDropdownOpen(false);
    } else {
      setSelectedMainRegion("");
      setSelectedSubRegion("");
      setIsDropdownOpen(true);
    }
  };

  const handleRegionClick = (regionName: string) => {
    setSelectedMainRegion(regionName);
    setSelectedSubRegion("");
  };

  const handleSubRegionClick = (subRegionName: string) => {
    setSelectedSubRegion(subRegionName);
    setIsDropdownOpen(false);
  };

  return (
    <div className="relative mb-4 flex flex-col items-end gap-[0.625rem] self-stretch">
      <button className={buttonClassName} onClick={toggleDropdown}>
        <span className="text-center text-text-secondary font-suit text-[0.875rem] font-sm leading-[1.5] tracking-[-0.021875rem]">
          {selectedSubRegion || selectedMainRegion || "지역 선택"}
        </span>
        <Image
          src="/icons/post_list_region_dropdown_icon_16px.svg"
          alt="드롭다운 메뉴 토글 아이콘"
          width={16}
          height={16}
        />
      </button>

      {isDropdownOpen && (
        <div className="absolute z-10 mt-8 bg-white border rounded-lg shadow max-h-60 overflow-y-auto">
          {!selectedMainRegion || currentSubRegions.length === 0 ? (
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
          ) : (
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
          )}
        </div>
      )}
    </div>
  );
};

export default RegionDropdown;
