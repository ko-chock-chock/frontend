/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import { BoardData, CheckLike } from "./types";
import { useParams } from "next/navigation";

const useJobBoardDetail = () => {
  const { boardId } = useParams<{ boardId: string }>();
  const [boardData, setBoardData] = useState<BoardData | null>(null);
  const [checkLike, setCheckLike] = useState(null);
  const [isLiked, setIsLiked] = useState<boolean>(false);

  // 엑세스 토큰 가져옴
  const getAccessToken = (): string | null => {
    const tokenStorageStr = localStorage.getItem("token-storage");
    if (!tokenStorageStr) return null;
    const tokenData = JSON.parse(tokenStorageStr);
    return tokenData?.accessToken || null;
  };

  useEffect(() => {
    const fetchPostData = async () => {
      const token = getAccessToken();
      if (!token) throw new Error("로그인이 필요합니다.");
      if (!boardId) return;
      try {
        // 게시글 정보 가져옴
        const response = await fetch(`/api/trade/${boardId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const result = await response.json();
        setBoardData(result);

        // 내가 좋아요한 게시글인지 확인
        const checkLikeResponse = await fetch(`/api/users/trade-posts/liked`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const checkLikeResult = await checkLikeResponse.json();
        setCheckLike(checkLikeResult);

        // 좋아요 상태
        const isAlreadyLiked = checkLikeResult.some(
          (item: CheckLike) => item.id === parseInt(boardId, 10)
        );
        setIsLiked(isAlreadyLiked);
      } catch (error) {
        console.error(error);
        alert("게시글 불러오기에 실패했습니다.");
      }
    };
    fetchPostData();
  }, [boardId]);

  const likeButtonClickHandler = async () => {
    const token = getAccessToken();
    try {
      const response = await fetch(`/api/trade/${boardId}/like`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setIsLiked((prevState) => !prevState);
      } else {
        alert("좋아요를 처리하는데 실패했습니다.");
      }
    } catch (error) {
      console.error(error);
      alert("좋아요 처리 중 오류가 발생했습니다.");
    }
  };

  return {
    likeButtonClickHandler,
    boardData,
    isLiked,
  };
};

export default useJobBoardDetail;
