"use client";
import { useEffect, useState } from "react";
import { authenticatedFetch } from "../auth/utils/tokenUtils";
import { useRouter } from "next/navigation";
import { Board } from "./types";

const useJobBoardList = () => {
  const router = useRouter();
  const [boards, setBoards] = useState<Board[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedMainRegion, setSelectedMainRegion] = useState<string>("");
  const [selectedSubRegion, setSelectedSubRegion] = useState<string>("");
  const [keyword] = useState<string>(""); // 검색어 상태 추가 ----> 추후에 검색기능 추가할 때 이용(setKeyword)

  const region = selectedSubRegion
    ? `${selectedMainRegion} ${selectedSubRegion}`
    : selectedMainRegion;

  const fetchBoards = async (keyword: string, region: string) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("토큰이 없습니다. 로그인이 필요합니다.");
      }

      const queryParams = new URLSearchParams();
      if (keyword) queryParams.append("keyword", keyword);
      if (region) queryParams.append("region", region);

      const response = await authenticatedFetch(
        `/api/trade?${queryParams.toString()}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error(`API 호출 실패: ${response.statusText}`);
      }

      const data: Board[] = await response.json();
      setBoards(data);
      console.log("API 데이터:", data);
    } catch (error) {
      console.error("fetchBoards 오류:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setBoards([]);
    fetchBoards(keyword, region);
  }, [keyword, region]);

  const writeButton = () => {
    router.push("/jobList/new");
  };

  return {
    boards,
    isLoading,
    selectedMainRegion,
    setSelectedMainRegion,
    selectedSubRegion,
    setSelectedSubRegion,
    writeButton,
    router,
  };
};

export default useJobBoardList;
