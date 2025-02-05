// "use client";

// import { useState, useEffect, useMemo } from "react";
// import { useInView } from "react-intersection-observer";
// import { Board } from "./types";
// import { useRouter } from "next/navigation";

// const useJobBoardList = () => {
//   const router = useRouter();
//   const [boards, setBoards] = useState<Board[]>([]);
//   const [page, setPage] = useState<number>(1);
//   const [hasMore, setHasMore] = useState<boolean>(true);
//   const [isLoading, setIsLoading] = useState<boolean>(false);

//   const [selectedMainRegion, setSelectedMainRegion] = useState<string>("");
//   const [selectedSubRegion, setSelectedSubRegion] = useState<string>("");

//   // useInView 훅
//   const { ref, inView } = useInView({
//     threshold: 0.1,
//   });

//   const fetchBoards = async (pageNumber: number) => {
//     try {
//       setIsLoading(true);
//       const token = localStorage.getItem("accessToken");
//       if (!token) {
//         throw new Error("토큰이 없습니다. 로그인이 필요합니다.");
//       }

//       const response = await fetch(
//         `https://api.kochokchok.shop/api/v1/boards?page=${pageNumber}`,
//         {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           credentials: "include",
//         }
//       );

//       if (!response.ok) {
//         throw new Error(`API 호출 실패: ${response.statusText}`);
//       }

//       const data = await response.json();

//       setBoards((prev) =>
//         pageNumber === 1 ? data.data.data : [...prev, ...data.data.data]
//       );

//       // 데이터가 10개 미만이면 더 이상 데이터가 없다고 판단
//       if (data.data.data.length < 10) {
//         setHasMore(false);
//       }
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     setBoards([]);
//     setPage(1);
//     setHasMore(true);
//     fetchBoards(1); // 초기 데이터 로드
//   }, [selectedMainRegion, selectedSubRegion]);

//   useEffect(() => {
//     if (inView && hasMore && !isLoading) {
//       fetchBoards(page);
//       setPage((prev) => prev + 1); // 다음 페이지로 이동
//     }
//   }, [inView, hasMore, isLoading, page]);

//   const writeButton = () => {
//     router.push("/jobList/new");
//   };

//   const filteredBoards = useMemo(() => {
//     if (!selectedMainRegion) return boards;
//     return boards.filter((board) => {
//       const loc = board.location || "";
//       return (
//         loc.includes(selectedMainRegion) &&
//         (!selectedSubRegion || loc.includes(selectedSubRegion))
//       );
//     });
//   }, [boards, selectedMainRegion, selectedSubRegion]);

//   return {
//     selectedMainRegion,
//     setSelectedMainRegion,
//     selectedSubRegion,
//     setSelectedSubRegion,
//     filteredBoards,
//     router,
//     ref,
//     writeButton,
//     isLoading,
//     hasMore,
//     boards,
//   };
// };

// export default useJobBoardList;
