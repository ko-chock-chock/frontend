"use client";

import { useUserStore } from "@/commons/store/userStore";
import ChatList from "@/components/chat/ChatList";

// 채팅 리스트
export default function chatList() {
  // 테스트한거임
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const user = useUserStore((state) => state.user);
  return (
    <>
      <ChatList />
      <ChatList />
      <ChatList />
      {user && (
        <div>
          <p>이름: {user.name}</p>
          <p>이메일: {user.email}</p>
        </div>
      )}
    </>
  );
}
