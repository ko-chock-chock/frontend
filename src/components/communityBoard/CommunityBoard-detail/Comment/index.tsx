"use client";

import { useComment } from "./hook";
import { useUserStore } from "@/commons/store/userStore";
import Footer from "../Footer";

export default function Comment() {
  const user = useUserStore((state) => state.user);

  const {
    postId,
    comments,
    fetchComments,
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
    editingReplies,
    editedReplyText,
    onEditReply,
    onCancelEditReply,
    onSaveEditReply,
    onDeleteReply,
    setEditedReplyText,
  } = useComment();

  return (
    <>
      <section>
        <div className="w-full bg-[#FDFCF8]">
          <div className="space-y-6 px-5 pb-20 ">
            <div className="flex flex-col gap-4">
              {comments.map((comment) => (
                <div key={comment.id} className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div
                      className="w-12 h-12 rounded-3xl bg-center bg-cover bg-no-repeat bg-[#d3d3d3] flex-shrink-0"
                      style={{
                        backgroundImage: `url(${comment.writeUserProfileImage})`,
                      }}
                    ></div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold">
                            {comment.writeUserName}
                          </span>
                          <span className="text-gray-500 text-sm">
                            {new Date(comment.createdAt)
                              .toLocaleDateString("ko-KR", {
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit",
                              })
                              .replace(/-/g, ".")}{" "}
                            {/* 하이픈을 점으로 변경 */}
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

                      {/*  수정 중이면 textarea 표시, 아니면 기존 텍스트 표시 */}
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

                  {replyingComments[comment.id] && (
                    <div
                      className="ml-16 p-4 rounded-xl border focus-within:border-green-500 cursor-text"
                      ref={replyContainerRef}
                    >
                      <textarea
                        ref={textareaRef}
                        className="resize-none w-full px-2 py-3 rounded-md border-none bg-transparent focus:outline-none overflow-hidden"
                        placeholder="답글을 입력해주세요."
                        value={text}
                        onChange={handleInput}
                        rows={1}
                      ></textarea>

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
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center space-x-2">
                              <span className="font-semibold">
                                {reply.writeUserName}
                              </span>
                              <span className="text-gray-500 text-sm">
                                {new Date(comment.createdAt)
                                  .toLocaleDateString("ko-KR", {
                                    year: "numeric",
                                    month: "2-digit",
                                    day: "2-digit",
                                  })
                                  .replace(/-/g, ".")}{" "}
                                {/* 하이픈을 점으로 변경 */}
                              </span>
                            </div>

                            {user?.name === reply.writeUserName && (
                              <div className="flex space-x-6 text-sm text-gray-600">
                                <>
                                  <span
                                    className="cursor-pointer text-green-600"
                                    onClick={() =>
                                      onEditReply(reply.id, reply.content)
                                    }
                                  >
                                    수정
                                  </span>
                                  <span
                                    className="cursor-pointer text-red-500"
                                    onClick={() =>
                                      onDeleteReply(
                                        postId,
                                        comment.id,
                                        reply.id
                                      )
                                    }
                                  >
                                    삭제
                                  </span>
                                </>
                              </div>
                            )}
                          </div>

                          {editingReplies[reply.id] ? (
                            <div className="p-4 rounded-xl border focus-within:border-green-500 cursor-text">
                              <textarea
                                className="resize-none w-full px-2 py-3 rounded-md border-none bg-transparent focus:outline-none overflow-hidden"
                                placeholder="대댓글을 수정해주세요."
                                value={editedReplyText[reply.id]}
                                onChange={(e) =>
                                  setEditedReplyText((prev) => ({
                                    ...prev,
                                    [reply.id]: e.target.value,
                                  }))
                                }
                                rows={1}
                              ></textarea>

                              <div className="flex justify-end gap-2 mt-3">
                                <button
                                  className="px-4 py-2 rounded-2xl text-gray-600 bg-[#E9E8E2] transition hover:bg-gray-300"
                                  onClick={() => onCancelEditReply(reply.id)}
                                >
                                  취소
                                </button>
                                <button
                                  className="px-4 py-2 rounded-2xl bg-green-600 text-white transition hover:bg-green-700"
                                  onClick={() =>
                                    onSaveEditReply(
                                      postId,
                                      comment.id,
                                      reply.id
                                    )
                                  }
                                >
                                  저장
                                </button>
                              </div>
                            </div>
                          ) : (
                            <p className="text-gray-700">{reply.content}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Footer postId={postId} fetchComments={fetchComments} />
        </div>
      </section>
    </>
  );
}
