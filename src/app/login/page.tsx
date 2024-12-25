// /Users/su/Documents/practice/241225/src/app/login/page.tsx

"use client";

import Image from "next/image";
import Logo from "../../../public/images/logo_lg.svg";
import Button from "../../commons/Button";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const handleLogin = () => {
    router.push("/");
  };

  const handleSignup = () => {
    router.push("/signup");
  };
  return (
    // 부모
    <div className=" flex items-center justify-center  h-screen w-screen px-5">
      {/* 로고 포함 내용 전체 */}
      <div className="flex items-center flex-col w-full gap-[60px]">
        <Image src={Logo} alt="logo" />

        {/* 인풋 */}
        <div className="w-full flex flex-col gap-7  ">
          <input
            type="text"
            placeholder="이메일"
            className="h-[56px] px-4 border border-text-tertiary rounded-lg
             text-base-medium
             placeholder:text-placeholder"
          />
          <input
            type="password"
            placeholder="비밀번호"
            className="h-[56px] px-4 border border-text-tertiary rounded-lg
             text-base-medium
             placeholder:text-placeholder"
          />
        </div>
        <Button
          design="design1"
          className="bg-btn-secondary text-text-primary"
          onClick={handleLogin}
        >
          로그인
        </Button>
        {/* 회원가입 버튼 */}
        <Button design="design4" width="fit" onClick={handleSignup}>
          회원가입
        </Button>
      </div>
    </div>
  );
}
