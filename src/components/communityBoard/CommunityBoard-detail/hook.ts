"use client";

import { useEffect, useState } from "react";
import { CommunityPostDetail } from "./type";

const getAccessToken = (): string | null => {
  const tokenStorageStr = localStorage.getItem("token-storage");
  if (!tokenStorageStr) return null;
  const tokenData = JSON.parse(tokenStorageStr);
  return tokenData?.accessToken || null;
};

const fetchCommunityDetail = async (postId: string) => {
  try {
    const token = getAccessToken();
    if (!token) throw new Error("토큰이 없습니다. 로그인이 필요합니다.");

    if (!token) throw new Error("로그인이 필요합니다.");

    const response = await fetch(`/api/community/${postId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`서버 오류: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("❌ 게시글 불러오기 실패:", error);
    return null;
  }
};

export function useCommunityBoardDetail(postId: string) {
  const [post, setPost] = useState<CommunityPostDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!postId) return;

    const loadPost = async () => {
      try {
        setLoading(true);
        setError(null);

        const postData = await fetchCommunityDetail(postId);
        if (!postData) throw new Error("게시글 데이터를 가져오지 못했습니다.");

        setPost(postData);
      } catch (error) {
        console.error("❌ API 요청 실패:", error);
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [postId]);

  return { post, loading, error };
}
