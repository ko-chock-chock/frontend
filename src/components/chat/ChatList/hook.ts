"use client";

import { useEffect, useState } from "react";
import { useUserStore } from "@/commons/store/userStore";
import { ChatRoom, TradePost, ChatRoomApiResponse } from "./type";

export function useChatList() {
  const user = useUserStore((state) => state.user);
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);

  // 🔥 채팅방 목록 불러오기
  useEffect(() => {
    const fetchChatRooms = async () => {
      try {
        const tokenStorageStr = localStorage.getItem("token-storage");
        if (!tokenStorageStr) throw new Error("토큰이 없습니다.");

        const tokenData = JSON.parse(tokenStorageStr);
        const token = tokenData?.accessToken;
        if (!token) throw new Error("액세스 토큰이 유효하지 않습니다.");

        const response = await fetch(`/api/trade/my-chat-rooms`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error("채팅방 목록 불러오기 실패");

        const data: ChatRoomApiResponse[] = await response.json();
        console.log("📌 채팅방 목록:", data);

        const chatRoomsWithTradeInfo = await Promise.all(
          data.map(async (room) => {
            let tradePostTitle = "제목 없음";
            let tradePostPrice = "가격 미정";
            let tradePostImage = "사진 없음";
            let tradeUserId = "";
            let tradeUserName = "";
            let tradeUserImage = "";

            try {
              const tradeResponse = await fetch(
                `/api/trade/${room.tradePostId}`,
                {
                  method: "GET",
                  headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                  },
                }
              );

              if (tradeResponse.ok) {
                const tradeData: TradePost = await tradeResponse.json();
                tradePostTitle = tradeData.title || tradePostTitle;
                tradePostPrice = tradeData.price || tradePostPrice;
                tradePostImage = tradeData.thumbnailImage || tradePostImage;
                tradeUserId = tradeData.writeUserId || "";
                tradeUserName = tradeData.writeUserName || "";
                tradeUserImage = tradeData.writeUserProfileImage || "";
              }
            } catch (error) {
              console.error(
                `❌ 게시물 정보 불러오기 실패 (ID: ${room.tradePostId})`,
                error
              );
            }

            return {
              chatRoomId: room.id,
              lastMessage: room.lastMessage || "채팅을 시작해 보세요!",
              updatedAt: room.lastMessageDateTime || "시작하지 않은 채팅",
              opponentName: room.requestUserName,
              opponentProfileImage: room.requestUserProfileImage || "",
              tradeUserProfileImage: room.writeUserProfileImage || "",
              tradePostId: room.tradePostId,
              tradePostTitle,
              tradePostPrice,
              tradePostImage,
              tradeUserId,
              tradeUserName,
              tradeUserImage,
            };
          })
        );

        setChatRooms(chatRoomsWithTradeInfo);
      } catch (error) {
        console.error("❌ 채팅방 목록 불러오기 오류:", error);
      }
    };

    fetchChatRooms();
  }, []);

  // 🔥 채팅방 삭제 기능
  const deleteChatRoom = async (postId: number, chatRoomId: string) => {
    try {
      console.log("🗑️ 채팅방 삭제 요청:", { postId, chatRoomId });

      const confirmDelete = confirm("정말로 삭제하시겠습니까?");
      if (!confirmDelete) return;

      const tokenStorageStr = localStorage.getItem("token-storage");
      if (!tokenStorageStr) throw new Error("토큰이 없습니다.");

      const tokenData = JSON.parse(tokenStorageStr);
      const token = tokenData?.accessToken;
      if (!token) throw new Error("액세스 토큰이 유효하지 않습니다.");

      const response = await fetch(
        `/api/trade/${postId}/chat-rooms/${chatRoomId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("채팅방 삭제 실패!");

      console.log("✅ 채팅방 삭제 성공!");

      setChatRooms((prevChatRooms) =>
        prevChatRooms.filter((room) => room.chatRoomId !== chatRoomId)
      );
    } catch (error) {
      console.error("🚨 채팅방 삭제 오류:", error);
      alert("채팅방 삭제에 실패했습니다.");
    }
  };

  // 🔥 마지막 채팅 시간 포맷
  const formatChatTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();

    const isToday =
      date.getFullYear() === now.getFullYear() &&
      date.getMonth() === now.getMonth() &&
      date.getDate() === now.getDate();

    if (isToday) {
      return date.toLocaleTimeString("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    }

    return date
      .toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
      .replace(/-/g, ".");
  };

  return { chatRooms, deleteChatRoom, formatChatTime, user };
}
