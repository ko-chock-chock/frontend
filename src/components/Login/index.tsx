// src/components/Login/index.tsx
"use client";

/**
 * 로그인 컴포넌트
 * 
 * 주요 기능:
 * - 이메일/비밀번호 기반 로그인
 * - 폼 유효성 검증
 * - 에러 메시지 표시
 * - 로딩 상태 처리
 * 
 * 수정사항 (2024.02.04):
 * 1. 레이아웃 구조 변경 (fixed positioning 활용)
 * 2. 스타일 시스템 적용 (globals.css, tailwind.config 활용)
 * 3. px to rem 변환 적용
 * 4. Input, Button 컴포넌트 스타일 최적화
 */

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Controller, Control } from "react-hook-form";
import Logo from "@/../public/images/logo_lg.svg";
import Button from "@/commons/Button";
import Input from "@/commons/input";
import { useLogin } from "./hook";
import type { LoginFormData, LoginFormField } from "./types";

export default function LoginComponent() {
  const router = useRouter();
  const { form, isLoading, onSubmit } = useLogin();
  const { formState: { errors, isValid }, control } = form;

  return (
    // 전체 화면 고정 컨테이너
    <div className="fixed inset-0 bg-loginpage-bg">
      {/* 중앙 정렬을 위한 컨테이너 */}
      <div className="flex items-center justify-center h-screen w-screen px-[1.25rem]">
        {/* 콘텐츠 영역 */}
        <div className="flex items-center flex-col w-full gap-[3.75rem]">
          {/* 로고 영역 */}
          <div className="w-[12.5625rem] h-[7.875rem]">
            <Image 
              src={Logo} 
              alt="logo" 
              priority 
              className="w-full h-full object-contain"
            />
          </div>

          {/* 폼 영역 */}
          <form onSubmit={onSubmit} className="w-full flex flex-col gap-[1.75rem]">
            {/* 이메일 입력 */}
            <Controller<LoginFormData>
              name="email"
              control={control as Control<LoginFormData>}
              render={({ field }: { field: LoginFormField }) => (
                <Input
                  type="email"
                  placeholder="이메일"
                   
                  error={errors.email?.message}
                  className=" w-full"
                  {...field}
                />
              )}
            />

            {/* 비밀번호 입력 */}
            <Controller<LoginFormData>
              name="password"
              control={control as Control<LoginFormData>}
              render={({ field }: { field: LoginFormField }) => (
                <Input
                  type="password"
                  placeholder="비밀번호"
                  error={errors.password?.message}
                  className="w-full"
                  {...field}
                />
              )}
            />

            {/* 에러 메시지 */}
            {errors.root && (
              <span className="text-error-message">{errors.root.message}</span>
            )}

            {/* 로그인 버튼 */}
            <Button 
              design="design1" 
              type="submit" 
              disabled={!isValid || isLoading}
              className="text-base-bold"
            >
              {isLoading ? "로그인 중..." : "로그인"}
            </Button>
          </form>

          {/* 회원가입 버튼 */}
          <Button
            design="design4"
            width="fit"
            onClick={() => router.push("/signup")}
            
          >
            회원가입
          </Button>
        </div>
      </div>
    </div>
  );
}

/**
 * 스타일 가이드:
 * 
 * 1. tailwind.config.ts 컬러 시스템
 * - bg-loginpage-bg: #FCFEF5 (로그인 페이지 배경)
 * - bg-background: #FEFEFE (입력 필드 배경)
 * - border-list-line: #E9E8E3 (입력 필드 테두리)
 * 
 * 2. globals.css text 스타일
 * - text-placeholder: 플레이스홀더 텍스트 스타일
 * - text-base-bold: 버튼 텍스트 스타일
 * - text-sm-medium-quaternary: 회원가입 링크 스타일
 * - text-error-message: 에러 메시지 스타일
 * 
 * 3. px to rem 변환 (1rem = 16px)
 * - 20px -> 1.25rem (padding)
 * - 60px -> 3.75rem (gap)
 * - 28px -> 1.75rem (gap)
 * - 16px -> 1rem (padding)
 * - 201px -> 12.5625rem (width)
 * - 126px -> 7.875rem (height)
 */