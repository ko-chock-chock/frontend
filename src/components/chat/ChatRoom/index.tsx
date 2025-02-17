"use client";

import { useState, useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
// import { io } from "socket.io-client";
import Image from "next/image";
import Button from "@/commons/Button";
import { useRouter, useSearchParams } from "next/navigation";
import Input from "@/commons/input";
import { useUserStore } from "@/commons/store/userStore";

interface Message {
  type: string; // 메시지 타입 ('text' 또는 'system')
  text?: string; // 일반 메시지 내용
  time: string; // 시간
  sender: string; // 발신자
  senderId: number; // 발신자ID
  content?: { title: string; subtitle: string }; // 시스템 메시지의 추가 내용
}

export default function ChatRoom() {
  const [messages, setMessages] = useState<Message[]>([]); // 채팅 메시지 상태
  const [inputValue, setInputValue] = useState(""); // 입력 필드 상태
  const [isLogin, setIsLogin] = useState(false); // 로그인 상태
  const [username, setUsername] = useState(""); // 로그인한 사용자 이름
  const [detail, setDetail] = useState(false); // 상세 버튼 (숨김 상태)
  const inputRef = useRef<HTMLInputElement>(null); // 입력 필드 DOM에 접근하기 위한 ref
  const messagesEndRef = useRef<HTMLDivElement>(null); // 채팅 메시지 목록의 끝을 참조하는 ref
  const router = useRouter(); // useRouter 훅 사용
  // const socket = io("ws://3.36.40.240:8001/socket.io", {
  //   transports: ["websocket", "polling"], // polling 추가
  //   reconnection: true, // 자동 재연결
  //   reconnectionAttempts: 5, // 최대 5번 재시도
  //   reconnectionDelay: 3000, // 3초 후 재시도
  // });
  const searchParams = useSearchParams();
  const roomId = searchParams.get("roomId"); // ✅ URL에서 roomId 가져오기
  const title = searchParams.get("title");
  const price = searchParams.get("price");
  const imageUrl = searchParams.get("imageUrl");
  const tradeUserId = searchParams.get("tradeUserId") || ""; // 🔥 게시물 ID 추가
  const user = useUserStore((state) => state.user); // 로그인한 유저정보 가져옴

  const socketUrl = "http://localhost:8001/ws";
  const stompClientRef = useRef<Client | null>(null);

  useEffect(() => {
    const socket = new SockJS(socketUrl);
    const stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000, // 자동 재연결 (5초마다 시도)
      onConnect: () => {
        console.log("✅ WebSocket 연결됨");

        const subscribePath = `/chat/room/${roomId}`;
        stompClient.subscribe(subscribePath, (message) => {
          const receivedMessage = JSON.parse(message.body);
          console.log("📩 메시지 수신:", receivedMessage);
          setMessages((prevMessages) => [...prevMessages, receivedMessage]);
        });
      },
      onStompError: (frame) => {
        console.error("🚨 STOMP 오류 발생:", frame);
      },
    });

    stompClient.activate(); // WebSocket 연결 활성화
    stompClientRef.current = stompClient;

    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.deactivate();
      }
    };
  }, [roomId]);

  // ✅ 채팅방 하단 자동 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const onClickDetailBtn = () => {
    setDetail((prev) => !prev); // 현재 상태를 반대로 변경 (토글 기능)
  };

  // ✅ 메시지 전송
  const sendMessage = () => {
    if (!inputValue.trim()) return;

    const message: Message = {
      type: "text",
      text: inputValue,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      sender: user.name, // 실제 사용자 이름으로 변경 필요
      senderId: user.id, // 실제 로그인된 사용자 ID로 변경 필요
    };

    // 메시지 전송 함수
    const sendMessage = () => {
      if (!inputValue.trim()) return;

      const message: Message = {
        type: "text",
        text: inputValue,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        sender: user.name, // ✅ 현재 로그인된 사용자 이름 추가
        senderId: user.id, // ✅ 현재 로그인된 사용자 ID 추가
      };

      console.log("📤 메시지 전송:", message);
      socket.emit("message", { roomId, message }); // ✅ roomId 포함하여 전송
      setMessages((prev) => [...prev, message]); // 자신의 화면에 즉시 반영
      setInputValue(""); // 입력 필드 초기화
      inputRef.current?.focus();
    };

    console.log("📤 메시지 전송:", message);
    if (stompClientRef.current && stompClientRef.current.connected) {
      stompClientRef.current.publish({
        destination: `/app/chat/${roomId}`,
        body: JSON.stringify(message),
      });
    }

    setMessages((prev) => [...prev, message]); // 메시지 즉시 반영
    setInputValue("");
    inputRef.current?.focus();
  };

  // 지도 페이지로 이동
  const onClickMap = () => {
    router.push("/map");
  };

  // 산책 승인 메시지 전송
  const onClickApprove = () => {
    const newMessage: Message = {
      type: "system",
      content: {
        title: "산책을 시작하려 해요!",
        subtitle: "우리 반려동물의 위치를 확인해 보세요!",
      },
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      sender: "System",
      senderId: 0,
    };

    socket.emit("message", newMessage); // 서버로 메시지 전송
    setMessages((prev) => [...prev, newMessage]); // 자신의 화면에 즉시 반영
  };

  console.log("📌 현재 방 정보:", {
    roomId,
    title,
    price,
    imageUrl,
    tradeUserId,
  });

  return (
    <main className="flex flex-col h-screen text-[#26220D] font-suit text-base">
      <section className="px-8 py-2 border-t border-b border-gray-300 mb-4">
        <h1 className="text-xl font-bold">채팅방: {roomId}</h1>
      </section>
      <section className="px-8 py-2 border-t border-b border-gray-300 mb-4">
        <div className="flex">
          <div
            className="w-12 h-12 mr-2 rounded-2xl bg-center bg-cover bg-no-repeat flex-shrink-0"
            style={{
              backgroundColor: "#d3d3d3",
            }}
          ></div>
          <div className="w-full">
            <div className="flex justify-between">
              <span className="max-w-[250px] truncate">{title}</span>
              <span className="font-extrabold">구인중</span>
            </div>
            <div>
              <span className="font-extrabold">{price} 원</span>
            </div>
          </div>
        </div>
      </section>

      {/* 채팅 메시지 목록 */}
      <section className="mb-[8px] mx-8 flex flex-col items-start gap-6 overflow-y-auto flex-1">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`w-full flex ${
              message.sender === user.name ? "justify-end" : "justify-start"
            }`}
          >
            {message.type === "system" ? (
              <div className="w-full min-h-[120px] flex flex-col p-2 px-5 items-start gap-4 self-stretch border-l-[2.5px] border-[#72C655]">
                <div className="flex flex-col self-stretch text-[#26220D] font-suit text-base font-medium leading-[1.5rem] tracking-[-0.025rem]">
                  <span>{message.content?.title}</span>
                  <span>{message.content?.subtitle}</span>
                </div>
                <Button design="design2" onClick={onClickMap}>
                  <Image
                    className="mr-1"
                    src="/icons/chat_location_icon_20px.svg"
                    alt="location Icon"
                    width={20}
                    height={20}
                  />
                  위치 확인하기
                </Button>
              </div>
            ) : (
              <>
                {/* 내가 보낸 메시지라면 시간은 왼쪽에 표시 */}
                {message.sender === user.name && (
                  <span className="flex items-end min-w-[3.8125rem] mr-[5px] text-[#8D8974] text-center text-sm font-medium leading-5 tracking-[-0.01875rem]">
                    {message.time || "시간 없음"}
                  </span>
                )}

                {/* 상대 아이콘 */}
                {message.sender !== user.name && (
                  <div
                    className="w-[40px] h-[40px] mr-2 rounded-3xl bg-center bg-cover bg-no-repeat flex-shrink-0"
                    style={{
                      backgroundColor: "#d3d3d3",
                    }}
                  ></div>
                )}

                <div
                  className={`max-w-[79%] px-3 py-2 ${
                    message.sender === user.name
                      ? "bg-[#E9E8E3] rounded-tl-lg rounded-tr-lg rounded-bl-lg rounded-br-none"
                      : "bg-[#BFE5B3] rounded-tl-none rounded-tr-lg rounded-bl-lg rounded-br-lg "
                  }text-[#26220D] text-base font-medium leading-6 tracking-[-0.025rem]`}
                >
                  {message.text}
                </div>
                {/* 상대가 보낸 메세지라면 시간은 오른쪽에 표시 */}
                {message.sender !== user.name && (
                  <span className="flex items-end min-w-[3.8125rem] ml-[5px] text-[#8D8974] text-center text-sm font-medium leading-5 tracking-[-0.01875rem]">
                    {message.time}
                  </span>
                )}
              </>
            )}
            <div ref={messagesEndRef} />
          </div>
        ))}
      </section>

      {/* 버튼 클릭 시 div가 나타나도록 설정 */}
      {detail && (
        <div className="flex w-full px-5 pb-5 pt-0 flex-col items-center rounded-t-[1.75rem] bg-[#FDFCF8]">
          <div className="w-1/6 h-[0.25rem] rounded-[6.25rem] bg-[#BBB8AB] my-4">
            {/* 바 */}
          </div>
          <div className="flex w-full gap-3 ">
            {/* 사진 보내기 */}
            <Image
              className=""
              src="/images/chat_image_upload_btn_img_44px.svg"
              alt="send Icon"
              width={44}
              height={44}
            />

            {/* 산책 시작하기 */}
            {Number(tradeUserId) === user.id && (
              <Image
                onClick={onClickApprove}
                className=""
                src="/images/chat_walking_dog_outside_BTN_44px.svg"
                alt="send Icon"
                width={44}
                height={44}
              />
            )}
          </div>
        </div>
      )}
      <div className="w-full">
        {/* 입력 필드 및 버튼 */}
        <footer className="flex w-full items-end">
          <div className="mx-0 flex justify-between p-4 items-center gap-2 w-full bg-[#FDFCF8]">
            <div className="min-w-[3rem] h-full" onClick={onClickDetailBtn}>
              <Image
                src={
                  detail
                    ? "/images/chat_collapse_BTN_44px.svg"
                    : "/images/chat_expand_BTN_44px.svg"
                }
                alt="photo Icon"
                width={44}
                height={44}
              />
            </div>

            <div className="w-full">
              <Input
                ref={inputRef}
                className="w-full max-h-[3rem] flex items-center gap-2 rounded-[5rem] border border-[#BBB8AB] bg-[#F4F3F1] text-base font-medium leading-[1.5rem] tracking-[-0.025rem]"
                placeholder="메세지를 입력해주세요."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
            </div>

            <div className="min-w-[3rem] h-full" onClick={sendMessage}>
              <Image
                src="/images/chat_send_btn_img_44px.svg"
                alt="send Icon"
                width={44}
                height={44}
              />
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
