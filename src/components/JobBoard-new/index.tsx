"use client";
import { Controller } from "react-hook-form";
import Button from "@/commons/Button";
import Input from "@/commons/input";
import RegionDropdown from "@/commons/regionsDropdown";
import Image from "next/image";
import { useJobBoardNew } from "./hook";

const JobBoardNew = () => {
  const {
    control,
    errors,
    handleSubmit,
    onSubmit,
    handleOpenFileDialog,
    watch,
    handleRemoveNewImage,
    fileInputRef,
    handleFileChange,
  } = useJobBoardNew();

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
              const displayValue = field.value
                ? `₩ ${Number(
                    field.value.replace(/[^0-9]/g, "")
                  ).toLocaleString()}`
                : "";

              return (
                <Input
                  {...field}
                  type="text"
                  placeholder="₩ 1,000"
                  value={displayValue}
                  onChange={(e) => {
                    const rawValue = e.target.value.replace(/[^0-9]/g, "");
                    field.onChange(rawValue);
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
            {"등록하기"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default JobBoardNew;
