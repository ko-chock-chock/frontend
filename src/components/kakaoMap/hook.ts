/* eslint-disable @typescript-eslint/no-unused-vars */
import { useUserStore } from "@/commons/store/userStore";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChatUserDataType } from "./type";

import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const useWalkMap = () => {
  const [isWalking, setIsWalking] = useState<boolean>(false); // 산책 상태 관리
  const [hasEnded, setHasEnded] = useState<boolean>(false); // 산책 종료 여부 (종료 후 재시작 불가)
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { boardId, chatId } = useParams() as {
    boardId: string;
    chatId: string;
  };
  const [chatUserData, setChatUserData] = useState<ChatUserDataType | null>(
    null
  );

  // WebSocket 연결 상태를 유지하는 전역 참조
  const stompClientRef = useRef<Client | null>(null);

  const router = useRouter();

  // 엑세스 토큰 가져옴
  const getAccessToken = (): string | null => {
    const tokenStorageStr = localStorage.getItem("token-storage");
    if (!tokenStorageStr) return null;
    const tokenData = JSON.parse(tokenStorageStr);
    return tokenData?.accessToken || null;
  };

  // 로그인 유저정보
  const loggedInUserId = useUserStore((state) => state.user?.id);

  // ✅ WebSocket 연결 설정
  useEffect(() => {
    const socket = new SockJS("http://3.36.40.240:8001/ws");
    const stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000, // 5초마다 자동 재연결
      onConnect: () => console.log("✅ WebSocket 연결 성공!"),
      onStompError: (frame) => console.error("🚨 STOMP 오류 발생:", frame),
    });

    stompClient.activate();
    stompClientRef.current = stompClient;

    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.deactivate();
      }
    };
  }, []);

  useEffect(() => {
    const checkParticipant = async () => {
      const token = getAccessToken();
      if (!token || !boardId || !chatId || !loggedInUserId) return;
      try {
        const res = await fetch(`/api/trade/${boardId}/chat-rooms/${chatId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) return;
        const result = await res.json();
        console.log("ChatUserData result", result);
        // 참여자가 아닌 경우 바로 리다이렉트
        if (
          loggedInUserId !== result.writeUserId &&
          loggedInUserId !== result.requestUserId
        ) {
          alert("접근 권한이 없습니다.");
          router.push("/");
        } else {
          setChatUserData(result);
        }
      } catch (error) {
        console.error("Error checking chat room participants:", error);
      }
    };
    checkParticipant();
  }, [boardId, chatId, loggedInUserId, router]);

  // 산책 시작 정지 핸들러
  const toggleWalking = () => {
    // 산책 종료 후에는 재시작 불가
    if (hasEnded) return;
    if (isWalking) {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
      setIsWalking(false);
      setHasEnded(true);

      // ✅ WebSocket으로 메시지 전송
      if (stompClientRef.current && stompClientRef.current.connected) {
        const reviewMessage = {
          chatRoomId: Number(chatId),
          type: "REVIEW",
          message: "산책이 종료되었습니다. 🐾\n오늘 산책은 어땠나요?",
          createdAt: new Date().toISOString(),
          writeUserId: loggedInUserId,
        };

        stompClientRef.current.publish({
          destination: "/app/chat/send",
          body: JSON.stringify(reviewMessage),
        });

        console.log("✅ 산책 종료 메시지 전송 성공!");
      } else {
        console.error("🚨 WebSocket 연결 안됨! 메시지 전송 실패");
      }

      // ✅ 채팅방으로 이동
      router.push(`/jobList/${boardId}/${chatId}`);
    } else {
      setIsWalking(true);
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);
  return {
    isWalking,
    boardId,
    hasEnded,
    chatUserData,
    toggleWalking,
  };
};

export default useWalkMap;
