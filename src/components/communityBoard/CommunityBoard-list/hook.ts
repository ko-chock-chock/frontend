"use client";

import { useRouter } from "next/navigation";
import { CommunityPost } from "./type";
import { useEffect, useState } from "react";

const getAccessToken = (): string | null => {
  const tokenStorageStr = localStorage.getItem("token-storage");
  if (!tokenStorageStr) return null;
  const tokenData = JSON.parse(tokenStorageStr);
  return tokenData?.accessToken || null;
};

const fetchCommunityPosts = async (): Promise<CommunityPost[]> => {
  try {
    const token = getAccessToken();
    if (!token) throw new Error("토큰이 없습니다. 로그인이 필요합니다.");

    const response = await fetch(`/api/community`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`서버 오류: ${response.status}`);
    }

    const data: CommunityPost[] = await response.json();
    console.log("🔎 서버 응답 데이터:", data);
    return data;
  } catch (error) {
    console.error("❌ 게시글 목록 불러오기 실패:", error);
    return [];
  }
};

export default function useCommunityBoard() {
  const router = useRouter();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        console.log("📌 초기 데이터 로드 시작");
        const initialPosts = await fetchCommunityPosts();
        setPosts(initialPosts);
      } catch (error) {
        console.error("❌ 게시글 불러오기 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  const writeButton = () => {
    router.push("/communityBoard/new");
  };
  return {
    posts,
    loading,
    writeButton,
  };
}
