"use client";

import Image from "next/image";
import Logo from "../../../public/images/logo_lg.svg";
import Button from "../../commons/Button";
import Input from "../../commons/input";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Zod 스키마 정의 - API 요청 형식에 맞춰서 수정
const loginSchema = z.object({
  mail: z
    .string()
    .min(1, "이메일을 입력해주세요")
    .email("올바른 이메일 형식이 아닙니다"),
  password: z
    .string()
    .min(1, "비밀번호를 입력해주세요")
    .min(7, "비밀번호는 7자 이상이어야 합니다"), // 8자에서 7자로 수정
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    setError, // 서버 에러를 폼에 표시하기 위해 추가
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      mail: "", // email에서 mail로 변경
      password: "",
    },
  });

  // 로그인 API 호출 함수
  const onSubmit = handleSubmit(async (data) => {
    try {
      // 1. API 호출 전 데이터 유효성 확인
      console.log("로그인 시도 데이터:", data);
      console.log("데이터 형식이 올바른지 확인:", {
        이메일: data.mail,
        비밀번호길이: data.password.length,
      });

      // 2. API 요청 보내기
      const response = await fetch(
        "https://api.kochokchok.shop/api/v1/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Refresh Token을 쿠키로 받기 위해 필수
          body: JSON.stringify(data),
        }
      );

      // 3. API 응답 상태 확인
      console.log("API 응답 상태:", response.status);
      console.log("응답 헤더 확인:", {
        "content-type": response.headers.get("content-type"),
        "set-cookie": response.headers.get("set-cookie"),
      });

      // 4. 에러 응답 처리
      if (!response.ok) {
        const errorData = await response.json();
        console.log("로그인 실패:", errorData);
        throw new Error(errorData.message || "로그인에 실패했습니다.");
      }

      // 5. 성공 응답 처리
      const result = await response.json();
      console.log("로그인 성공! 응답 데이터:", {
        상태: result.status,
        메시지: result.message,
        토큰유무: !!result.accessToken,
      });

      // 6. Access Token 저장
      if (result.accessToken) {
        localStorage.setItem("accessToken", result.accessToken);
        console.log("Access Token이 로컬 스토리지에 저장되었습니다!");
        const savedToken = localStorage.getItem("accessToken");
        console.log("저장된 토큰 확인:", savedToken?.substring(0, 20) + "...");
      }

      // 7. 리다이렉션 처리
      console.log("로그인 완료! 메인 페이지로 이동합니다...");
      router.push("/");
    } catch (error: unknown) {
      // 여기서 unknown 타입을 명시적으로 선언
      // 8. 에러 처리
      if (error instanceof Error) {
        // 타입 가드를 사용하여 Error 타입 체크
        console.error("로그인 중 에러 발생:", {
          에러메시지: error.message,
          에러종류: error.name,
        });

        setError("root", {
          message:
            error.message ||
            "로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.",
        });
      } else {
        // Error 인스턴스가 아닌 경우의 처리
        console.error("예상치 못한 에러 발생:", error);
        setError("root", {
          message: "로그인 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.",
        });
      }
    }
  });

  return (
    <div className="fixed inset-0">
      <div className="flex items-center justify-center h-screen w-screen px-5">
        <div className="flex items-center flex-col w-full gap-[60px]">
          <Image src={Logo} alt="logo" priority />

          <form onSubmit={onSubmit} className="w-full flex flex-col gap-7">
            <Controller
              name="mail"
              control={control}
              render={({ field }) => (
                <Input
                  type="email"
                  placeholder="이메일"
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.mail?.message}
                  className="w-full"
                />
              )}
            />

            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <Input
                  type="password"
                  placeholder="비밀번호"
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.password?.message}
                  className="w-full"
                />
              )}
            />

            {/* 전역 에러 메시지 표시 */}
            {errors.root && (
              <span className="text-error text-sm">{errors.root.message}</span>
            )}

            <Button design="design1" type="submit" disabled={!isValid}>
              로그인
            </Button>
          </form>

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
