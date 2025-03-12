"use client";

import { useEffect, useState } from "react";

export function useFooter(postId: number, fetchComments: () => void) {
  const [bookmarkToggle, setBookmarkToggle] = useState(false);
  const [, setBookmarkCount] = useState(0);
  const [inputValue, setInputValue] = useState("");

  const token = localStorage.getItem("token-storage")
    ? JSON.parse(localStorage.getItem("token-storage")!).accessToken
    : null;

  useEffect(() => {
    const fetchBookmarkStatus = async () => {
      try {
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

        setBookmarkToggle(data.isBookmarked);
        setBookmarkCount(data.bookmarkCount);
      } catch (error) {
        console.error("❌ 북마크 상태 가져오기 실패:", error);
      }
    };

    fetchBookmarkStatus();
  }, [postId, token]);

  const toggleBookmark = async (postId: number) => {
    if (!postId) return;
    try {
      if (!token || !postId) return;

      const response = await fetch(`/api/community/${postId}/bookmark`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error(`북마크 토글 실패: ${response.status}`);
      setBookmarkToggle((prev) => !prev);
      setBookmarkCount((prev) => (bookmarkToggle ? prev - 1 : prev + 1));
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
        body: JSON.stringify({ content: comment }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ 서버 응답 에러:", errorText);
        throw new Error("서버에서 댓글 등록을 실패했습니다.");
      }

      console.log("✅ 댓글 등록 성공");

      alert("댓글이 등록되었습니다!");
      setInputValue("");
      fetchComments();
    } catch (error) {
      console.error("❌ 댓글 등록 실패:", error);
      alert("댓글 등록에 실패했습니다.");
    }
  };

  return {
    bookmarkToggle,
    toggleBookmark,
    inputValue,
    setInputValue,
    onClickSubmit,
  };
}
