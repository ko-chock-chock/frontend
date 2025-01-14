/**
 * 회원가입 페이지 (SignUpPage)
 *
 * 주요 기능:
 * 1. 이메일, 닉네임(name), 비밀번호 입력 및 유효성 검사
 * 2. 실시간 비밀번호 조건 체크 및 시각적 피드백
 * 3. React Hook Form과 Zod를 사용한 폼 상태 관리 및 유효성 검사
 * 4. API 연동을 통한 회원가입 처리
 * 5. 에러 처리 및 사용자 피드백
 *
 * 구현 세부사항:
 * - 모든 입력필드는 React Hook Form으로 관리되어 불필요한 리렌더링 방지
 * - Zod를 통한 타입안정성과 유효성검사 통합
 * - 비밀번호 조건 충족 시 실시간 시각적 피드백 제공
 * - 회원가입 성공/실패에 따른 적절한 피드백과 페이지 리다이렉션
 *
 * Backend API 참고사항:
 * - UI상 "닉네임"으로 표시되는 필드는 API에서 "name"으로 전송됨
 * - API Endpoint: https://api.kochokchok.shop/api/v1/user/signup
 * - 요청 메소드: POST
 */

"use client";

import Image from "next/image";
import Button from "@/commons/Button";
import Input from "@/commons/input";
import CheckIcon from "@/../public/icons/signup_check_disabled_icon_24px.svg";
import CheckValidIcon from "@/../public/icons/signup_check_valid_icon_24px.svg";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

/**
 * Zod 스키마 정의
 *
 * 각 필드별 유효성 검사 규칙:
 * 1. 이메일 (mail)
 *    - 필수 입력
 *    - 올바른 이메일 형식 (@포함)
 *
 * 2. 닉네임 (name)
 *    - 필수 입력
 *    - 최대 20자 제한
 *
 * 3. 비밀번호 (password)
 *    - 7-32자 제한
 *    - 영문/숫자/특수문자 중 2가지 이상 조합
 *    - 연속된 문자 3개 이상 사용 불가
 *
 * 4. 비밀번호 확인
 *    - 비밀번호 필드와 일치 여부 검사
 */
const signupSchema = z
  .object({
    // 이메일 검증: 필수 입력 & 이메일 형식 체크
    mail: z
      .string()
      .min(1, "이메일을 입력해주세요")
      .email("올바른 이메일 형식이 아닙니다"),

    // 닉네임 검증: 필수 입력 & 최대 길이 제한 (BE에서는 name으로 사용)
    name: z
      .string()
      .min(1, "닉네임을 입력해주세요")
      .max(20, "닉네임은 20자 이하여야 합니다"),

    // 비밀번호 검증: 복합 규칙 적용
    password: z
      .string()
      .min(1, "비밀번호를 입력해주세요")
      .min(7, "비밀번호는 7자 이상이어야 합니다")
      .max(32, "비밀번호는 32자 이하여야 합니다")
      .refine(
        (password) => {
          const hasLetter = /[a-zA-Z]/.test(password);
          const hasNumber = /[0-9]/.test(password);
          const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
          const typeCount = [hasLetter, hasNumber, hasSpecial].filter(
            Boolean
          ).length;
          return typeCount >= 2;
        },
        { message: "영문/숫자/특수문자 중 2가지 이상을 포함해야 합니다" }
      )
      .refine(
        (password) => {
          for (let i = 0; i < password.length - 2; i++) {
            if (
              password[i] === password[i + 1] &&
              password[i] === password[i + 2]
            ) {
              return false;
            }
          }
          return true;
        },
        { message: "연속된 3자 이상의 동일한 문자/숫자는 사용할 수 없습니다" }
      ),

    // 비밀번호 확인 필드
    passwordConfirm: z.string().min(1, "비밀번호 확인을 입력해주세요"),
  })
  // 비밀번호 일치 여부 검증
  .refine((data) => data.password === data.passwordConfirm, {
    message: "비밀번호가 일치하지 않습니다",
    path: ["passwordConfirm"],
  });

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignUpPage() {
  const router = useRouter();

  /**
   * React Hook Form 설정
   * mode: "onChange" - 입력값 변경시마다 실시간 유효성 검사
   * resolver: zodResolver - Zod 스키마 연동으로 타입 안정성 확보
   */
  const {
    control,
    watch,
    handleSubmit,
    formState: { errors, isValid },
    setError,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: "onChange",
  });

  // 비밀번호 입력값 실시간 감시
  const password = watch("password");

  /**
   * 비밀번호 유효성 검사 정규식 해석:
   * ^(?:              # 문자열 시작
   *   (?=.*[a-zA-Z])  # 영문자 최소 1개 포함
   *   (?=.*\d)        # 숫자 최소 1개 포함
   *   |               # 또는
   *   (?=.*[특수문자]) # 특수문자 최소 1개 포함
   * )
   */
  const passwordValidation = {
    hasMultipleTypes:
      /^(?:(?=.*[a-zA-Z])(?=.*\d)|(?=.*[a-zA-Z])(?=.*[!@#$%^&*(),.?":{}|<>])|(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]))/.test(
        password || ""
      ),
    hasValidLength:
      (password?.length ?? 0) >= 7 && (password?.length ?? 0) <= 32,
    noConsecutive: !(password || "").match(/(.)\1{2,}/), // 동일 문자가 3번 이상 반복되는지 확인
  };

  /**
   * 회원가입 폼 제출 처리 함수
   * 1. 폼 데이터 유효성 검증
   * 2. API 요청 및 응답 처리
   * 3. 성공/실패에 따른 피드백 제공
   */
  const onSubmit = handleSubmit(async (data) => {
    try {
      // 1. 폼 데이터 확인
      console.log("회원가입 시도:", {
        이메일: data.mail,
        닉네임: data.name,
        비밀번호길이: data.password.length,
      });

      // 2. API 요청
      console.log("API 요청 시작...");
      const response = await fetch(
        "https://api.kochokchok.shop/api/v1/user/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mail: data.mail,
            name: data.name,
            password: data.password,
          }),
        }
      );

      // 3. 응답 상태 확인
      console.log("API 응답 상태:", response.status);
      console.log("응답 헤더:", {
        "content-type": response.headers.get("content-type"),
      });

      // 4. 에러 응답 처리
      if (!response.ok) {
        const errorData = await response.json();
        console.log("회원가입 실패:", errorData);
        throw new Error(errorData.message || "회원가입에 실패했습니다.");
      }

      // 5. 성공 응답 처리
      const result = await response.json();
      console.log("회원가입 성공!", {
        상태: result.status,
        메시지: result.message,
      });

      // 6. 리다이렉션 전
      console.log("로그인 페이지로 이동합니다...");
      router.push("/login");
    } catch (error) {
      // 7. 에러 로깅 및 처리
      if (error instanceof Error) {
        console.error("회원가입 중 에러 발생:", {
          에러메시지: error.message,
          에러종류: error.name,
        });
        setError("root", {
          message: error.message || "회원가입 중 오류가 발생했습니다.",
        });
      }
    }
  });

  return (
    <div className="fixed inset-0">
      <div className="flex items-center justify-center min-h-screen w-full px-5">
        <div className="flex flex-col w-full mx-auto">
          {/* 회원가입 폼 */}
          <form onSubmit={onSubmit} className="flex flex-col gap-7">
            {/* 이메일 입력 필드 - React Hook Form Controller 사용 */}
            <div className="flex flex-col gap-1">
              <label htmlFor="mail" className="text-sm-bold">
                이메일
              </label>
              <Controller
                name="mail"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="email"
                    placeholder="abc@naver.com"
                    error={errors.mail?.message}
                    className="w-full"
                  />
                )}
              />
            </div>

            {/* 닉네임 입력 필드 - Backend에서는 'name'으로 처리 */}
            <div className="flex flex-col gap-1">
              <label htmlFor="name" className="text-sm-bold">
                닉네임
              </label>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="text"
                    placeholder="철수"
                    error={errors.name?.message}
                    className="w-full"
                  />
                )}
              />
            </div>

            {/* 비밀번호 입력 영역 */}
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label htmlFor="password" className="text-sm-bold">
                  비밀번호
                </label>
                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="password"
                      placeholder="********"
                      error={errors.password?.message}
                      className="w-full"
                    />
                  )}
                />
              </div>

              {/* 비밀번호 유효성 체크 표시 - 실시간 시각적 피드백 */}
              <div className="flex flex-col gap-2">
                {/* 복잡도 체크 */}
                <div className="flex items-center gap-2">
                  <Image
                    src={
                      password && passwordValidation.hasMultipleTypes
                        ? CheckValidIcon
                        : CheckIcon
                    }
                    alt="checkIcon"
                  />
                  <p
                    className={`text-sm-medium ${
                      password && passwordValidation.hasMultipleTypes
                        ? "text-primary"
                        : "text-text-quaternary"
                    }`}
                  >
                    영문/숫자/특수문자 중, 2가지 이상 포함
                  </p>
                </div>

                {/* 길이 체크 */}
                <div className="flex items-center gap-2">
                  <Image
                    src={
                      password && passwordValidation.hasValidLength
                        ? CheckValidIcon
                        : CheckIcon
                    }
                    alt="checkIcon"
                  />
                  <p
                    className={`text-sm-medium ${
                      password && passwordValidation.hasValidLength
                        ? "text-primary"
                        : "text-text-quaternary"
                    }`}
                  >
                    7자 이상 32자 이하 입력 (공백 제외)
                  </p>
                </div>

                {/* 연속 문자 체크 */}
                <div className="flex items-center gap-2">
                  <Image
                    src={
                      password && passwordValidation.noConsecutive
                        ? CheckValidIcon
                        : CheckIcon
                    }
                    alt="checkIcon"
                  />
                  <p
                    className={`text-sm-medium ${
                      password && passwordValidation.noConsecutive
                        ? "text-primary"
                        : "text-text-quaternary"
                    }`}
                  >
                    연속 3자 이상의 동일한 문자/숫자 제외
                  </p>
                </div>
              </div>
            </div>

            {/* 비밀번호 확인 필드 */}
            <div className="flex flex-col gap-1">
              <label htmlFor="passwordConfirm" className="text-sm-bold">
                비밀번호 확인
              </label>
              <Controller
                name="passwordConfirm"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="password"
                    placeholder="비밀번호를 한번 더 입력해주세요"
                    error={errors.passwordConfirm?.message}
                    className="w-full"
                  />
                )}
              />
            </div>

            {/* 전역 에러 메시지 표시 영역 */}
            {errors.root && (
              <span className="text-error text-sm">{errors.root.message}</span>
            )}

            {/* 가입하기 버튼 - 폼 유효성 검사 통과시에만 활성화 */}
            <div className="mt-10">
              <Button design="design1" type="submit" disabled={!isValid}>
                가입하기
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
