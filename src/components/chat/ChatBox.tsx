"use client";

import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import Image from "next/image";
import Button from "@/commons/Button";
import { useRouter } from "next/navigation";

const socket = io("http://localhost:5001"); // 서버 URL에 맞게 수정

interface Message {
  type: string; // 메시지 타입 ('text' 또는 'system')
  text?: string; // 일반 메시지 내용
  time: string; // 시간
  sender: string; // 발신자
  content?: { title: string; subtitle: string }; // 시스템 메시지의 추가 내용
}

export default function ChatBox() {
  const [messages, setMessages] = useState<Message[]>([]); // 채팅 메시지 상태
  const [inputValue, setInputValue] = useState(""); // 입력 필드 상태
  const [isLogin, setIsLogin] = useState(false); // 로그인 상태
  const [username, setUsername] = useState(""); // 로그인한 사용자 이름
  const inputRef = useRef<HTMLInputElement>(null); // 입력 필드 DOM에 접근하기 위한 ref
  const messagesEndRef = useRef<HTMLDivElement>(null); // 채팅 메시지 목록의 끝을 참조하는 ref
  const router = useRouter(); // useRouter 훅 사용

  useEffect(() => {
    scrollToBottom(); // messages 상태가 변경될 때마다 실행
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); // 채팅창 스크롤을 가장 아래로 이동
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
      sender: username,
    };

    socket.emit("message", message); // 서버로 메시지 전송
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
      {!isLogin ? (
        <div className="flex flex-col items-center justify-center h-full">
          <h2 className="mb-4 text-xl font-bold">로그인</h2>
          <input
            ref={inputRef}
            className="p-3 px-4 rounded-[2.5rem] border border-[#BBB8AB] bg-[#F4F3F1] text-[#A3A08F] text-base font-medium leading-[1.5rem] tracking-[-0.025rem]"
            type="text"
            placeholder="사용자 이름을 입력하세요."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button
            className="mt-4 p-2 px-6 rounded-[2.5rem] bg-[#BFE5B3] text-[#26220D] font-medium"
            onClick={handleLogin}
          >
            로그인
          </button>
        </div>
      ) : (
        <>
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
            {username === "나" && (
              <Button
                design="design5"
                width="fit"
                className="mt-2 text-white text-[0.875rem] font-bold leading-[1.3125rem] tracking-[-0.02188rem] bg-[#4D9933]"
                onClick={onClickApprove}
              >
                산책 승인 하기
              </Button>
            )}
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

          <footer className="flex items-end">
            <div className="mx-0 flex justify-between p-2 px-5 items-center gap-2 w-full bg-[#E9E8E3]">
              <div>
                <Image
                  className="mr-1"
                  src="/images/chat_image_upload_btn_img_44px.svg"
                  alt="photo Icon"
                  width={44}
                  height={44}
                />
              </div>
              <input
                ref={inputRef}
                className="w-full flex p-3 px-4 items-center gap-2 rounded-[2.5rem] border border-[#BBB8AB] bg-[#F4F3F1] text-[#A3A08F] text-base font-medium leading-[1.5rem] tracking-[-0.025rem]"
                placeholder="메세지를 입력해주세요."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <div onClick={sendMessage}>
                <Image
                  className="mr-1"
                  src="/images/chat_send_btn_img_44px.svg"
                  alt="send Icon"
                  width={44}
                  height={44}
                />
              </div>
            </div>
          </footer>
        </>
      )}
    </main>
  );
}
