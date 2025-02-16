"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/commons/store/userStore";
import ChatListItem from "../ChatListItem";

interface ChatRoom {
  chatRoomId: string; // 채팅방 ID
  lastMessage: string; // 최신 메시지
  updatedAt: string; // 마지막 메시지 시간
  participants?: { id: number; name: string }[]; // 참가자 목록
}

export default function ChatList() {
  const user = useUserStore((state) => state.user);
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const router = useRouter();
  const userId = user.id;

  useEffect(() => {
    const fetchChatRooms = async () => {
      try {
        console.log("📌 요청하는 userId:", userId);
        const tokenStorageStr = localStorage.getItem("token-storage");
        if (!tokenStorageStr)
          throw new Error("토큰이 없습니다. 로그인이 필요합니다.");

        const tokenData = JSON.parse(tokenStorageStr);
        const token = tokenData?.accessToken;
        if (!token) throw new Error("액세스 토큰이 유효하지 않습니다.");

        const response = await fetch(`/api/trade/62/chat-rooms`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error("채팅방 목록 불러오기 실패");

        const data = await response.json();
        console.log("📌 채팅방 목록:", data);
        setChatRooms(data); // 채팅방 목록 업데이트
      } catch (error) {
        console.error("❌ 채팅방 목록 불러오기 오류:", error);
      }
    };

    fetchChatRooms();
  }, []);

  const enterChatRoom = (chatRoomId: string) => {
    router.push(`/chatList/chatRoom?roomId=${chatRoomId}`);
  };

  return (
    <div className="p-4">
      {user && (
        <div className="mb-4 text-sm text-gray-600">
          <p>이름: {user.name}</p>
          <p>이메일: {user.email}</p>
          <p>ID: {user.id}</p>
        </div>
      )}

      {/* 더미 데이터 (ChatListItem) 유지 */}
      <ChatListItem />
      <ChatListItem />

      {chatRooms.length === 0 ? (
        <p className="text-center text-gray-500 mt-5">💬 채팅방이 없습니다.</p>
      ) : (
        chatRooms.map((room) => (
          <div
            key={room.chatRoomId}
            onClick={() => enterChatRoom(room.chatRoomId)}
            className="flex p-4 border-b cursor-pointer hover:bg-gray-100"
          >
            <div className="w-12 h-12 rounded-full bg-gray-300 flex-shrink-0"></div>
            <div className="ml-3 flex-1">
              <div className="flex justify-between items-center">
                <h2 className="text-sm font-semibold">
                  {room.participants?.map((p) => p.name).join(", ") ||
                    "참가자 없음"}
                </h2>
                <span className="text-xs text-gray-500">{room.updatedAt}</span>
              </div>
              <p className="text-sm text-gray-600">
                {room.lastMessage || "메시지가 없습니다."}
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
