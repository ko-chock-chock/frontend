"use client";

import CommunityBoardItem from "./BoardItem";
import Image from "next/image";
import Button from "@/commons/Button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

// ✅ 토큰 가져오기 함수
const getAccessToken = (): string | null => {
  const tokenStorageStr = localStorage.getItem("token-storage");
  if (!tokenStorageStr) return null;
  const tokenData = JSON.parse(tokenStorageStr);
  return tokenData?.accessToken || null;
};

// ✅ 커뮤니티 리스트 API 호출 함수 (페이지별로 요청)
const fetchCommunityPosts = async (pageNum: number, limit = 10) => {
  try {
    const token = getAccessToken();
    if (!token) throw new Error("토큰이 없습니다. 로그인이 필요합니다.");
    console.log(`🔄 페이지 ${pageNum} 로드 중...`);

    const response = await fetch(
      `http://3.36.40.240:8001/api/community?page=${pageNum}&limit=${limit}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`서버 오류: ${response.status}`);
    }

    const data = await response.json();
    console.log(`✅ 페이지 ${pageNum} 로드 완료:`, data);
    return data;
  } catch (error) {
    console.error("❌ 게시글 목록 불러오기 실패:", error);
    return [];
  }
};

export default function CommunityBoard() {
  const router = useRouter();
  const [posts, setPosts] = useState<any[]>([]); // 게시글 상태
  const [loading, setLoading] = useState(true); // 첫 로딩 상태
  const [page, setPage] = useState(1); // 현재 페이지 번호 (1부터 시작)
  const [hasMore, setHasMore] = useState(true); // 추가 데이터 여부 확인

  // ✅ 첫 로딩 시 10개만 가져오기
  useEffect(() => {
    console.log("📌 초기 데이터 로드 시작");

    const loadInitialPosts = async () => {
      setLoading(true);
      const initialPosts = await fetchCommunityPosts(1, 10); // 첫 페이지의 10개만 가져옴
      setPosts(initialPosts);
      setLoading(false);

      setPage(2); // ✅ 다음 페이지는 2부터 시작

      if (initialPosts.length < 10) {
        setHasMore(false); // ✅ 첫 로딩 데이터가 10개 미만이면 추가 데이터 없음
      }
    };

    loadInitialPosts();
  }, []);

  // ✅ 추가 데이터 로드 (스크롤이 내려갈 때 실행됨)
  const loadMorePosts = async () => {
    console.log(`📥 다음 페이지 ${page} 로드 중...`);

    const newPosts = await fetchCommunityPosts(page, 10); // 10개씩 불러오기

    if (newPosts.length === 0) {
      setHasMore(false); // ✅ 새로운 데이터가 없으면 더 이상 불러올 필요 없음
      return;
    }

    setPosts((prev) => [...prev, ...newPosts]); // 기존 데이터 + 새 데이터 추가
    setPage(page + 1); // ✅ 다음 페이지 값 증가

    if (newPosts.length < 10) {
      setHasMore(false); // ✅ 마지막 페이지일 경우 hasMore을 false로 설정하여 더 이상 불러오지 않음
    }
  };

  // ✅ 글쓰기 버튼 클릭 시 글쓰기 페이지로 이동
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
        {!loading && posts.length > 0 && (
          <div className="divide-y">
            <InfiniteScroll
              dataLength={posts.length} // 현재까지 로드된 아이템 개수
              next={loadMorePosts} // 다음 데이터를 불러오는 함수
              hasMore={hasMore} // 더 불러올 데이터가 있는지 여부
              loader={<h4 className="text-center py-4">🔄 로딩 중...</h4>} // 로딩 UI
              endMessage={
                <p className="text-center py-4">
                  ✅ 모든 게시글을 불러왔습니다!
                </p>
              } // 마지막 데이터일 경우 메시지 표시
            >
              {posts.map((post) => (
                <CommunityBoardItem key={post.id} post={post} />
              ))}
            </InfiniteScroll>
          </div>
        )}

        {/* 글쓰기 버튼 */}
        <div className="relative h-full">
          <Button
            design="design3"
            className="fixed bottom-20 right-5 flex items-center gap-2"
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
