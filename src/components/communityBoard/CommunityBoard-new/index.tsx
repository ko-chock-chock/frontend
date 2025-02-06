"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import Image from "next/image";
import Button from "@/commons/Button";
import Input from "@/commons/input";
import { useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { communityFormSchema } from "./schema";

const CommunityBoardNew = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<{
    title: string;
    contents: string;
    images: File[]; // ✅ images의 타입을 File[]로 명확하게 설정
  }>({
    resolver: zodResolver(communityFormSchema),
    defaultValues: {
      title: "",
      contents: "",
      images: [], // ✅ 빈 배열을 File[] 타입으로 초기화
    },
  });

  const images = watch("images") || []; // 기존 이미지가 없을 경우 안전 처리

  // ✅ 이미지 미리보기를 위한 상태 추가
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles: File[] = Array.from(e.target.files);

      // 새로운 파일을 추가할 때 기존 파일 유지
      setValue("images", [...(images || []), ...newFiles]);

      // 새 이미지 미리보기를 기존 미리보기와 합쳐서 저장
      const previewURLs = newFiles.map((file) => URL.createObjectURL(file));
      setPreviewImages([...previewImages, ...previewURLs]);
    }
  };
  // 이미지 미리보기에서 지울때
  const removeImage = (index: number) => {
    setPreviewImages((prev) => prev.filter((_, i) => i !== index)); // 미리보기 삭제
    setValue(
      "images",
      images.filter((_, i) => i !== index)
    ); // RHF의 상태에서도 삭제
  };

  const appnedImg = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const uploadImages = async (files: File[]) => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("로그인이 필요합니다.");
      return [];
    }

    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append("files", file));

    try {
      const response = await fetch("/api/uploads/multiple", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // 인증 헤더 추가
        },
        body: formData,
      });

      if (!response.ok) throw new Error("파일 업로드 실패");

      const data = await response.json();
      return data.urls; // 업로드된 이미지 URL 배열 반환
    } catch (error) {
      console.error("❌ 이미지 업로드 실패:", error);
      alert("이미지 업로드에 실패했습니다.");
      return [];
    }
  };

  const onSubmit = async (data: {
    images: File[];
    title: string;
    contents: string;
  }) => {
    try {
      const token = localStorage.getItem("accessToken"); // 인증 토큰 가져오기
      if (!token) throw new Error("토큰이 없습니다. 로그인이 필요합니다.");

      // 1️⃣ 사용자가 업로드한 파일을 먼저 서버에 전송하고 URL을 받아옴
      let imageUrls: string[] = [];
      if (data.images.length > 0) {
        const files: File[] = Array.from(data.images); // ✅ FileList → File[] 변환
        imageUrls = await uploadImages(files);
      }

      // 2️⃣ 게시글 등록 API 호출
      const payload = {
        title: data.title,
        contents: data.contents,
        images: imageUrls, // 업로드된 이미지 URL 배열을 포함
      };

      const response = await fetch("/api/community", {
        // 수정해야함.
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("게시글 등록 실패");

      console.log("✅ 성공적으로 등록됨:", await response.json());
      alert("게시글이 등록되었습니다!");
      router.push("/communityBoard");
    } catch (error) {
      console.error("❌ 게시글 등록 실패:", error);
      alert("게시글 등록에 실패했습니다.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-6 flex-1">
        {/* 제목 입력 */}
        <div>
          <label className="block text-sm text-text-primary mb-1">제목</label>
          <Input
            type="text"
            placeholder="제목을 입력해주세요"
            className="w-full"
            {...register("title")}
          />
          {errors.title && (
            <p className="text-red-500 text-sm">{errors.title.message}</p>
          )}
        </div>

        {/* 상세 내용 입력 */}
        <div>
          <label className="block text-sm text-text-primary mb-1">
            상세 내용
          </label>
          <textarea
            placeholder="내용을 입력해주세요"
            className="resize-none flex w-full h-[13rem] px-4 py-4 items-center gap-2 self-stretch rounded-xl border focus:border-[rgba(27,141,90,0.93)] focus:outline-none"
            {...register("contents")}
          />
          {errors.contents && (
            <p className="text-red-500 text-sm">{errors.contents.message}</p>
          )}
        </div>

        {/* 파일 업로드 input (숨김) */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />

        {/* 이미지 업로드 UI */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            사진 첨부
          </label>

          <div className="flex gap-4 flex-wrap">
            {/* 사진 파일 열기 */}
            <div
              className="w-[100px] h-[100px] border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
              onClick={appnedImg}
            >
              <Image
                src="/icons/camera.png"
                alt="Upload Image"
                width={40}
                height={40}
              />
            </div>

            {/* ✅ 이미지 미리보기 추가 */}
            {previewImages.map((imgSrc, index) => (
              <div key={index} className="w-[100px] h-[100px] relative group">
                <Image
                  src={imgSrc}
                  alt={`preview-${index}`}
                  fill
                  className="object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 w-6 h-6 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 등록 버튼 */}
        <div className="w-full">
          <Button
            type="submit"
            design="design1"
            width="full"
            className="h-[3.5rem]"
          >
            등록하기
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CommunityBoardNew;
