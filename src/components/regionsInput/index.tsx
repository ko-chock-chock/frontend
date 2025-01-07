import { useState } from "react";


export const regions = [
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

  
export const useRegionSelector = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState("지역 선택");
  const [currentSubRegions, setCurrentSubRegions] = useState<string[]>([]);

  const toggleDropdown = () => {
    if (!isDropdownOpen) {
      setCurrentSubRegions([]);
    }
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleRegionClick = (regionName: string) => {
    const region = regions.find((r) => r.name === regionName);
    if (region) {
      setCurrentSubRegions(region.subRegions);
      setSelectedRegion(region.name);
    }
  };

  const handleSubRegionClick = (subRegion: string) => {
    setSelectedRegion(`${selectedRegion.split(" ")[0]} ${subRegion}`);
    setIsDropdownOpen(false);
  };

  return {
    regions,
    isDropdownOpen,
    selectedRegion,
    currentSubRegions,
    toggleDropdown,
    handleRegionClick,
    handleSubRegionClick,
  };
};
