// /Users/su/Documents/practice/241224-2/src/app/profileEdit/page.tsx

"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/commons/Button";
import Modal from "@/commons/Modal";

export default function ProfileEdit() {
  const router = useRouter();
  const [modalType, setModalType] = useState<"logout" | "withdraw" | null>(
    null
  );

  const handleLogout = () => {
    router.push("/login");
  };

  const handleWithdraw = () => {
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="h-12 bg-nav-bg shadow-[0px_4px_8px_0px_rgba(0,0,0,0.10)]">
        <div className="h-12 px-2 flex justify-between items-center">
          <button className="w-11 h-11 p-2.5" aria-label="뒤로 가기">
            {/* 뒤로가기 아이콘 */}
          </button>
          {/* text-xl -> text-title로 변경 (20px Bold) */}
          <h1 className="text-title-xl">회원정보 수정</h1>
          <div className="w-11" aria-hidden="true" />
        </div>
      </header>

      <main className="px-5 mt-8">
        <section className="mb-12">
          <div className="mb-7">
            {/* text-sm font-bold -> text-sm-bold로 변경 (14px Bold) */}
            <h2 className="text-text-quinary text-sm-bold mb-[22px]">
              프로필 정보 수정
            </h2>
            <div className="flex justify-center">
              <div
                className="relative w-[100px] h-[100px] bg-white rounded-full"
                role="img"
                aria-label="프로필 이미지"
              >
                {/* 프로필 이미지 */}
              </div>
            </div>
          </div>

          <div className="mb-7">
            {/* text-sm font-bold -> text-sm-bold로 변경 */}
            <label
              htmlFor="nickname"
              className="text-text-quinary text-sm-bold block mb-1"
            >
              닉네임
            </label>
            <input
              id="nickname"
              type="text"
              placeholder="닉네임을 입력해주세요"
              className="w-full p-4 bg-nav-bg rounded-xl 
            border border-text-tertiary 
            text-base-medium 
            placeholder:text-placeholder 
            focus:outline-none 
            focus:border-primary"
            />
          </div>
        </section>

        <section className="flex flex-col items-center gap-4">
          <Button
            design="design1"
            className="bg-btn-secondary text-text-primary"
            onClick={() => setModalType("logout")}
          >
            로그아웃
          </Button>
          <Button
            design="design4"
            width="fit"
            onClick={() => setModalType("withdraw")}
          >
            회원탈퇴
          </Button>
        </section>
      </main>

      {/* 로그아웃 모달 */}
      <Modal
        isOpen={modalType === "logout"}
        onClose={() => setModalType(null)}
        onConfirm={handleLogout}
        title="로그아웃"
        description="정말 로그아웃 하시겠습니까?"
        confirmText="확인"
      />

      {/* 회원탈퇴 모달 */}
      <Modal
        isOpen={modalType === "withdraw"}
        onClose={() => setModalType(null)}
        onConfirm={handleWithdraw}
        title="회원탈퇴"
        description="정말 탈퇴하시겠습니까?"
        confirmText="탈퇴"
      />
    </div>
  );
}
