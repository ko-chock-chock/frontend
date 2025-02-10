"use client";

import CommunityBoardItem from "./BoardItem";
import Image from "next/image";
import Button from "@/commons/Button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// ✅ 토큰 가져오기 함수
const getAccessToken = (): string | null => {
  const tokenStorageStr = localStorage.getItem("token-storage");
  if (!tokenStorageStr) return null;
  const tokenData = JSON.parse(tokenStorageStr);
  return tokenData?.accessToken || null;
};

// ✅ 커뮤니티 리스트 API 호출 함수
const fetchCommunityPosts = async () => {
  try {
    const token = getAccessToken();
    if (!token) throw new Error("토큰이 없습니다. 로그인이 필요합니다.");

    const response = await fetch("http://3.36.40.240:8001/api/community", {
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
    console.error("❌ 게시글 목록 불러오기 실패:", error);
    return [];
  }
};

export default function CommunityBoard() {
  const router = useRouter();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);
      const postData = await fetchCommunityPosts();
      setPosts(postData);
      setLoading(false);
    };

    loadPosts();
  }, []);

  const writeButton = () => {
    router.push("/communityBoard/new");
  };

  return (
    <>
      <div className="max-w-lg mx-auto bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="sticky top-0 bg-white shadow-sm p-4 border-b z-10">
          <h1 className="text-xl font-bold text-center">커뮤니티</h1>
        </div>

        {/* 로딩 중일 때 표시 */}
        {loading && (
          <div className="text-center py-10">⏳ 게시글 불러오는 중...</div>
        )}

        {/* 게시글이 없을 경우 표시 */}
        {!loading && posts.length === 0 && (
          <div className="text-center py-10">❌ 게시글이 없습니다.</div>
        )}

        {/* Post List */}
        <div className="divide-y">
          {/* Post Items */}
          {posts.map((post) => (
            <CommunityBoardItem key={post.id} post={post} />
          ))}
        </div>

        <div className="relative h-full">
          <Button
            design="design3"
            className="fixed bottom-10 right-5 flex items-center gap-2"
            onClick={writeButton}
          >
            <Image
              className="w-[1.5rem] h-[1.5rem]"
              src="/icons/icon-pencil-plus_icon_24px.svg"
              alt="Pencil Icon"
              width={0}
              height={0}
            />
            글쓰기
          </Button>
        </div>
      </div>
    </>
  );
}
