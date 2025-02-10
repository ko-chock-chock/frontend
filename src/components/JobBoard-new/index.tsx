"use client";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import Button from "@/commons/Button";
import Input from "@/commons/input";
import RegionDropdown from "@/commons/regionsDropdown";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRef } from "react";

interface onSubmitProps {
  title: string;
  mainRegion: string;
  subRegion: string;
  price: string;
  contents: string;
  newImages?: File[];
}

// 폼 스키마
export const jobFormSchema = z.object({
  title: z.string().min(1, "제목을 입력해주세요"),
  mainRegion: z.string().min(1, "지역을 선택해주세요"),
  subRegion: z.string().min(1, "세부 지역을 선택해주세요"),
  price: z
    .string()
    .min(1, "금액을 입력해주세요")
    .regex(/^[0-9,]+$/, "올바른 금액 형식을 입력해주세요"),
  contents: z.string().min(1, "상세 내용을 입력해주세요"),
  newImages: z.array(z.instanceof(File)).optional(),
});

const JobBoardNew = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(jobFormSchema),
    defaultValues: {
      title: "",
      mainRegion: "",
      subRegion: "",
      price: "",
      contents: "",
      newImages: [] as File[],
    },
  });

  // 엑세스 토큰 가져옴
  const getAccessToken = (): string | null => {
    const tokenStorageStr = localStorage.getItem("token-storage");
    if (!tokenStorageStr) return null;
    const tokenData = JSON.parse(tokenStorageStr);
    return tokenData?.accessToken || null;
  };

  const onSubmit = async (data: onSubmitProps) => {
    try {
      const token = getAccessToken();
      if (!token) throw new Error("로그인이 필요합니다.");

      let imageLinks: string[] = [];

      // 1️. 이미지 업로드 (성공하면 이미지 URL 배열을 받음)
      if (data.newImages?.length) {
        const formData = new FormData();
        data.newImages.forEach((file) => formData.append("files", file));

        const uploadResponse = await fetch(
          "http://3.36.40.240:8001/api/uploads/multiple",
          {
            method: "POST",
            body: formData,
          }
        );

        if (!uploadResponse.ok) throw new Error("이미지 업로드 실패");

        const uploadResult = await uploadResponse.json();
        imageLinks = uploadResult;
      }

      // 2️. 게시글 데이터 구성 (이미지 URL 포함)
      const payload = {
        title: data.title,
        region: `${data.mainRegion} ${data.subRegion}`,
        price: data.price,
        contents: data.contents,
        images: imageLinks,
      };

      // 3️. 최종 게시글 등록 요청 (이미지 포함)
      const response = await fetch("http://3.36.40.240:8001/api/trade", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "등록 실패");
      }

      alert("게시물이 성공적으로 등록되었습니다.");
      router.push("/jobList");
    } catch (error) {
      console.error("요청 에러:", error);
      alert(error instanceof Error ? error.message : "등록에 실패했습니다.");
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const fileArray = Array.from(files);
      setValue("newImages", fileArray, { shouldValidate: true });
    }
  };

  const handleOpenFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-6 flex-1">
        <div>
          <label className="block text-sm text-text-primary mb-1">제목</label>
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="text"
                placeholder="제목을 입력해주세요"
                className="w-full"
              />
            )}
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm text-text-primary mb-1">
            지역 선택
          </label>
          <Controller
            name="mainRegion"
            control={control}
            render={({ field: { value, onChange } }) => (
              <Controller
                name="subRegion"
                control={control}
                render={({
                  field: { value: subValue, onChange: subOnChange },
                }) => (
                  <RegionDropdown
                    selectedMainRegion={value}
                    setSelectedMainRegion={onChange}
                    selectedSubRegion={subValue}
                    setSelectedSubRegion={subOnChange}
                    buttonClassName="w-full flex px-4 py-4 items-center gap-2 self-stretch rounded-xl border focus:border-[rgba(27,141,90,0.93)] focus:outline-none"
                  />
                )}
              />
            )}
          />
          {(errors.mainRegion || errors.subRegion) && (
            <p className="text-red-500 text-sm mt-1">지역을 선택해주세요</p>
          )}
        </div>

        <div>
          <label className="block text-sm text-text-primary mb-1">금액</label>
          <Controller
            name="price"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="text"
                placeholder="₩ 1,000"
                value={
                  field.value
                    ? `₩ ${Number(
                        field.value.replace(/[^0-9]/g, "")
                      ).toLocaleString()}`
                    : ""
                }
                className="w-full"
              />
            )}
          />
          {errors.price && (
            <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm text-text-primary mb-1">
            상세 내용
          </label>
          <Controller
            name="contents"
            control={control}
            render={({ field }) => (
              <textarea
                {...field}
                placeholder="내용을 입력해주세요"
                className="resize-none flex w-full h-[13rem] px-4 py-4 items-center gap-2 self-stretch rounded-xl border focus:border-[rgba(27,141,90,0.93)] focus:outline-none"
              />
            )}
          />
          {errors.contents && (
            <p className="text-red-500 text-sm mt-1">
              {errors.contents.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            사진 첨부
          </label>
          <div className="flex gap-4 flex-wrap">
            {/* 사진 파일 선택 버튼 */}
            <div
              className="w-[100px] h-[100px] border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
              onClick={handleOpenFileDialog}
            >
              <Image
                src="/icons/camera.png"
                alt="Upload Image"
                width={40}
                height={40}
              />
            </div>

            {/* 이미지 선택 후 보여질 이미지 썸네일 */}
            {watch("newImages")?.map((image, index) => (
              <div key={index} className="w-[100px] h-[100px] relative group">
                <Image
                  src={URL.createObjectURL(image)}
                  alt={`new-image-${index}`}
                  fill
                  className="object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => {
                    const newImages = [...(watch("newImages") || [])];
                    newImages.splice(index, 1);
                    setValue("newImages", newImages);
                  }}
                  className="absolute top-1 right-1 w-6 h-6 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        <div className="w-full">
          <Button
            type="submit"
            design="design1"
            width="full"
            className="h-[3.5rem]"
          >
            {"등록하기"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default JobBoardNew;
