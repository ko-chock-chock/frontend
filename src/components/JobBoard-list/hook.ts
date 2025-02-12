import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Board } from "./types";

const useJobBoardList = () => {
  const router = useRouter();
  const [boards, setBoards] = useState<Board[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedMainRegion, setSelectedMainRegion] = useState<string>("");
  const [selectedSubRegion, setSelectedSubRegion] = useState<string>("");
  const [keyword] = useState<string>("");

  const [page, setPage] = useState<number>(1);
  const size = 4;
  const [hasMore, setHasMore] = useState<boolean>(true);

  // 무한 스크롤을 위한 observer ref
  const observer = useRef<IntersectionObserver>();

  const getAccessToken = (): string | null => {
    const tokenStorageStr = localStorage.getItem("token-storage");
    if (!tokenStorageStr) return null;
    const tokenData = JSON.parse(tokenStorageStr);
    return tokenData?.accessToken || null;
  };

  const region = selectedSubRegion
    ? `${selectedMainRegion} ${selectedSubRegion}`
    : selectedMainRegion;

  const fetchBoards = async (page: number, keyword: string, region: string) => {
    const token = getAccessToken();
    if (!token) throw new Error("로그인이 필요합니다.");
    setIsLoading(true);

    try {
      const queryParams = new URLSearchParams();
      if (keyword) queryParams.append("keyword", keyword);
      if (region) queryParams.append("region", region);
      queryParams.append("page", page.toString());
      queryParams.append("size", size.toString());

      const response = await fetch(
        `/api/trade/page?${queryParams.toString()}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`API 호출 실패: ${response.statusText}`);
      }

      const responseData = await response.json();
      const boardData = responseData.content;

      if (page === 1) {
        setBoards(boardData);
      } else {
        setBoards((prev) => [...prev, ...boardData]);
      }

      setHasMore(boardData.length === size);
    } catch (error) {
      console.error("fetchBoards 오류:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 마지막 요소를 관찰하는 콜백 함수
  const lastBoardElementRef = useCallback(
    (node: HTMLElement | null) => {
      if (isLoading) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore]
  );

  // 검색 조건이 변경될 때 초기화
  useEffect(() => {
    setBoards([]);
    setPage(1);
    setHasMore(true);
    fetchBoards(1, keyword, region);
  }, [keyword, region]);

  // 페이지가 변경될 때 데이터 fetching
  useEffect(() => {
    if (page > 1) {
      fetchBoards(page, keyword, region);
    }
  }, [page]);

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
    lastBoardElementRef,
  };
};

export default useJobBoardList;
