"use client";

import RegionDropdown from "@/commons/regionsDropdown";
import { useRouter } from "next/navigation";
import React, { useState, useEffect, useMemo } from "react";
import { useInView } from "react-intersection-observer";

interface Board {
  board_id: number;
  title: string;
  contents: string;
  price: string;
  location: string;
  status: string;
  images: { image_url: string }[];
  created_date: string;
  user: { name: string };
}

const JobListPage = () => {
  const router = useRouter();
  const [boards, setBoards] = useState<Board[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [selectedMainRegion, setSelectedMainRegion] = useState<string>("");
  const [selectedSubRegion, setSelectedSubRegion] = useState<string>("");

  // useInView 훅
  const { ref, inView } = useInView({
    threshold: 0.1,
  });

  const fetchBoards = async (pageNumber: number) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("토큰이 없습니다. 로그인이 필요합니다.");
      }

      const response = await fetch(
        `https://api.kochokchok.shop/api/v1/boards?page=${pageNumber}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(`API 호출 실패: ${response.statusText}`);
      }

      const data = await response.json();

      setBoards((prev) =>
        pageNumber === 1 ? data.data.data : [...prev, ...data.data.data]
      );

      // 데이터가 10개 미만이면 더 이상 데이터가 없다고 판단
      if (data.data.data.length < 10) {
        setHasMore(false);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setBoards([]);
    setPage(1);
    setHasMore(true);
    fetchBoards(1); // 초기 데이터 로드
  }, [selectedMainRegion, selectedSubRegion]);

  useEffect(() => {
    if (inView && hasMore && !isLoading) {
      fetchBoards(page);
      setPage((prev) => prev + 1); // 다음 페이지로 이동
    }
  }, [inView, hasMore, isLoading, page]);

  const filteredBoards = useMemo(() => {
    if (!selectedMainRegion) return boards;
    return boards.filter((board) => {
      const loc = board.location || "";
      return (
        loc.includes(selectedMainRegion) &&
        (!selectedSubRegion || loc.includes(selectedSubRegion))
      );
    });
  }, [boards, selectedMainRegion, selectedSubRegion]);

  return (
    <div className="p-5">
      <RegionDropdown
        selectedMainRegion={selectedMainRegion}
        setSelectedMainRegion={setSelectedMainRegion}
        selectedSubRegion={selectedSubRegion}
        setSelectedSubRegion={setSelectedSubRegion}
      />

      <div>
        {filteredBoards.map((board) => (
          <div
            key={board.board_id}
            className="flex flex-col items-center gap-3 w-full p-4 border-b-[1.5px] border-borderBottom"
            onClick={() => router.push(`/jobList/${board.board_id}`)}
          >
            <div className="flex items-center w-full rounded-lg">
              {/* 이미지 */}
              <div
                className="w-[100px] h-[100px] rounded-[12px] bg-cover bg-no-repeat bg-center bg-gray-300"
                style={{
                  backgroundImage: `url(${board.images?.[0]?.image_url || ""})`,
                }}
              ></div>

              {/* 텍스트 */}
              <div className="ml-4 flex-1">
                <div className="text-text-primary text-section font-semibold leading-[1.5] tracking-[-0.025rem]">
                  {board.title}
                </div>
                <div className="text-text-tertiary font-suit text-sm font-medium leading-[1.5] tracking-[-0.021875rem]">
                  {board.location} ·{" "}
                  {new Date(board.created_date).toLocaleDateString()}
                </div>
                <div className="text-base-semibold mt-1 text-text-primary">
                  {Number(board.price).toLocaleString()}원
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* 무한 스크롤 트리거 */}
        <div ref={ref} className="h-4" />
      </div>

      {isLoading && (
        <div className="text-center p-4">데이터를 불러오는 중...</div>
      )}
      {!hasMore && !isLoading && boards.length > 0 && (
        <div className="text-center p-4 text-gray-500">
          더 이상 게시물이 없습니다.
        </div>
      )}
    </div>
  );
};

export default JobListPage;
