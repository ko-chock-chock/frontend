"use client";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import Button from "@/commons/Button";
import Input from "@/commons/input";
import RegionDropdown from "@/commons/regionsDropdown";
import { useParams, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

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

const JobBoardEdit = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();
  const { boardId: boardId } = useParams();
  const [existingImages, setExistingImages] = useState<string[]>([]); // 기존 이미지 저장

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

  // 기존 등록 데이터 불러오기
  useEffect(() => {
    const fetchPostData = async () => {
      const token = getAccessToken();
      if (!token) throw new Error("로그인이 필요합니다.");
      if (!boardId) return;
      try {
        const response = await fetch(
          `http://3.36.40.240:8001/api/trade/${boardId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) throw new Error("게시글을 불러올 수 없습니다.");
        const postData = await response.json();

        // ✅ 기존 데이터 폼에 입력
        setValue("title", postData.title);
        setValue("mainRegion", postData.region.split(" ")[0] || "");
        setValue("subRegion", postData.region.split(" ")[1] || "");
        setValue("price", String(postData.price));
        setValue("contents", postData.contents);

        // ✅ 기존 이미지 저장
        setExistingImages(postData.images || []);
      } catch (error) {
        console.error(error);
        alert("게시글 불러오기에 실패했습니다.");
      }
    };

    fetchPostData();
  }, [boardId, setValue]);

  const onSubmit = async (data: onSubmitProps) => {
    try {
      const token = getAccessToken();
      if (!token) throw new Error("로그인이 필요합니다.");

      let imageLinks: string[] = [...existingImages]; // 기존 이미지 유지

      // ✅ 새로 추가한 이미지가 있으면 업로드 후 기존 이미지와 합침
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
        imageLinks = [...imageLinks, ...uploadResult]; // 기존 이미지 + 새 이미지 합치기
      }

      // ✅ 기존 이미지 유지 + 새 이미지 추가해서 전송
      const payload = {
        title: data.title,
        region: `${data.mainRegion} ${data.subRegion}`,
        price: data.price,
        contents: data.contents,
        images: imageLinks, // 기존 이미지 + 새 이미지 포함
      };

      const response = await fetch(
        `http://3.36.40.240:8001/api/trade/${boardId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "수정 실패");
      }

      alert("게시물이 성공적으로 수정되었습니다.");
      router.push("/jobList");
    } catch (error) {
      console.error("요청 에러:", error);
      alert(error instanceof Error ? error.message : "수정에 실패했습니다.");
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
  const handleRemoveExistingImage = (index: number) => {
    setExistingImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleRemoveNewImage = (index: number) => {
    const newImages = [...(watch("newImages") || [])];
    newImages.splice(index, 1);
    setValue("newImages", newImages);
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
            render={({ field }) => {
              const rawValue = field.value ? String(field.value) : "";
              const formattedValue =
                rawValue.replace(/[^0-9]/g, "") === ""
                  ? ""
                  : `₩ ${Number(
                      rawValue.replace(/[^0-9]/g, "")
                    ).toLocaleString()}`;

              return (
                <Input
                  {...field}
                  type="text"
                  placeholder="₩ 1,000"
                  value={formattedValue}
                  onChange={(e) => {
                    const numericValue = e.target.value.replace(/[^0-9]/g, "");
                    field.onChange(numericValue);
                  }}
                  className="w-full"
                />
              );
            }}
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

            {/* 기존 이미지 썸네일 */}
            {existingImages.map((imageUrl, index) => (
              <div
                key={`existing-${index}`}
                className="w-[100px] h-[100px] relative group"
              >
                <Image
                  src={imageUrl}
                  alt={`existing-image-${index}`}
                  fill
                  unoptimized
                  className="object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveExistingImage(index)}
                  className="absolute top-1 right-1 w-6 h-6 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            ))}

            {/* 이미지 선택 후 보여질 이미지 썸네일 */}
            {/* 새로 추가한 이미지 썸네일 */}
            {watch("newImages")?.map((image, index) => (
              <div key={index} className="w-[100px] h-[100px] relative group">
                <Image
                  src={URL.createObjectURL(image)}
                  alt={`new-image-${index}`}
                  fill
                  unoptimized
                  className="object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveNewImage(index)}
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
            {"수정하기"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default JobBoardEdit;
