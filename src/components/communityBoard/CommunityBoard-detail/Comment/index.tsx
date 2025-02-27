"use client";

import Input from "@/commons/input";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface Reply {
  id: number;
  writeUserProfileImage: string;
  writeUserName: string;
  content: string;
  createdAt: string;
}

interface Comment {
  id: number;
  writeUserProfileImage: string;
  writeUserName: string;
  content: string;
  createdAt: string;
  replies?: Reply[]; // ✅ replies 속성 추가 (대댓글)
}

export default function Comment() {
  const params = useParams<{ boardId: string }>();
  const postId = Number(params?.boardId); // postId를 숫자로 변환
  const [bookmarkToggle, setBookmarkToggle] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [bookmarkCount, setBookmarkCount] = useState(0); // ✅ 북마크 개수 상태 추가
  const [inputValue, setInputValue] = useState(""); // 입력 필드 상태
  const [comments, setComments] = useState<Comment[]>([]); // ✅ useState로 상태 관리
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [text, setText] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isReplying, setIsReplying] = useState(false); // 대댓글 입력창 표시 여부
  const replyContainerRef = useRef<HTMLDivElement>(null); // ✅ 스크롤을 위한 div 참조

  const [replyingComments, setReplyingComments] = useState<
    Record<number, boolean>
  >({});

  // ✅ 1️⃣ 초기 북마크 상태 불러오기
  useEffect(() => {
    const fetchBookmarkStatus = async () => {
      try {
        const token = localStorage.getItem("token-storage")
          ? JSON.parse(localStorage.getItem("token-storage")!).accessToken
          : null;

        if (!token || !postId) return;

        const response = await fetch(`/api/community/${postId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("북마크 상태 가져오기 실패");

        const data = await response.json();
        console.log("✅ 북마크 상태 불러오기 성공:", data);

        setBookmarkToggle(data.isBookmarked); // ✅ 초기 북마크 상태 설정
        setBookmarkCount(data.bookmarkCount); // ✅ 북마크 개수 설정
      } catch (error) {
        console.error("❌ 북마크 상태 가져오기 실패:", error);
      }
    };

    fetchBookmarkStatus();
  }, [bookmarkToggle]); // ✅ postId가 변경될 때만 실행

  const toggleBookmark = async (postId: number) => {
    if (!postId) return; // ✅ postId가 없으면 실행하지 않음
    try {
      const token = localStorage.getItem("token-storage")
        ? JSON.parse(localStorage.getItem("token-storage")!).accessToken
        : null;

      if (!token || !postId) return;

      const response = await fetch(`/api/community/${postId}/bookmark`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error(`북마크 토글 실패: ${response.status}`);

      console.log("✅ 북마크 토글 성공");
      setBookmarkToggle((prev) => !prev);
      setBookmarkCount((prev) => (bookmarkToggle ? prev - 1 : prev + 1)); // ✅ 즉시 카운트 업데이트
    } catch (error) {
      console.error("❌ 북마크 토글 실패:", error);
      alert("북마크 변경에 실패했습니다.");
    }
  };

  const onClickSubmit = async (postId: number, comment: string) => {
    if (!postId || !comment.trim()) {
      alert("댓글을 입력해주세요.");
      return;
    }

    try {
      const token = localStorage.getItem("token-storage")
        ? JSON.parse(localStorage.getItem("token-storage")!).accessToken
        : null;

      if (!token) {
        alert("로그인이 필요합니다.");
        return;
      }

      console.log("📝 요청 데이터:", { postId, content: comment });

      const response = await fetch(`/api/community/${postId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: comment }), // ✅ 댓글 데이터를 JSON으로 변환
      });

      if (!response.ok) {
        const errorText = await response.text(); // 서버 응답이 JSON이 아닐 수도 있음
        console.error("❌ 서버 응답 에러:", errorText);
        throw new Error("서버에서 댓글 등록을 실패했습니다.");
      }

      // ✅ 서버 응답이 JSON인지 확인하고 파싱 방식 결정
      const contentType = response.headers.get("content-type");
      let result;
      if (contentType && contentType.includes("application/json")) {
        result = await response.json(); // ✅ JSON이면 파싱
      } else {
        result = await response.text(); // ✅ text/plain이면 그냥 텍스트 처리
      }

      console.log("✅ 댓글 등록 성공:", result);

      alert("댓글이 등록되었습니다!");
      setInputValue(""); // ✅ 댓글 입력창 초기화
      fetchComments();
    } catch (error) {
      const err = error as Error;
      console.error("❌ 댓글 등록 실패:", err.message);
      alert(`❌ 댓글 등록 실패: ${err.message}`);
    }
  };

  const fetchComments = async () => {
    try {
      const token = localStorage.getItem("token-storage")
        ? JSON.parse(localStorage.getItem("token-storage")!).accessToken
        : null;

      if (!token) {
        console.error("❌ 인증 토큰이 없습니다.");
        return;
      }

      const response = await fetch(`/api/community/${postId}/comments`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("❌ 댓글 데이터를 불러오는데 실패했습니다.");
      }

      const data = await response.json();
      console.log("✅ 가져온 댓글 데이터:", data);
      setComments(data); // 가져온 댓글 데이터를 상태에 저장
    } catch (error) {
      console.error("🚨 댓글 데이터 가져오기 실패:", error);
    }
  };

  const onClickSubmitReply = async (
    postId: number,
    commentId: number,
    replyText: string
  ) => {
    if (!replyText.trim()) {
      alert("답글을 입력해주세요!");
      return;
    }

    try {
      const token = localStorage.getItem("token-storage")
        ? JSON.parse(localStorage.getItem("token-storage")!).accessToken
        : null;

      if (!token) {
        alert("로그인이 필요합니다.");
        return;
      }

      const response = await fetch(
        `/api/community/${postId}/comments/${commentId}/replies`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ content: replyText }),
        }
      );

      const contentType = response.headers.get("content-type");

      let result;
      if (contentType && contentType.includes("application/json")) {
        result = await response.json(); // ✅ JSON 응답이면 파싱
      } else {
        result = await response.text(); // ✅ 일반 문자열이면 그대로 사용
      }

      console.log("✅ 대댓글 등록 성공:", result);

      alert("대댓글이 등록되었습니다!");
      setReplyingComments((prev) => ({
        ...prev,
        [commentId]: false, // ✅ 대댓글 입력창 닫기
      }));
      setText(""); // ✅ 입력창 초기화
    } catch (error) {
      console.error("❌ 대댓글 등록 실패:", error);
      alert("대댓글 등록에 실패했습니다.");
    }
  };

  useEffect(() => {
    if (postId) {
      fetchComments();
    }
  }, [postId]);

  // 자동 높이 조절 함수
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    e.target.style.height = "auto"; // 높이 초기화
    e.target.style.height = e.target.scrollHeight + "px"; // 입력 내용에 맞춰 조절
  };

  // 특정 댓글의 답글창 열기
  const handleReplyClick = (commentId: number) => {
    setReplyingComments((prev) => ({
      ...prev,
      [commentId]: true, // 해당 댓글만 true로 변경
    }));
  };

  // 특정 댓글의 답글창 닫기
  const handleCancel = (commentId: number) => {
    setReplyingComments((prev) => ({
      ...prev,
      [commentId]: false, // 해당 댓글만 false로 변경
    }));
    setText("");
  };

  // ✅ isReplying이 true가 될 때 textarea에 자동 포커스 & 스크롤 이동
  useEffect(() => {
    if (isReplying) {
      setTimeout(() => {
        // ✅ textarea에 포커스
        textareaRef.current?.focus();

        // ✅ 스크롤 이동 (부드럽게)
        if (replyContainerRef.current) {
          replyContainerRef.current.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        } else {
          console.warn("⚠ replyContainerRef가 없음!"); // ref가 정상적으로 참조되는지 확인
        }
      }, 100); // 약간의 딜레이 추가
    }
  }, [isReplying]);

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
                <div key={comment.id} className="space-y-4">
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
                      <p className="text-gray-700">{comment.content}</p>

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
                  <div className="ml-16 space-y-3">
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

              {/* ------------퍼블리싱------------- */}

              {/* 대댓글 (답글) */}
              <div className="ml-16 space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-12 h-12 rounded-3xl bg-center bg-cover bg-no-repeat bg-[#d3d3d3] flex-shrink-0"></div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold">홍길동2</span>
                      <span className="text-gray-500 text-sm">1주 전</span>
                    </div>
                    <p className="text-gray-700">
                      강남역 3번 출구에서 도보 5분 거리예요! 구체적인 위치는
                      DM으로 보내드릴게요
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* 만든거 */}
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
