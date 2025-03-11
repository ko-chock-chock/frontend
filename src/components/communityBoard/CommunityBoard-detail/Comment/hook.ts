"use client";

import { useEffect, useRef, useState } from "react";
import { useUserStore } from "@/commons/store/userStore";
import { useParams } from "next/navigation";
import { CommentType, Reply } from "./type";

export function useComment() {
  const params = useParams<{ boardId: string }>();
  const postId = Number(params?.boardId); // postId를 숫자로 변환
  const [comments, setComments] = useState<CommentType[]>([]); // ✅ useState로 상태 관리
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [text, setText] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isReplying, setIsReplying] = useState(false); // 대댓글 입력창 표시 여부
  const replyContainerRef = useRef<HTMLDivElement>(null); // ✅ 스크롤을 위한 div 참조
  const [replyingComments, setReplyingComments] = useState<
    Record<number, boolean>
  >({});

  const [editingComments, setEditingComments] = useState<
    Record<number, boolean>
  >({});
  const [editedText, setEditedText] = useState<Record<number, string>>({});

  // ✅ 대댓글 수정 상태 추가
  const [editingReplies, setEditingReplies] = useState<Record<number, boolean>>(
    {}
  );
  const [editedReplyText, setEditedReplyText] = useState<
    Record<number, string>
  >({});

  // ✅ 대댓글 수정 버튼 클릭 시 실행
  const onEditReply = (replyId: number, content: string) => {
    setEditingReplies((prev) => ({ ...prev, [replyId]: true }));
    setEditedReplyText((prev) => ({ ...prev, [replyId]: content }));
  };

  // ✅ 대댓글 수정 취소 버튼 클릭 시 실행
  const onCancelEditReply = (replyId: number) => {
    setEditingReplies((prev) => ({ ...prev, [replyId]: false }));
    setEditedReplyText((prev) => ({ ...prev, [replyId]: "" }));
  };

  const user = useUserStore((state) => state.user);
  console.log(user);

  const token = localStorage.getItem("token-storage")
    ? JSON.parse(localStorage.getItem("token-storage")!).accessToken
    : null;

  const fetchComments = async () => {
    try {
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
      if (!token) {
        alert("로그인이 필요합니다.");
        return;
      }

      // 1️⃣ 새 대댓글을 UI에 먼저 반영하기 위해 가짜 데이터 생성
      const newReply: Reply = {
        id: Date.now(), // 일단 임시 ID 사용
        writeUserProfileImage: user?.profileImage ?? "", // 사용자 프로필 (백엔드 응답 후 교체)
        writeUserName: user?.name ?? "익명", // 현재 로그인한 사용자 이름
        content: replyText,
        createdAt: new Date().toISOString(),
      };

      // ✅ 기존 대댓글 리스트에 추가하여 UI 즉시 반영
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.id === commentId
            ? { ...comment, replies: [...(comment.replies || []), newReply] }
            : comment
        )
      );

      // 2️⃣ API 요청 보내기 (서버 저장)
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

      // ✅ 서버 응답의 Content-Type 확인
      const contentType = response.headers.get("content-type");

      let result;
      if (contentType?.includes("application/json")) {
        result = await response.json(); // ✅ JSON 응답이면 파싱
      } else {
        result = await response.text(); // ✅ JSON이 아니면 일반 텍스트로 변환
      }

      console.log("✅ 대댓글 등록 성공:", result);

      alert("대댓글이 등록되었습니다!");

      // ✅ 입력창 닫기 및 초기화
      setReplyingComments((prev) => ({
        ...prev,
        [commentId]: false,
      }));
      setText("");
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

  // ✅ 댓글수정 버튼 클릭 시 실행
  const onEditComment = (commentId: number, content: string) => {
    setEditingComments((prev) => ({ ...prev, [commentId]: true }));
    setEditedText((prev) => ({ ...prev, [commentId]: content }));
  };

  // ✅ 댓글취소 버튼 클릭 시 실행
  const onCancelEdit = (commentId: number) => {
    setEditingComments((prev) => ({ ...prev, [commentId]: false }));
    setEditedText((prev) => ({ ...prev, [commentId]: "" }));
  };

  // ✅ 커뮤니티 게시글 댓글 수정
  const onSaveEdit = async (postId: number, commentId: number) => {
    if (!editedText[commentId].trim()) {
      alert("수정할 내용을 입력해주세요.");
      return;
    }

    try {
      if (!token) {
        alert("로그인이 필요합니다.");
        return;
      }

      const response = await fetch(
        `/api/community/${postId}/comments/${commentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ content: editedText[commentId] }), // ✅ JSON 변환
        }
      );

      if (!response.ok) {
        const errorText = await response.text(); // 에러 메시지 로깅
        console.error("❌ 댓글 수정 실패:", errorText);
        throw new Error("서버에서 댓글 수정을 실패했습니다.");
      }

      alert("✅ 댓글이 수정되었습니다!");

      // ✅ UI 업데이트: 수정된 댓글을 다시 가져옴
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.id === commentId
            ? { ...comment, content: editedText[commentId] }
            : comment
        )
      );

      setEditingComments((prev) => ({ ...prev, [commentId]: false }));
    } catch (error) {
      console.error("❌ 댓글 수정 요청 실패:", error);
      alert("댓글 수정에 실패했습니다.");
    }
  };

  // ✅ 커뮤니티 게시글 댓글 삭제
  const onDeleteComment = async (postId: number, commentId: number) => {
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    // ✅ 삭제 확인 (선택 사항)
    const confirmDelete = confirm("정말로 삭제하시겠습니까?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `/api/community/${postId}/comments/${commentId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text(); // 에러 메시지 로깅
        console.error("❌ 댓글 삭제 실패:", errorText);
        throw new Error("서버에서 댓글 삭제를 실패했습니다.");
      }

      alert("✅ 댓글이 삭제되었습니다!");

      // ✅ 삭제된 댓글을 UI에서 제거 (comments 상태 업데이트)
      setComments((prevComments) =>
        prevComments.filter((comment) => comment.id !== commentId)
      );
    } catch (error) {
      console.error("❌ 댓글 삭제 요청 실패:", error);
      alert("댓글 삭제에 실패했습니다.");
    }
  };

  // ✅ 대댓글 수정 저장 (API 연결)
  const onSaveEditReply = async (
    postId: number,
    commentId: number,
    replyId: number
  ) => {
    if (!editedReplyText[replyId].trim()) {
      alert("수정할 내용을 입력해주세요.");
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
        `/api/community/${postId}/comments/${commentId}/replies/${replyId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ content: editedReplyText[replyId] }),
        }
      );

      if (!response.ok) {
        throw new Error("대댓글 수정 실패");
      }

      alert("✅ 대댓글이 수정되었습니다!");

      // ✅ UI 업데이트: 수정된 대댓글 반영
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.id === commentId
            ? {
                ...comment,
                replies: comment.replies?.map((reply) =>
                  reply.id === replyId
                    ? { ...reply, content: editedReplyText[replyId] }
                    : reply
                ),
              }
            : comment
        )
      );

      setEditingReplies((prev) => ({ ...prev, [replyId]: false }));
    } catch (error) {
      console.error("❌ 대댓글 수정 실패:", error);
      alert("대댓글 수정에 실패했습니다.");
    }
  };

  // ✅ 대댓글 삭제 (API 연결)
  const onDeleteReply = async (
    postId: number,
    commentId: number,
    replyId: number
  ) => {
    try {
      const token = localStorage.getItem("token-storage")
        ? JSON.parse(localStorage.getItem("token-storage")!).accessToken
        : null;

      if (!token) {
        alert("로그인이 필요합니다.");
        return;
      }

      const confirmDelete = confirm("정말로 삭제하시겠습니까?");
      if (!confirmDelete) return;

      const response = await fetch(
        `/api/community/${postId}/comments/${commentId}/replies/${replyId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("대댓글 삭제 실패");
      }

      alert("✅ 대댓글이 삭제되었습니다!");

      // ✅ UI 업데이트: 삭제된 대댓글 제거
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.id === commentId
            ? {
                ...comment,
                replies: comment.replies?.filter(
                  (reply) => reply.id !== replyId
                ),
              }
            : comment
        )
      );
    } catch (error) {
      console.error("❌ 대댓글 삭제 실패:", error);
      alert("대댓글 삭제에 실패했습니다.");
    }
  };

  return {
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
  };
}
