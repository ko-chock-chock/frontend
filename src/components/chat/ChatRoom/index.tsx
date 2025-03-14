"use client";

import Image from "next/image";
import Button from "@/commons/Button";
import Input from "@/commons/input";
import { useChatRoom } from "./hook";
export default function ChatRoom() {
  const {
    sendMessage,
    onClickApprove,
    handleFileChange,
    onClickImage,
    onClickDetailBtn,
    onClickMap,
    postData,
    messages,
    user,
    inputValue,
    setInputValue,
    fileInputRef,
    detail,
    inputRef,
    messagesEndRef,
  } = useChatRoom();

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
                  <div className="w-full min-h-[7.5rem] flex flex-col p-2 px-5 items-start gap-4 self-stretch border-l-[2.5px] border-[#72C655]">
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

              {/* 📝 REVIEW 타입 메시지 */}
              {message.type === "REVIEW" && (
                <div className="flex flex-col w-full">
                  <div className="w-full min-h-[3.5rem] flex flex-col p-2 px-5 items-start gap-4 self-stretch border-l-[2.5px] border-[#72C655]">
                    <div className="flex flex-col self-stretch text-[#26220D] font-suit text-base font-medium leading-[1.5rem] tracking-[-0.025rem]">
                      {message.message.split("\n").map((line, i) => (
                        <span key={i}>
                          {line}
                          <br />
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* ⏰ 메시지 시간 표시 */}
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

      {detail && (
        <div className="flex w-full px-5 pb-5 pt-0 flex-col items-center rounded-t-[1.75rem] bg-[#FDFCF8]">
          <div className="w-1/6 h-[0.25rem] rounded-[6.25rem] bg-[#BBB8AB] my-4"></div>
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
