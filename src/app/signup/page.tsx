// /Users/su/Documents/ko-chock-chock/frontend/src/app/signup/page.tsx
"use client";
import Image from "next/image";
import Button from "@/commons/Button";
import Input from "@/commons/input";
import CheckIcon from "@/../public/icons/signup_check_disabled_icon_24px.svg";
import CheckValidIcon from "@/../public/icons/signup_check_valid_icon_24px.svg";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";


export default function SignUpPage() {
  const router = useRouter();
  // 상태 관리 추가
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);

  // 비밀번호 조건 검사를 위한 상태
  const [passwordValidation, setPasswordValidation] = useState({
    hasMultipleTypes: false, // 영문/숫자/특수문자 중 2가지 이상
    hasValidLength: false, // 8-32자
    noConsecutive: false, // 연속 3자 이상 동일문자 없음
  });

  // 비밀번호 유효성 검사 함수
  const validatePassword = (pwd: string) => {
    // 영문/숫자/특수문자 중 2가지 이상 포함 검사
    const hasLetter = /[a-zA-Z]/.test(pwd);
    const hasNumber = /[0-9]/.test(pwd);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pwd);
    const typeCount = [hasLetter, hasNumber, hasSpecial].filter(Boolean).length;
    // 연속된 문자 검사
    // 연속된 문자 검사 수정
    let hasConsecutive = false;
    if (pwd.length >= 3) {
      // 최소 3글자 이상일 때만 검사
      for (let i = 0; i < pwd.length - 2; i++) {
        if (pwd[i] === pwd[i + 1] && pwd[i] === pwd[i + 2]) {
          hasConsecutive = true;
          break;
        }
      }
    }

    setPasswordValidation({
      hasMultipleTypes: typeCount >= 2,
      hasValidLength: pwd.length >= 8 && pwd.length <= 20,
      noConsecutive: pwd.length < 3 ? false : !hasConsecutive, // 3글자 미만이면 false
    });
  };

  // 모든 입력값 유효성 검사
  useEffect(() => {
    const isEmailValid =
      email.trim() !== "" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isNicknameValid = nickname.trim() !== "";
    const isPasswordValid = Object.values(passwordValidation).every(Boolean);
    const isPasswordMatch = password === passwordConfirm && password !== ""; // 비밀번호 일치 여부 확인

    setIsFormValid(isEmailValid && isNicknameValid && isPasswordValid &&isPasswordMatch);
  }, [email, nickname, password, passwordConfirm, passwordValidation]);

  // 비밀번호 변경 시 유효성 검사 실행
  useEffect(() => {
    validatePassword(password);
  }, [password]);

  const handleMainPage = () => {
    router.push("/");
  };
  return (
    <div className="fixed inset-0 ">

      <div className="flex items-center justify-center min-h-screen w-full px-5">
        <div className="flex flex-col w-full  mx-auto ">
          {/* 인풋 세트 */}
          <div className="flex flex-col gap-7">
            {/* 인풋 이메일 */}
            <div className="flex flex-col gap-1">
              <label htmlFor="email" className="text-sm-bold">
                이메일
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="abc@naver.com"
                className="w-full"
              />
            </div>
            {/* 인풋 닉네임 */}
            <div className="flex flex-col gap-1">
              <label htmlFor="nickname" className="text-sm-bold">
                닉네임
              </label>
              <Input
                id="nickname"
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="철수"
                className="w-full"
              />
            </div>

            {/* 비밀번호 입력 인풋과 작성가이드*/}
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label htmlFor="password" className="text-sm-bold">
                  비밀번호
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
                  className="w-full"
                />
              </div>
              {/* 비밀번호 가이드 - 조건 충족 여부에 따라 아이콘 변경 */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Image
                    src={
                      passwordValidation.hasMultipleTypes
                        ? CheckValidIcon
                        : CheckIcon
                    }
                    alt="checkIcon"
                  />
                  <p className="text-text-quaternary text-sm-medium">
                    영문/숫자/특수문자 중, 2가지 이상 포함
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Image
                    src={
                      passwordValidation.hasValidLength
                        ? CheckValidIcon
                        : CheckIcon
                    }
                    alt="checkIcon"
                  />
                  <p className="text-text-quaternary text-sm-medium">
                    8자 이상 32자 이하 입력 (공백 제외)
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Image
                    src={
                      passwordValidation.noConsecutive
                        ? CheckValidIcon
                        : CheckIcon
                    }
                    alt="checkIcon"
                  />
                  <p className="text-text-quaternary text-sm-medium">
                    연속 3자 이상 동일한 문자/숫자 제외
                  </p>
                </div>
              </div>
            </div>
            {/* 비밀번호 확인 입력 */}
            <div className="flex flex-col gap-1">
              <label htmlFor="passwordConfirm" className="text-sm-bold">
                비밀번호 확인
              </label>
              <Input
                id="passwordConfirm"
                type="password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                placeholder="비밀번호를 한번 더 입력해주세요."
                className="w-full"
              />
            </div>
          </div>
          <div className="mt-10">
            <Button
              design="design1"
              onClick={handleMainPage}
              disabled={!isFormValid}
            >
              가입하기
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
