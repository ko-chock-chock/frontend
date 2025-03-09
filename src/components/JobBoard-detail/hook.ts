/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import { BoardData, CheckLike } from "./types";
import { useParams, useRouter } from "next/navigation";

const useJobBoardDetail = () => {
  const { boardId } = useParams<{ boardId: string }>();
  const [boardData, setBoardData] = useState<BoardData | null>(null);
  const [checkLike, setCheckLike] = useState(null);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [isOwnPost, setIsOwnPost] = useState<boolean>(false);
  const router = useRouter();

  // 엑세스 토큰 가져옴
  const getAccessToken = (): string | null => {
    const tokenStorageStr = localStorage.getItem("token-storage");
    if (!tokenStorageStr) return null;
    const tokenData = JSON.parse(tokenStorageStr);
    return tokenData?.accessToken || null;
  };

  // 현재 로그인한 사용자 ID 가져오기 (추가)
  const getUserId = (): number | null => {
    const userStorageStr = localStorage.getItem("user-storage");
    if (!userStorageStr) return null;
    try {
      const userStorageData = JSON.parse(userStorageStr);
      return userStorageData?.state?.user?.id || null; // ✅ user ID 가져오기
    } catch (error) {
      console.error("❌ 유저 ID 파싱 실패:", error);
      return null;
    }
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
        console.log(result);

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

  useEffect(() => {
    const loggedInUserId = getUserId();
    if (boardData) {
      setIsOwnPost(boardData.writeUserId === loggedInUserId);
    }
  }, [boardData]);

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

  // ------------------------------ 찬우가 함
  // ✅ 채팅방 생성 함수 추가 (새로 추가됨)
  const handleChat = async () => {
    const buyerId = getUserId();
    const sellerId = boardData?.writeUserId;
    const postId = boardId;
    const token = getAccessToken();

    console.log("🛠️ buyerId:", buyerId);
    console.log("🛠️ sellerId:", sellerId);
    console.log("🛠️ postId:", postId);
    console.log("🛠️ token:", token);

    if (!buyerId || !sellerId || !postId || !token || buyerId === sellerId) {
      alert("유효한 요청이 아닙니다.");
      return;
    }

    try {
      const response = await fetch(`/api/trade/${postId}/chat-rooms`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: "거래 채팅방",
          tradePostId: postId,
        }),
      });

      console.log("📩 서버 응답 상태 코드:", response.status);

      // ✅ 응답이 JSON인지 확인
      const contentType = response.headers.get("content-type");
      let chatRoomId: number | null = null;

      if (contentType && contentType.includes("application/json")) {
        const data = await response.json(); // JSON 형식이면 파싱
        chatRoomId = data.chatRoomId || data; // ✅ 채팅방 ID 추출 (data에 key가 있다면 사용)
      } else {
        chatRoomId = Number(await response.text()); // ✅ 응답이 숫자 형식이라면 변환
      }

      console.log("📩 생성된 채팅방 ID:", chatRoomId);

      router.push(`/jobList/${postId}/${chatRoomId}`);
      if (!response.ok) {
        console.error("❌ 채팅방 생성 실패:", response.status);
        alert("이미 만들어진 채팅방 입니다.");
        router.push(`/chatList/`);
        return;
      }
    } catch (error) {
      console.error("🚨 API 오류:", error);
      alert("채팅방 생성 중 오류가 발생했습니다.");
    }
  };

  // ------------------------------

  return {
    likeButtonClickHandler,
    boardData,
    isLiked,
    handleChat,
    isOwnPost,
  };
};

export default useJobBoardDetail;
