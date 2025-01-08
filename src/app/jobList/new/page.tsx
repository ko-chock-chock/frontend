"use client";
import Button from "@/commons/Button";
import Input from "@/commons/input";
import Image from "next/image";
import React, { ChangeEvent, useState } from "react";

const JobListNew = () => {
  const [value, setValue] = useState<string>("");

  // 숫자를 천 단위로 포맷팅하는 함수
  const formatCurrency = (value: string): string => {
    const numberValue = parseInt(value.replace(/,/g, ""), 10) || 0;
    return numberValue.toLocaleString();
  };

  // 입력값 처리
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    // 포맷팅된 값으로 상태 업데이트
    setValue(formatCurrency(inputValue));
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* 입력 필드 */}
      <div className="p-4 space-y-6 flex-1">
        {/* 제목 입력 */}
        <div>
          <label className="block text-sm text-text-secondary mb-1">제목</label>
          <Input
            type="text"
            placeholder="제목을 입력해주세요"
            className="w-full"
          />
        </div>

        {/* 금액 입력 */}
        <div>
          <label className="block text-sm text-text-secondary mb-1">금액</label>
          <Input
            type="text"
            value={value}
            placeholder="₩ 1,000"
            className="w-full"
            onChange={handleChange}
          />
        </div>

        {/* 상세 내용 입력 */}
        <div>
          <label className="block text-sm text-text-secondary mb-1 ">
            상세 내용
          </label>
          <textarea
            placeholder="내용을 입력해주세요"
            className="resize-none flex w-full h-[13rem] px-4 py-4 items-center gap-2 self-stretch rounded-xl border focus:border-[rgba(27,141,90,0.93)] focus:outline-none"
          ></textarea>
        </div>

        {/* 사진 첨부 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            사진 첨부
          </label>
          <div className="w-25 h-25 flex gap-2 flex-wrap mb-[3.125rem]">
            <Image
              src="/images/post_new_upload_btn_img.svg"
              alt="Post List View Icon"
              width={100}
              height={100}
              className=""
            />
            <Image
              src="/images/post_new_upload_btn_img.svg"
              alt="Post List View Icon"
              width={100}
              height={100}
              className=""
            />
          </div>
        </div>
      </div>

      {/* 등록하기 버튼 */}
      <div className="w-full px-5 pb-[3.125rem]">
        <Button design="design1" width="full" className="h-[3.5rem]">
          등록하기
        </Button>
      </div>
    </div>
  );
};

export default JobListNew;
