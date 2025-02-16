"use client";

import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import Image from "next/image";
import Button from "@/commons/Button";
import { useRouter, useSearchParams } from "next/navigation";
import Input from "@/commons/input";

interface Message {
  type: string; // 메시지 타입 ('text' 또는 'system')
  text?: string; // 일반 메시지 내용
  time: string; // 시간
  sender: string; // 발신자
  senderId: string; // 발신자ID
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
  const socket = io("ws://3.36.40.240:8001", {
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 3000,
  });
  const searchParams = useSearchParams();
  const roomId = searchParams.get("roomId"); // ✅ URL에서 roomId 가져오기

  socket.on("connect", () => {
    console.log("✅ 소켓 서버 연결 성공!");
  });

  socket.on("connect_error", (error) => {
    console.error("🚨 소켓 연결 오류 발생:", error);
  });

  socket.on("disconnect", (reason) => {
    console.warn("⚠️ 소켓 연결이 끊어졌습니다:", reason);
  });

  useEffect(() => {
    scrollToBottom(); // messages 상태가 변경될 때마다 실행
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); // 채팅창 스크롤을 가장 아래로 이동
  };

  const onClickDetailBtn = () => {
    setDetail((prev) => !prev); // 현재 상태를 반대로 변경 (토글 기능)
  };

  // 메시지 수신 설정
  useEffect(() => {
    if (!socket) return;

    socket.on("message", (message) => {
      console.log("수신한 메시지:", message);

      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off("message");
    };
  }, []);

  useEffect(() => {
    if (!roomId) return;

    console.log("✅ 현재 채팅방 ID:", roomId);

    // ✅ 특정 채팅방 입장
    socket.emit("joinRoom", { roomId });

    socket.on("message", (message) => {
      console.log("📩 메시지 수신:", message);
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      console.log("🚪 채팅방 나가기:", roomId);
      socket.emit("leaveRoom", { roomId }); // ✅ 채팅방 나가기
      socket.off("message");
    };
  }, [roomId]);

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

  // 로그인 처리 함수
  const handleLogin = () => {
    if (!inputValue.trim()) return;

    setUsername(inputValue); // 입력된 이름으로 사용자 설정
    setIsLogin(true); // 로그인 상태로 변경
    setInputValue(""); // 입력 필드 초기화
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
    };

    socket.emit("message", newMessage); // 서버로 메시지 전송
    setMessages((prev) => [...prev, newMessage]); // 자신의 화면에 즉시 반영
  };

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
              backgroundImage: "url('/path-to-image')",
              backgroundColor: "#d3d3d3",
            }}
          ></div>
          <div className="w-full">
            <div className="flex justify-between">
              <span className="max-w-[250px] truncate">
                우리 강아지 산책 시켜주실 분~
              </span>
              <span className="font-extrabold">구인중</span>
            </div>
            <div>
              <span className="font-extrabold">10,000 원</span>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-[8px] mx-8 flex flex-col items-start gap-6 overflow-y-auto flex-1">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`w-full flex ${
              message.sender === username ? "justify-end" : "justify-start"
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
                {message.sender === username && (
                  <span className="flex items-end min-w-[3.8125rem] mr-[5px] text-[#8D8974] text-center text-sm font-medium leading-5 tracking-[-0.01875rem]">
                    {message.time || "시간 없음"}
                  </span>
                )}

                {/* 상대 아이콘 */}
                {message.sender !== username && (
                  <div
                    className="w-[40px] h-[40px] mr-2 rounded-3xl bg-center bg-cover bg-no-repeat flex-shrink-0"
                    style={{
                      backgroundColor: "#d3d3d3",
                    }}
                  ></div>
                )}

                <div
                  className={`max-w-[79%] px-3 py-2 ${
                    message.sender === username
                      ? "bg-[#E9E8E3] rounded-tl-lg rounded-tr-lg rounded-bl-lg rounded-br-none"
                      : "bg-[#BFE5B3] rounded-tl-none rounded-tr-lg rounded-bl-lg rounded-br-lg "
                  }text-[#26220D] text-base font-medium leading-6 tracking-[-0.025rem]`}
                >
                  {message.text}
                </div>
                {/* 상대가 보낸 메세지라면 시간은 오른쪽에 표시 */}
                {message.sender !== username && (
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
            {username === "나" && (
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
