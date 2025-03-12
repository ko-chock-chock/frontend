"use client";

import Image from "next/image";
import Button from "@/commons/Button";
import Input from "@/commons/input";
import useCommunityBoardNew from "./hook";

export default function CommunityBoardNew() {
  const {
    fileInputRef,
    register,
    handleSubmit,
    errors,
    inputValue,
    setInputValue,
    handleFileChange,
    removeImage,
    appnedImg,
    previewImages,
    onSubmit,
  } = useCommunityBoardNew();

  return (
    <div className="min-h-screen flex flex-col">
      <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-6 flex-1">
        <div>
          <label className="block text-sm text-text-primary mb-1">제목</label>
          <Input
            type="text"
            placeholder="제목을 입력해주세요"
            className="w-full"
            value={inputValue}
            {...register("title", {
              onChange: (e) => setInputValue(e.target.value),
            })}
          />

          {errors.title && (
            <p className="text-red-500 text-sm">{errors.title.message}</p>
          )}
        </div>

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

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />

        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            사진 첨부
          </label>

          <div className="flex gap-4 flex-wrap">
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
                  className="absolute top-1 right-1 w-6 h-6 bg-red-500 rounded-full text-white transition-opacity flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

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
}
