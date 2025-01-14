"use client";

import Image from "next/image";
import Logo from "../../../public/images/logo_lg.svg";
import Button from "../../commons/Button";
import Input from "../../commons/input";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUserStore } from "@/store/userStore"; // ✨ 추가: UserStore import

const loginSchema = z.object({
  mail: z
    .string()
    .min(1, "이메일을 입력해주세요")
    .email("올바른 이메일 형식이 아닙니다"),
  password: z
    .string()
    .min(1, "비밀번호를 입력해주세요")
    .min(7, "비밀번호는 7자 이상이어야 합니다"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useUserStore();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      mail: "",
      password: "",
    },
  });

  // JWT에서 user_id 추출하는 유틸리티 함수
  const extractUserIdFromToken = (token: string) => {
    try {
      const tokenParts = token.split(".");
      const payload = JSON.parse(atob(tokenParts[1]));
      return payload.user_id;
    } catch (error) {
      console.error("토큰 파싱 실패:", error);
      return null;
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      // 1. 로그인 요청 로깅
      console.log("=== 로그인 시도 ===");
      console.log("입력 데이터:", {
        이메일: data.mail,
        비밀번호길이: data.password.length,
      });

      // 2. 로그인 API 호출
      const loginResponse = await fetch(
        "https://api.kochokchok.shop/api/v1/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(data),
        }
      );

      if (!loginResponse.ok) {
        const errorData = await loginResponse.json();
        throw new Error(errorData.message || "로그인 실패");
      }

      const result = await loginResponse.json();
      console.log("=== 로그인 성공 ===", result);

      // 3. Access Token 처리 및 사용자 정보 조회
      if (result.accessToken) {
        localStorage.setItem("accessToken", result.accessToken);
        const userId = extractUserIdFromToken(result.accessToken);

        if (!userId) {
          throw new Error("유저 ID 추출 실패");
        }

        // 4. 사용자 정보 조회
        const userResponse = await fetch(
          `https://api.kochokchok.shop/api/v1/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${result.accessToken}`,
            },
          }
        );

        if (!userResponse.ok) {
          throw new Error("사용자 정보 조회 실패");
        }

        const userInfo = await userResponse.json();
        console.log("=== 사용자 정보 조회 성공 ===", userInfo);

        // 5. UserStore에 사용자 정보 저장
        setUser({
          user_id: userId,
          mail: userInfo.mail,
          name: userInfo.name,
          profile_image: userInfo.profile_image || null,
        });

        console.log("=== UserStore 저장 완료 ===");
        console.log("저장된 정보:", useUserStore.getState().user);
      }

      router.push("/");
    } catch (error) {
      console.error("=== 로그인 프로세스 실패 ===", error);
      if (error instanceof Error) {
        setError("root", {
          message: error.message || "로그인 처리 중 오류가 발생했습니다.",
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
