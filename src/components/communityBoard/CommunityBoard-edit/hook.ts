"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";

// ✅ 게시글 불러오는 API 함수
const getPostById = async (postId: number) => {
  try {
    const token = localStorage.getItem("token-storage")
      ? JSON.parse(localStorage.getItem("token-storage")!).accessToken
      : null;

    if (!token) throw new Error("토큰이 없습니다. 로그인이 필요합니다.");

    const response = await fetch(`/api/community/${postId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error(`게시글 조회 실패: ${response.status}`);

    return await response.json();
  } catch (error) {
    console.error("❌ 게시글 조회 실패:", error);
    return null;
  }
};

const dataURLtoBlob = (dataURL: string) => {
  const mime = dataURL.match(/^data:(.*?);base64,/)?.[1];
  if (!mime) throw new Error("Invalid DataURL");

  const byteString = atob(dataURL.split(",")[1]);
  const byteArray = new Uint8Array(byteString.length);
  for (let i = 0; i < byteString.length; i++) {
    byteArray[i] = byteString.charCodeAt(i);
  }

  return new Blob([byteArray], { type: mime });
};

// ✅ 이미지 업로드 API 함수
const uploadImages = async (files: File[]) => {
  try {
    console.log("📤 이미지 업로드 시작...");

    const token = localStorage.getItem("token-storage")
      ? JSON.parse(localStorage.getItem("token-storage")!).accessToken
      : null;

    if (!token) throw new Error("토큰이 없습니다. 로그인이 필요합니다.");

    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    const response = await fetch(
      "http://3.36.40.240:8001/api/uploads/multiple",
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      }
    );

    if (!response.ok) throw new Error("파일 업로드 실패");

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("❌ 이미지 업로드 실패:", error);
    alert("이미지 업로드에 실패했습니다.");
    return [];
  }
};

export function useCommunityBoardEdit() {
  const params = useParams();
  const boardId = Number(params?.boardId) || null;
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [contents, setContents] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPost = async () => {
      if (!boardId) return;
      setLoading(true);

      const fetchedPost = await getPostById(boardId);
      if (fetchedPost) {
        setTitle(fetchedPost.title);
        setContents(fetchedPost.contents);
        if (fetchedPost.images?.length > 0) {
          setImages(fetchedPost.images);
        }
      }
      setLoading(false);
    };

    loadPost();
  }, [boardId]);

  // ✅ 이미지 업로드 핸들러
  const handleImageUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        const files = Array.from(e.target.files);
        files.forEach((file) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            if (typeof reader.result === "string") {
              setImages((prevImages) => [
                ...prevImages,
                reader.result as string,
              ]);
            }
          };
          reader.readAsDataURL(file);
        });
      }
    },
    []
  );

  // ✅ 게시글 수정 API 함수
  const updatePost = useCallback(async () => {
    try {
      const token = localStorage.getItem("token-storage")
        ? JSON.parse(localStorage.getItem("token-storage")!).accessToken
        : null;

      if (!token) throw new Error("토큰이 없습니다. 로그인이 필요합니다.");
      if (!boardId) throw new Error("게시글 ID를 찾을 수 없습니다.");

      // ✅ Base64 이미지를 필터링하여 업로드
      const newBase64Images = images.filter((img) =>
        img.startsWith("data:image")
      );
      let uploadedImageUrls: string[] = [];

      if (newBase64Images.length > 0) {
        const imageFiles = newBase64Images.map((base64, index) => {
          const blob = dataURLtoBlob(base64);
          return new File([blob], `uploaded-image-${index}.png`, {
            type: blob.type,
          });
        });

        uploadedImageUrls = await uploadImages(imageFiles);
      }

      // ✅ 기존 이미지 + 업로드된 이미지 URL 합치기
      const existingImageUrls = images.filter(
        (img) => !img.startsWith("data:image")
      );
      const finalImageUrls = [...existingImageUrls, ...uploadedImageUrls];

      // ✅ API 요청
      const response = await fetch(
        `http://3.36.40.240:8001/api/community/${boardId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ title, contents, images: finalImageUrls }),
        }
      );

      if (!response.ok) throw new Error(`게시글 수정 실패: ${response.status}`);

      alert("게시글이 수정되었습니다!");
      router.push(`/communityBoard/${boardId}`);
    } catch (error) {
      console.error("❌ 게시글 수정 실패:", error);
      alert("게시글 수정에 실패했습니다.");
    }
  }, [boardId, images, title, contents, router]);

  return {
    title,
    setTitle,
    contents,
    setContents,
    images,
    setImages,
    handleImageUpload,
    updatePost,
    loading,
  };
}
