"use client";
import Image from "next/image";
import Button from "@/commons/Button";
import Input from "@/commons/input";
import { useCommunityBoardEdit } from "./hook";

export default function CommunityBoardEdit() {
  const {
    title,
    setTitle,
    contents,
    setContents,
    images,
    setImages,
    handleImageUpload,
    updatePost,
    loading,
  } = useCommunityBoardEdit();

  if (loading) {
    return <div className="text-center py-10">⏳ 게시글 불러오는 중...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <form className="p-4 space-y-6 flex-1">
        <div>
          <label className="block text-sm text-text-primary mb-1">제목</label>
          <Input
            type="text"
            placeholder="제목을 입력해주세요"
            className="w-full"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm text-text-primary mb-1">
            상세 내용
          </label>
          <textarea
            placeholder="내용을 입력해주세요"
            className="resize-none flex w-full h-[13rem] px-4 py-4 items-center gap-2 self-stretch rounded-xl border focus:border-[rgba(27,141,90,0.93)] focus:outline-none"
            value={contents}
            onChange={(e) => setContents(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            사진 첨부
          </label>
          <div className="flex gap-4 flex-wrap">
            {/* 이미지 업로드 버튼 */}
            <label
              htmlFor="file-upload"
              className="w-[100px] h-[100px] border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
            >
              <Image
                src="/icons/camera.png"
                alt="Upload Image"
                width={40}
                height={40}
              />
            </label>

            <input
              id="file-upload"
              type="file"
              accept="image/*"
              multiple
              className="opacity-0 absolute w-0 h-0"
              onChange={handleImageUpload}
            />

            {/* 업로드된 이미지 리스트 */}
            {images.map((img, index) => (
              <div
                key={index}
                className="relative w-[100px] h-[100px] rounded-lg overflow-hidden"
              >
                <Image
                  src={img}
                  alt={`이미지 ${index}`}
                  layout="fill"
                  objectFit="cover"
                />
                {/* 삭제 버튼 */}
                <button
                  type="button"
                  className="absolute top-1 right-1 w-6 h-6 bg-red-500 rounded-full text-white transition-opacity flex items-center justify-center"
                  onClick={() =>
                    setImages((prevImages) =>
                      prevImages.filter((_, i) => i !== index)
                    )
                  }
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full">
          <Button
            type="button"
            design="design1"
            width="full"
            className="h-[3.5rem]"
            onClick={updatePost}
          >
            수정하기
          </Button>
        </div>
      </form>
    </div>
  );
}
