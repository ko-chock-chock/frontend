"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/commons/store/userStore";
import Image from "next/image";

interface ChatRoom {
  chatRoomId: string;
  lastMessage: string;
  updatedAt: string;
  opponentName: string;
  opponentProfileImage?: string;
  tradeUserProfileImage?: string;
  tradePostId: number;
  tradePostTitle?: string;
  tradePostPrice?: string;
  tradePostImage?: string;
  tradeUserId: string;
  tradeUserName: string;
  tradeUserImage: string;
}

interface TradePost {
  title: string;
  price: string;
  thumbnailImage: string;
  writeUserId: string;
  writeUserName: string;
  writeUserProfileImage: string;
}

interface ChatRoomApiResponse {
  writeUserProfileImage: string;
  id: string;
  lastMessage?: string;
  lastMessageDateTime?: string;
  requestUserName: string;
  requestUserProfileImage?: string;
  tradePostId: number;
}

export default function ChatList() {
  const user = useUserStore((state) => state.user);
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const router = useRouter();
  const userId = user?.id;

  useEffect(() => {
    const fetchChatRooms = async () => {
      try {
        console.log("📌 요청하는 userId:", userId);
        const tokenStorageStr = localStorage.getItem("token-storage");
        if (!tokenStorageStr) throw new Error("토큰이 없습니다.");

        const tokenData = JSON.parse(tokenStorageStr);
        const token = tokenData?.accessToken;
        if (!token) throw new Error("액세스 토큰이 유효하지 않습니다.");

        // 🔥 채팅방 목록 불러오기
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

        // 🔥 각 채팅방의 게시물 정보 가져오기
        const chatRoomsWithTradeInfo = await Promise.all(
          data.map(async (room: ChatRoomApiResponse) => {
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

                console.log("📌 게시물 정보:", tradeData);
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
              updatedAt: room.lastMessageDateTime || "알 수 없음",
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

  const deleteChatRoom = async (postId: number, chatRoomId: string) => {
    try {
      console.log("🗑️ 채팅방 삭제 요청:", { postId, chatRoomId });

      // 1️⃣ 저장된 토큰 가져오기
      const tokenStorageStr = localStorage.getItem("token-storage");
      if (!tokenStorageStr) throw new Error("토큰이 없습니다.");

      const tokenData = JSON.parse(tokenStorageStr);
      const token = tokenData?.accessToken;
      if (!token) throw new Error("액세스 토큰이 유효하지 않습니다.");

      // 2️⃣ DELETE 요청 보내기
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

      // 3️⃣ 응답 확인
      if (!response.ok) throw new Error("채팅방 삭제 실패!");

      console.log("✅ 채팅방 삭제 성공!");

      // 4️⃣ 삭제된 채팅방을 화면에서 제거
      setChatRooms((prevChatRooms) =>
        prevChatRooms.filter((room) => room.chatRoomId !== chatRoomId)
      );
    } catch (error) {
      console.error("🚨 채팅방 삭제 오류:", error);
      alert("채팅방 삭제에 실패했습니다.");
    }
  };

  const enterChatRoom = (room: ChatRoom) => {
    const url = `/jobList/${room.tradePostId}/${room.chatRoomId}`;

    router.push(url);
  };

  {
    chatRooms.map((room) => {
      return (
        <div key={room.chatRoomId}>
          <p>{room.opponentName}</p>
        </div> // ✅ 닫는 태그 추가
      );
    });
  }

  return (
    <div className="p-4">
      {chatRooms.length === 0 ? (
        <p className="text-center text-gray-500 mt-5">💬 채팅방이 없습니다.</p>
      ) : (
        chatRooms.map((room) => (
          <div
            key={room.chatRoomId}
            className="flex p-4 px-5 justify-between items-start self-stretch backdrop-blur-[2px] cursor-pointer hover:bg-gray-100"
            onClick={() => enterChatRoom(room)}
          >
            <div className="flex">
              {/* 프로필 이미지 적용 */}
              <div
                className="w-12 h-12 rounded-3xl bg-center bg-cover bg-no-repeat flex-shrink-0"
                style={{
                  backgroundImage:
                    room.tradeUserName === user?.name
                      ? room.opponentProfileImage
                        ? `url(${room.opponentProfileImage})`
                        : "none"
                      : room.tradeUserProfileImage
                      ? `url(${room.tradeUserProfileImage})`
                      : "none",
                  backgroundColor: "#d3d3d3", // ✅ 상대방 프로필이 없으면 회색 배경 적용
                }}
              ></div>

              <div className="ml-[1rem] mr-[0.5rem]">
                <div className="flex flex-row items-center gap-1">
                  {/* 상대방 이름 적용 */}
                  <span className="overflow-hidden text-ellipsis text-[#26220D] font-suit text-[1rem] font-semibold leading-[1.5rem] tracking-[-0.025rem]">
                    {room.tradeUserName === user?.name
                      ? room.opponentName
                      : room.tradeUserName}
                  </span>
                  <span> ・ </span>
                  {/* 마지막 메시지 시간 적용 */}
                  <span className="text-[#545245] text-xs font-normal leading-[1.125rem] tracking-[-0.01875rem] font-suit">
                    {room.updatedAt}
                  </span>
                </div>
                <div>
                  {/* 마지막 메시지 적용 */}
                  <p className="max-w-[10.625rem] truncate overflow-hidden text-ellipsis text-[#8D8974] text-[0.875rem] font-normal leading-[1.3125rem] tracking-[-0.02188rem]">
                    {room.lastMessage}
                  </p>
                </div>
              </div>
            </div>
            <div>
              {/* 채팅방 삭제 아이콘 */}
              <Image
                onClick={(e) => {
                  e.stopPropagation(); // ✅ 부모 클릭 이벤트 방지 (채팅방 클릭 방지)
                  deleteChatRoom(room.tradePostId, room.chatRoomId); // ✅ 올바른 함수 호출 방식
                }}
                className="min-w-[1.875rem]"
                src="/icons/cancel_icon_24px.svg"
                alt="Cancel Icon"
                width={30}
                height={30}
              />
            </div>
          </div>
        ))
      )}
    </div>
  );
}
