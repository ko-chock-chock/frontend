"use client";

import Input from "@/commons/input";
import Image from "next/image";
import { useComment } from "./hook";
import { useUserStore } from "@/commons/store/userStore";

export default function Comment() {
  const user = useUserStore((state) => state.user);

  const {
    postId,
    bookmarkToggle,
    toggleBookmark,
    inputValue,
    setInputValue,
    comments,
    onClickSubmit,
    text,
    textareaRef,
    replyContainerRef,
    replyingComments,
    onClickSubmitReply,
    handleInput,
    handleReplyClick,
    handleCancel,
    editingComments,
    editedText,
    onEditComment,
    onCancelEdit,
    setEditedText,
    onSaveEdit,
    onDeleteComment,
  } = useComment();

  return (
    <>
      <section>
        {/* 하단 입력 & 북마크 버튼 */}
        <div className="w-full bg-[#FDFCF8]">
          {/* 만든거 */}
          {/* 댓글 리스트 */}
          <div className="space-y-6 px-5 pb-20 ">
            {/* 개별 댓글 */}
            <div className="flex flex-col gap-4">
              {/* ---------- */}
              {comments.map((comment) => (
                <div key={comment.id} className="space-y-4 mb-4">
                  {/* 🟢 댓글 (기존 코드) */}
                  <div className="flex items-start space-x-3">
                    {/* 프로필 이미지 */}
                    <div
                      className="w-12 h-12 rounded-3xl bg-center bg-cover bg-no-repeat bg-[#d3d3d3] flex-shrink-0"
                      style={{
                        backgroundImage: `url(${comment.writeUserProfileImage})`,
                      }}
                    ></div>

                    {/* 댓글 내용 */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold">
                            {comment.writeUserName}
                          </span>
                          <span className="text-gray-500 text-sm">
                            {new Date(comment.createdAt).toLocaleDateString(
                              "ko-KR"
                            )}
                          </span>
                        </div>

                        {user?.name === comment.writeUserName && (
                          <div className="flex space-x-6 text-sm text-gray-600">
                            <>
                              <span
                                className="cursor-pointer text-green-600"
                                onClick={() =>
                                  onEditComment(comment.id, comment.content)
                                }
                              >
                                수정
                              </span>
                              <span
                                className="cursor-pointer text-red-500"
                                onClick={() =>
                                  onDeleteComment(postId, comment.id)
                                }
                              >
                                삭제
                              </span>
                            </>
                          </div>
                        )}
                      </div>

                      {/* ✅ 수정 중이면 textarea 표시, 아니면 기존 텍스트 표시 */}
                      {editingComments[comment.id] ? (
                        <div className="p-4 rounded-xl border focus-within:border-green-500 cursor-text">
                          <textarea
                            className="resize-none w-full px-2 py-3 rounded-md border-none bg-transparent focus:outline-none overflow-hidden"
                            placeholder="댓글을 수정해주세요."
                            value={editedText[comment.id]}
                            onChange={(e) =>
                              setEditedText((prev) => ({
                                ...prev,
                                [comment.id]: e.target.value,
                              }))
                            }
                            rows={1}
                          ></textarea>

                          <div className="flex justify-end gap-2 mt-3">
                            <button
                              className="px-4 py-2 rounded-2xl text-gray-600 bg-[#E9E8E2] transition hover:bg-gray-300"
                              onClick={() => onCancelEdit(comment.id)}
                            >
                              취소
                            </button>
                            <button
                              className="px-4 py-2 rounded-2xl bg-green-600 text-white transition hover:bg-green-700"
                              onClick={() => onSaveEdit(postId, comment.id)}
                            >
                              저장
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-gray-700">{comment.content}</p>
                      )}

                      {/* 🟢 답글 달기 버튼 */}
                      {!replyingComments[comment.id] && (
                        <button
                          className="text-sm text-green-600 mt-1 hover:underline"
                          onClick={() => handleReplyClick(comment.id)}
                        >
                          답글 달기
                        </button>
                      )}
                    </div>
                  </div>

                  {/* 🟢 대댓글 입력창 (isReplying이 true일 때만 보이게) */}
                  {replyingComments[comment.id] && (
                    <div
                      className="ml-16 p-4 rounded-xl border focus-within:border-green-500 cursor-text"
                      ref={replyContainerRef}
                    >
                      {/* 대댓글 입력 필드 */}
                      <textarea
                        ref={textareaRef}
                        className="resize-none w-full px-2 py-3 rounded-md border-none bg-transparent focus:outline-none overflow-hidden"
                        placeholder="답글을 입력해주세요."
                        value={text}
                        onChange={handleInput}
                        rows={1}
                      ></textarea>

                      {/* 버튼 영역 */}
                      <div className="flex justify-end gap-2 mt-3">
                        <button
                          className="px-4 py-2 rounded-2xl text-gray-600 bg-[#E9E8E2] transition hover:bg-gray-300"
                          onClick={() => handleCancel(comment.id)}
                        >
                          취소
                        </button>
                        <button
                          className="px-4 py-2 rounded-2xl bg-green-600 text-white transition hover:bg-green-700"
                          onClick={() =>
                            onClickSubmitReply(postId, comment.id, text)
                          }
                        >
                          등록
                        </button>
                      </div>
                    </div>
                  )}

                  {/* 🟢 대댓글 목록 */}
                  <div className="flex flex-col gap-4 ml-16 space-y-3">
                    {comment.replies?.map((reply) => (
                      <div
                        key={reply.id}
                        className="flex items-start space-x-3"
                      >
                        <div
                          className="w-12 h-12 rounded-3xl bg-center bg-cover bg-no-repeat bg-[#d3d3d3] flex-shrink-0"
                          style={{
                            backgroundImage: `url(${reply.writeUserProfileImage})`,
                          }}
                        ></div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold">
                              {reply.writeUserName}
                            </span>
                            <span className="text-gray-500 text-sm">
                              {new Date(reply.createdAt).toLocaleDateString(
                                "ko-KR"
                              )}
                            </span>
                          </div>
                          <p className="text-gray-700">{reply.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <footer className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t">
            <div className="flex justify-between items-center gap-2">
              {/* 북마크 버튼 */}
              <div
                className="min-w-[3rem] h-full"
                onClick={() => toggleBookmark(postId)}
              >
                <Image
                  src={
                    bookmarkToggle
                      ? "/images/community_detailPage_unBookmark_44px.svg"
                      : "/images/community_detailPage_bookmark_44px.svg"
                  }
                  alt="Bookmark Icon"
                  width={44}
                  height={44}
                />
              </div>

              {/* 메시지 입력창 */}
              <div className="w-full">
                <Input
                  className="w-full h-12 flex items-center gap-2 rounded-[5rem] border border-[#BBB8AB] bg-[#F4F3F1] text-base font-medium px-4"
                  placeholder="메세지를 입력해주세요."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
              </div>

              {/* 전송 버튼 */}
              <div className="min-w-[3rem] h-full">
                <Image
                  onClick={() => onClickSubmit(postId, inputValue)}
                  src="/images/chat_send_btn_img_44px.svg"
                  alt="Send Icon"
                  width={44}
                  height={44}
                />
              </div>
            </div>
          </footer>
        </div>
      </section>
    </>
  );
}
