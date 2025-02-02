"use client";

import RegionDropdown from "@/commons/regionsDropdown";
import Image from "next/image";
import useJobBoardList from "./hook";

const JobBoardList = () => {
  const {
    selectedMainRegion,
    setSelectedMainRegion,
    selectedSubRegion,
    setSelectedSubRegion,
    filteredBoards,
    router,
    ref,
    writeButton,
    isLoading,
    hasMore,
    boards,
  } = useJobBoardList();

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
      {/* 하단 고정 버튼 */}
      <button
        onClick={writeButton}
        className="fixed bottom-[5.5rem] right-5 bg-primary flex h-[3.5rem] px-[1rem] justify-center items-center gap-[0.25rem] rounded-[3rem] shadow-[0_0.25rem_1.5625rem_rgba(0,0,0,0.25)]"
      >
        <div className="text-white flex gap-1 justify-center items-center">
          <Image
            src="/icons/icon-pencil-plus_icon_24px.svg"
            alt="글쓰기 아이콘"
            width={24}
            height={24}
          />
          <span>글쓰기</span>
        </div>
      </button>
    </div>
  );
};

export default JobBoardList;
