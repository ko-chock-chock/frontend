// /Users/su/Documents/ko-chock-chock/frontend/src/app/login/page.tsx
"use client";

import Image from "next/image";
import Logo from "../../../public/images/logo_lg.svg";
import Button from "../../commons/Button";
import Input from "../../commons/input"; // Input 컴포넌트 import 추가
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"; // useState import 추가

// 에러 상태를 위한 타입 정의
interface LoginErrors {
  email: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  // 이메일과 비밀번호 상태 관리 추가
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  // errors 상태의 타입 지정
  const [errors, setErrors] = useState<LoginErrors>({
    email: "",
    password: "",
  });

  // 이메일 유효성 검사
  const validateEmail = (email: string) => {
    if (!email) {
      setErrors((prev) => ({ ...prev, email: "이메일을 입력해주세요" }));
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrors((prev) => ({
        ...prev,
        email: "올바른 이메일 형식이 아닙니다",
      }));
      return false;
    }
    setErrors((prev) => ({ ...prev, email: "" }));
    return true;
  };

  // 비밀번호 유효성 검사
  const validatePassword = (password: string) => {
    if (!password) {
      setErrors((prev) => ({ ...prev, password: "비밀번호를 입력해주세요" }));
      return false;
    }
    if (password.length < 8) {
      setErrors((prev) => ({
        ...prev,
        password: "비밀번호는 8자 이상이어야 합니다",
      }));
      return false;
    }
    setErrors((prev) => ({ ...prev, password: "" }));
    return true;
  };

  useEffect(() => {
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    setIsFormValid(isEmailValid && isPasswordValid);
  }, [email, password]);
  const handleLogin = () => {
    router.push("/");
  };

  const handleSignup = () => {
    router.push("/signup");
  };

  return (
    <div className="fixed inset-0">
      <div className="flex items-center justify-center h-screen w-screen px-5">
        <div className="flex items-center flex-col w-full gap-[60px]">
          <Image src={Logo} alt="logo" />

          {/* 인풋 영역 수정 */}
          <div className="w-full flex flex-col gap-7">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일"
              error={errors.email}
              name="email"
              id="email"
              className="w-full"
            />
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호"
              error={errors.password}
              name="password"
              id="password"
              className="w-full"
            />
          </div>

          <Button
            design="design1"
            onClick={handleLogin}
            disabled={!isFormValid}
          >
            로그인
          </Button>

          <Button design="design4" width="fit" onClick={handleSignup}>
            회원가입
          </Button>
        </div>
      </div>
    </div>
  );
}
