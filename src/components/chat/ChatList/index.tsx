"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useChatList } from "./hook";
import { ChatRoom } from "./type";

export default function ChatList() {
  const { chatRooms, deleteChatRoom, formatChatTime, user } = useChatList();
  const router = useRouter();

  const enterChatRoom = (room: ChatRoom) => {
    router.push(`/jobList/${room.tradePostId}/${room.chatRoomId}`);
  };

  return (
    <div className="p-4">
      {chatRooms.length === 0 ? (
        <p className="text-center text-gray-500 mt-5">💬 채팅방이 없습니다.</p>
      ) : (
        chatRooms
          .sort(
            (a, b) =>
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          )
          .map((room) => (
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
                    <span className="overflow-hidden text-ellipsis text-[#26220D] font-suit text-[1rem] font-semibold leading-[1.5rem] tracking-[-0.025rem]">
                      {room.tradeUserName === user?.name
                        ? room.opponentName
                        : room.tradeUserName}
                    </span>
                    <span> ・ </span>
                    <span className="text-[#545245] text-xs font-normal leading-[1.125rem] tracking-[-0.01875rem] font-suit">
                      {formatChatTime(room.updatedAt)}
                    </span>
                  </div>
                  <div>
                    <p className="max-w-[10.625rem] truncate overflow-hidden text-ellipsis text-[#8D8974] text-[0.875rem] font-normal leading-[1.3125rem] tracking-[-0.02188rem]">
                      {room.lastMessage}
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <Image
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteChatRoom(room.tradePostId, room.chatRoomId);
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
