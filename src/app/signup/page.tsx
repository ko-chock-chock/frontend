// /Users/su/Documents/practice/241225/src/app/signup/page.tsx
"use client";
import Image from "next/image";
import Button from "@/commons/Button";
import BackButton from "@/../public/icons/Back_icon_24px.svg";
import CheckIcon from "@/../public/icons/signup_check_disabled_icon_24px.svg";
import CheckValidIcon from "@/../public/icons/signup_check_valid_icon_24px.svg";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const router = useRouter();
  const handleMainPage = () => {
    router.push("/");
  };
  return (
    <div className=" flex items-center justify-center  h-screen w-screen px-5">
      <div className="flex items-center flex-col w-full gap-[60px]">
        {/* 최상단 타이틀 라인 */}
        <div>
          <Image src={BackButton} alt="backButton" />
          <div>회원가입</div>
        </div>
        {/* 인풋 세트 */}
        <div className="w-full flex flex-col gap-7">
          {/* 인풋1 닉네임 */}
          <div className=" bg-cyan-400">
            <div>닉네임</div>
            <input
              type="text"
              placeholder="철수"
              className="w-full h-[56px] px-4 border border-[#a39f8e] rounded-lg"
            />
          </div>
          {/* 인풋 이메일 */}
          <div>
            <div>이메일</div>
            <input
              type="text"
              placeholder="abc@naver.com"
              className="w-full h-[56px] px-4 border border-[#a39f8e] rounded-lg"
            />
          </div>
          {/* 인풋 비밀번호 */}
          <div>
            <div>비밀번호</div>
            <input
              type="password"
              placeholder="아래의 조건들을 충족하여 작성해 주세요."
              className="w-full h-[56px] px-4 border border-[#a39f8e] rounded-lg"
            />
          </div>
        </div>
        {/* 비밀번호 작성가이드 문구 */}
        <div>
          <div>
            <Image src={CheckIcon} alt="checkIcon" />
            <p>영문/숫자/특수문자 중, 2가지 이상 포함</p>
          </div>
          <div>
            <Image src={CheckIcon} alt="checkIcon" />
            <p>8자 이상 32자 이하 입력 (공백 제외)</p>
          </div>
          <div>
            <Image src={CheckIcon} alt="checkIcon" />
            <p>연속 3자 이상 동일한 문자/숫자 제외</p>
          </div>
        </div>

        <Button
          design="design1"
          className="bg-btn-secondary text-text-primary"
          onClick={handleMainPage}
        >
          로그인
        </Button>
      </div>
    </div>
  );
}
