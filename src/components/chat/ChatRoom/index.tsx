/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import Image from "next/image";
import Button from "@/commons/Button";
import { useRouter } from "next/navigation";
import Input from "@/commons/input";
import { useUserStore } from "@/commons/store/userStore";
import { fetchData } from "@/utils/fetchAPI"; // ✅ fetchData 함수 임포트
import { useParams } from "next/navigation";

interface Message {
  createdAt?: string;
  writeUserName?: string;
  message: string;
  chatRoomId: any;
  type: string; // 메시지 타입 ('text' 또는 'system')
  text?: string; // 일반 메시지 내용
  writeUserProfileImage?: string;
  writeUserId?: number | undefined;
}

export default function ChatRoom() {
  const { boardId, chatId } = useParams();
  const [messages, setMessages] = useState<Message[]>([]); // 채팅 메시지 상태
  const [inputValue, setInputValue] = useState(""); // 입력 필드 상태
  const [detail, setDetail] = useState(false); // 상세 버튼 (숨김 상태)
  const inputRef = useRef<HTMLInputElement>(null); // 입력 필드 DOM에 접근하기 위한 ref
  const messagesEndRef = useRef<HTMLDivElement>(null); // 채팅 메시지 목록의 끝을 참조하는 ref
  const router = useRouter(); // useRouter 훅 사용
  const roomId = chatId; // ✅ URL에서 roomId 가져오기
  const postId = boardId; // 해당 게시물의 ID
  const user = useUserStore((state) => state.user) ?? {
    name: "",
    id: 0,
    profileImage: "",
  }; // 로그인한 유저정보 가져옴
  const stompClientRef = useRef<Client | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const isFetched = useRef(false);

  // ✅ 게시물 데이터 상태
  const [postData, setPostData] = useState({
    thumbnailImage: "",
    title: "",
    price: 0,
    state: "",
    postWriteUserId: "",
    postWriteUserName: "", // 게시물쓴 사람
    postWriteUserProfileImage: "",
  });

  console.log(user.profileImage);

  // ✅ 토큰 가져오기 함수
  const getAccessToken = (): string | null => {
    const tokenStorageStr = localStorage.getItem("token-storage");
    if (!tokenStorageStr) return null;
    const tokenData = JSON.parse(tokenStorageStr);
    return tokenData?.accessToken || null;
  };

  useEffect(() => {
    // ✅ 현재 환경에 맞는 WebSocket 프로토콜 설정
    const httpProtocol =
      window.location.protocol === "https:" ? "https" : "http";
    const socketUrl = `${httpProtocol}://3.36.40.240:8001/ws`;

    console.log("🌐 WebSocket 연결 URL:", socketUrl);

    // ✅ HTTPS 환경에서 HTTP WebSocket 차단 방지
    if (window.location.protocol === "https:" && !socketUrl.startsWith("wss")) {
      console.error(
        "❌ HTTPS 환경에서는 WSS(WebSocket Secure) 연결이 필요합니다."
      );
      return;
    }

    if (stompClientRef.current) {
      console.log("🔄 기존 WebSocket 연결 종료 후 재연결");
      stompClientRef.current.deactivate();
    }

    const socket = new SockJS(socketUrl);
    const stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000, // 5초마다 자동 재연결
      onConnect: () => {
        console.log("✅ WebSocket 연결 성공!");

        // 3️⃣ (메시지 수신 설정)
        stompClient.subscribe(`/topic/chat/${Number(roomId)}`, (message) => {
          try {
            console.log("📩 메시지 수신됨:", message.body); // 메시지가 도착하는지 확인
            const receivedMessage = JSON.parse(message.body);
            console.log("✅ 파싱된 메시지:", receivedMessage);

            // 상태 업데이트 전 콘솔 출력
            console.log("🛠 기존 messages 상태:", messages);

            setMessages((prevMessages) => {
              console.log("📌 업데이트될 messages 상태:", [
                ...prevMessages,
                receivedMessage,
              ]);
              return [...prevMessages, receivedMessage];
            });
          } catch (error) {
            console.error("🚨 메시지 파싱 오류:", error);
          }
        });
      },
      onStompError: (frame) => {
        console.error("🚨 STOMP 오류 발생:", frame);
      },
    });

    stompClient.activate();
    stompClientRef.current = stompClient;

    return () => {
      if (stompClientRef.current) {
        console.log("🛑 WebSocket 연결 해제");
        stompClientRef.current.deactivate();
      }
    };
  }, [roomId]);

  // ✅ 이전 채팅 메시지 불러오기
  useEffect(() => {
    const fetchChatMessages = async () => {
      // ✅ fetchData 호출 시 제네릭으로 `ChatMessage[]` 지정
      const response = await fetchData<Message[]>(
        `/api/trade/${postId}/chat-rooms/${roomId}/messages`
      );

      if (response.success && response.data) {
        setMessages(response.data.reverse()); // ✅ 최신 메시지가 아래로 정렬되도록 수정
      } else {
        console.error("❌ 채팅 내역 불러오기 실패:", response.message);
      }
    };

    fetchChatMessages();
  }, [roomId]);

  // ✅ 게시물 데이터 불러오기 (제목, 가격, 이미지, 작성자 정보)
  useEffect(() => {
    if (!postId || isFetched.current) return; // ✅ 이미 실행됐다면 중복 실행 방지
    isFetched.current = true; // ✅ 한 번 실행되면 다시 실행되지 않도록 설정

    const fetchPostState = async () => {
      try {
        const token = getAccessToken();
        if (!token) {
          console.error("❌ 인증 토큰이 없습니다.");
          return;
        }

        const response = await fetch(`/api/trade/${postId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("게시물 정보를 불러오는 데 실패했습니다.");
        }

        const data = await response.json();
        console.log("📌 API에서 받은 게시물 정보:", data);

        setPostData({
          thumbnailImage: data.thumbnailImage || "",
          title: data.title || "제목 없음",
          price: data.price ?? 0,
          state: data.state || "",
          postWriteUserId: data.writeUserId || "",
          postWriteUserName: data.postWriteUserName || "",
          postWriteUserProfileImage: data.writeUserProfileImage || "",
        });
      } catch (error) {
        console.error("🚨 게시물 데이터 가져오기 실패:", error);
      }
    };

    fetchPostState();
  }, [postId]); // ✅ postId 변경 시 한 번만 실행

  // ✅ 텍스트 메시지 전송하는 경우
  const sendMessage = () => {
    if (!inputValue.trim()) return; // 빈 메세지 방지

    const chatMessage: Message = {
      chatRoomId: Number(roomId), // ✅ 문자열이 아니라 숫자로 변환
      type: "TEXT", // 메세지 타입
      message: inputValue, // 메세지 내용
      writeUserName: user?.name ?? "", // 현재 로그인 사용자 이름
      writeUserProfileImage: user?.profileImage ?? "",
      writeUserId: user?.id,
      createdAt: "",
    };
    console.log("📤 메시지 전송:", chatMessage);

    if (stompClientRef.current && stompClientRef.current.connected) {
      stompClientRef.current.publish({
        destination: "/app/chat/send", // 🔥 이 부분이 서버에서 받는 경로
        body: JSON.stringify(chatMessage),
      });
      console.log("✅ 메시지 전송 성공!");
    } else {
      console.error("🚨 WebSocket 연결 안됨! 메시지 전송 실패");
    }
    setInputValue("");
    inputRef.current?.focus();
  };

  // 산책 승인 메시지 전송하는 경우
  const onClickApprove = () => {
    const walkMessage: Message = {
      chatRoomId: Number(roomId),
      type: "LOCATION",
      message: "산책을 시작하려 해요!\n우리 반려동물의 위치를 확인해 보세요!",

      createdAt: new Date().toISOString(), // ISO 형식
      writeUserId: user?.id,
    };

    if (stompClientRef.current && stompClientRef.current.connected) {
      stompClientRef.current.publish({
        destination: "/app/chat/send", // 🔥 이 부분이 서버에서 받는 경로야
        body: JSON.stringify(walkMessage),
      });
      console.log("✅ 메시지 전송 성공!");
    } else {
      console.error("🚨 WebSocket 연결 안됨! 메시지 전송 실패");
    }
  };

  // 이미지 전송하는 경우
  const uploadImage = async (file: File): Promise<string[]> => {
    try {
      console.log("📤 이미지 업로드 시작...");

      const token = getAccessToken();
      if (!token) throw new Error("토큰이 없습니다. 로그인이 필요합니다.");

      const formData = new FormData();
      formData.append("files", file); // ✅ `files` 키로 파일 추가 (API 문서 참고)

      console.log("📸 전송할 이미지 파일:", formData.getAll("files"));

      const response = await fetch("/api/uploads/multiple", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // ✅ 인증 헤더 추가
        },
        body: formData, // ✅ FormData 사용
      });

      console.log("✅ 이미지 업로드 완료! 응답 상태 코드:", response.status);

      if (!response.ok) throw new Error("파일 업로드 실패");

      const data = await response.json();
      console.log("📩 서버 응답 JSON:", data);

      // 🔍 서버 응답이 예상과 같은지 확인
      if (!data || !Array.isArray(data)) {
        console.error("❌ 서버 응답 데이터가 예상과 다름:", data);
        throw new Error("서버에서 올바른 이미지 URL을 반환하지 않았습니다.");
      }

      console.log("✅ 최종 반환 이미지 URL 목록:", data);
      return data; // ✅ URL 배열 반환
    } catch (error) {
      console.error("❌ 이미지 업로드 실패:", error);

      if (error instanceof Error) {
        alert("이미지 업로드에 실패했습니다. 오류 메시지: " + error.message);
      } else {
        alert("이미지 업로드에 실패했습니다. 알 수 없는 오류가 발생했습니다.");
      }

      return [];
    }
  };

  // ✅ 파일 업로드 시 이미지 추가
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const files = Array.from(e.target.files); // ✅ 여러 개의 파일을 배열로 변환
    console.log("📸 선택된 파일들:", files);

    try {
      // 1️⃣ 모든 파일을 개별적으로 업로드하고 WebSocket으로 전송
      for (const file of files) {
        const uploadedImageUrls = await uploadImage(file); // ✅ 개별 파일 업로드
        if (uploadedImageUrls.length === 0)
          throw new Error("이미지 URL이 없습니다.");

        const imageUrl = uploadedImageUrls[0]; // ✅ 첫 번째 이미지 URL 사용
        console.log("📩 업로드된 이미지 URL:", imageUrl);

        // 2️⃣ 개별 이미지 메시지 생성 후 WebSocket으로 전송
        const imageMessage: Message = {
          chatRoomId: Number(roomId),
          type: "IMAGE",
          message: imageUrl, // ✅ 개별 이미지 URL 추가
          createdAt: new Date().toISOString(),
          writeUserId: user?.id,
          writeUserProfileImage: user?.profileImage ?? "",
        };

        console.log("📤 WebSocket으로 전송할 메시지:", imageMessage);

        if (stompClientRef.current && stompClientRef.current.connected) {
          stompClientRef.current.publish({
            destination: "/app/chat/send",
            body: JSON.stringify(imageMessage),
          });
          console.log("✅ 이미지 메시지 전송 성공!");
        } else {
          console.error("🚨 WebSocket 연결 안됨! 메시지 전송 실패");
        }
      }
    } catch (error) {
      console.error("🚨 이미지 업로드 실패:", error);
    }
  };

  const onClickImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // ✅ 파일 선택 창 열기
    }
  };

  // ✅ 채팅방 하단 자동 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 더보기 올리기
  const onClickDetailBtn = () => {
    setDetail((prev) => !prev); // 현재 상태를 반대로 변경 (토글 기능)
  };

  // 지도 페이지로 이동
  const onClickMap = () => {
    router.push(`/jobList/${postId}/${roomId}/map`);
  };

  return (
    <main className="flex flex-col h-[94dvh] max-h-[94dvh] overflow-hidden text-[#26220D] font-suit text-base">
      <section className="px-8 py-2 border-t border-b border-gray-300 mb-4">
        <div className="flex">
          <div
            className="w-12 h-12 mr-2 rounded-2xl bg-center bg-cover bg-no-repeat flex-shrink-0"
            style={{
              backgroundImage: postData.thumbnailImage
                ? `url(${postData.thumbnailImage})`
                : "none",
              backgroundColor: postData.thumbnailImage
                ? "transparent"
                : "#d3d3d3",
            }}
          ></div>
          <div className="w-full">
            <div className="flex justify-between">
              <span className="max-w-[250px] truncate">{postData.title}</span>
              <span className="font-extrabold">
                {postData.state === "TRADING" ? "게시중" : "게시완료"}
              </span>
            </div>
            <div>
              <span className="font-extrabold">{postData.price}원</span>
            </div>
          </div>
        </div>
      </section>

      {/* 채팅 메시지 목록 */}
      <section className="mb-[8px] mx-4 flex flex-col items-start gap-6 overflow-y-auto flex-1">
        {messages.map((message, index) => {
          return (
            <div
              key={index}
              className={`w-full flex ${
                message.writeUserName === user.name
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              {/* 📌 LOCATION 타입 메시지 */}
              {message.type === "LOCATION" && (
                <div className="flex flex-col w-full">
                  <div className="w-full min-h-[120px] flex flex-col p-2 px-5 items-start gap-4 self-stretch border-l-[2.5px] border-[#72C655]">
                    <div className="flex flex-col self-stretch text-[#26220D] font-suit text-base font-medium leading-[1.5rem] tracking-[-0.025rem]">
                      {message.message.split("\n").map((line, i) => (
                        <span key={i}>
                          {line}
                          <br />
                        </span>
                      ))}
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
                  {message.createdAt && (
                    <span className="flex items-end min-w-[3.8125rem] mt-4 mr-[5px] text-[#8D8974] text-center text-sm font-medium leading-5 tracking-[-0.01875rem]">
                      {new Date(message.createdAt).toLocaleTimeString("ko-KR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  )}
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />

              {/* 📌 TEXT 타입 메시지 */}
              {message.type === "TEXT" && (
                <>
                  {/* 내가 보낸 메시지라면 시간 왼쪽 */}
                  {message.writeUserName === user.name && message.createdAt && (
                    <span className="flex items-end min-w-[3.8125rem] mr-[5px] text-[#8D8974] text-center text-sm font-medium leading-5 tracking-[-0.01875rem]">
                      {new Date(message.createdAt).toLocaleTimeString("ko-KR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  )}

                  {/* 상대 아이콘 */}
                  {message.writeUserName !== user.name && (
                    <div
                      className="w-[48px] h-[48px] mr-2 rounded-3xl bg-center bg-cover bg-no-repeat flex-shrink-0"
                      style={{
                        backgroundImage: `url(${message.writeUserProfileImage})`,
                        backgroundColor: "#d3d3d3",
                      }}
                    ></div>
                  )}

                  <div
                    className={`max-w-[79%] mt-3 px-3 py-2 ${
                      message.writeUserName === user.name
                        ? "bg-[#E9E8E3] rounded-tl-lg rounded-tr-lg rounded-bl-lg rounded-br-none"
                        : "bg-[#BFE5B3] rounded-tl-none rounded-tr-lg rounded-bl-lg rounded-br-lg"
                    } text-[#26220D] text-base font-medium leading-6 tracking-[-0.025rem]`}
                  >
                    {message.message}
                  </div>

                  {/* 상대가 보낸 메세지라면 시간 오른쪽 */}
                  {message.writeUserName !== user.name && message.createdAt && (
                    <span className="flex items-end min-w-[3.8125rem] ml-[5px] text-[#8D8974] text-center text-sm font-medium leading-5 tracking-[-0.01875rem]">
                      {new Date(message.createdAt).toLocaleTimeString("ko-KR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  )}
                </>
              )}

              {message.type === "IMAGE" && (
                <>
                  {/* 내가 보낸 이미지라면 시간 왼쪽 */}
                  {message.writeUserName === user.name && message.createdAt && (
                    <span className="flex items-end min-w-[3.8125rem] mr-[5px] text-[#8D8974] text-center text-sm font-medium leading-5 tracking-[-0.01875rem]">
                      {new Date(message.createdAt).toLocaleTimeString("ko-KR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  )}

                  {/* 상대 아이콘 */}
                  {message.writeUserName !== user.name && (
                    <div
                      className="w-[48px] h-[48px] mr-2 rounded-3xl bg-center bg-cover bg-no-repeat flex-shrink-0"
                      style={{
                        backgroundImage: `url(${message.writeUserProfileImage})`,
                        backgroundColor: "#d3d3d3",
                      }}
                    ></div>
                  )}

                  <div className="max-w-[79%] mt-3 px-3 py-2">
                    <Image
                      src={message.message} // 이미지 URL
                      alt="보낸 이미지"
                      width={200}
                      height={200}
                      className="rounded-lg"
                    />
                  </div>

                  {/* 상대가 보낸 이미지라면 시간 오른쪽 */}
                  {message.writeUserName !== user.name && message.createdAt && (
                    <span className="flex items-end min-w-[3.8125rem] ml-[5px] text-[#8D8974] text-center text-sm font-medium leading-5 tracking-[-0.01875rem]">
                      {new Date(message.createdAt).toLocaleTimeString("ko-KR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  )}
                </>
              )}
              <div ref={messagesEndRef} />
            </div>
          );
        })}
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
              onClick={onClickImage}
              className=""
              src="/images/chat_image_upload_btn_img_44px.svg"
              alt="send Icon"
              width={44}
              height={44}
            />

            {/* 산책 시작하기 */}
            {Number(postData.postWriteUserId) === user.id && (
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

      <footer className="w-full">
        {/* 입력 필드 및 버튼 */}
        <div className="flex w-full items-end flex-shrink-0">
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
        </div>
      </footer>
    </main>
  );
}
