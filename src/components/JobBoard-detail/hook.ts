import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ApiResponse } from "./types";

const useJobBoardDetail = () => {
  const param = useParams();
  const [boardData, setBoardData] = useState<ApiResponse | null>(null);

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          throw new Error("토큰이 없습니다. 로그인이 필요합니다.");
        }

        const response = await fetch(
          `https://api.kochokchok.shop/api/v1/boards/${param.boardId}`,
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
          throw new Error(`Error: ${response.statusText}`);
        }
        const result = await response.json();
        setBoardData(result);
      } catch (err) {
        console.error("Failed to fetch boards:", err);
      }
    };
    fetchBoards();
  }, [param.boardId]);

  const images = boardData?.data?.images.map((item) => item.image_url);

  return { images, boardData };
};

export default useJobBoardDetail;
