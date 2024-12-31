// /Users/su/Documents/ko-chock-chock/frontend/src/app/mypage/edit/page.tsx

"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Button from "@/commons/Button";
import Modal from "@/commons/Modal";
import Input from "@/commons/input";

export default function ProfileEdit() {
  const router = useRouter();
  const [modalType, setModalType] = useState<"logout" | "withdraw" | null>(
    null
  );
  const [nickname, setNickname] = useState("철수");
  const [password] = useState("*********");

  return (
    <div className="fixed inset-0">
      <div className="flex items-center justify-center min-h-screen w-full px-5">
        <div className="flex items-center flex-col w-full gap-[60px] ">
          <main className="w-full mt-8">
            {/* 프로필 섹션 */}
            <section className=" space-y-7 mb-12 ">
              {/* 프로필 이미지 영역 */}
              <div className="grid gap-[22px]">
                <h2 className="text-text-quinary text-sm-bold">
                  프로필 정보 수정
                </h2>
                <div className="flex justify-center">
                  <button>
                    <Image
                      src="/images/profileEdit_Img_upload_btn_img.svg"
                      width={100}
                      height={100}
                      alt="프로필 이미지 변경"
                    />
                  </button>
                </div>
              </div>

              {/* 계정 정보 입력 영역 */}
              <div className="w-full flex flex-col gap-[28px]">
                {/* 닉네임 입력 */}
                <div className="space-y-1">
                  <label
                    htmlFor="edit-nickname"
                    className="text-text-quinary text-sm-bold block"
                  >
                    닉네임
                  </label>
                  <Input
                    id="edit-nickname"
                    name="nickname"
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="닉네임을 입력해주세요"
                    className="w-full flex px-4 py-4 items-center gap-2 self-stretch rounded-xl border focus:border-[rgba(27,141,90,0.93)] focus:outline-none"
                  />
                </div>

                {/* 비밀번호 변경 */}
                <div className="space-y-1">
                  <label
                    htmlFor="edit-password"
                    className="text-text-quinary text-sm-bold block"
                  >
                    비밀번호
                  </label>
                  <div className="w-full flex justify-between gap-3">
                    <div className="basis-2/3">
                      <Input
                        id="edit-password"
                        name="password"
                        type="password"
                        value={password}
                        className="w-full"
                        onChange={() => {}}
                      />
                    </div>

                    <div className="basis-1/3">
                      <Button design="design2" className="h-[56px] w-full">
                        변경
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 계정 관리 버튼 영역 */}
            <section className="flex flex-col items-center gap-4 mb-8">
              <Button
                design="design1"
                className="bg-[#E8E7E3] text-text-primary"
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

          {/* 모달 영역 */}
          <Modal
            isOpen={modalType === "logout"}
            onClose={() => setModalType(null)}
            onConfirm={() => router.push("/login")}
            title="로그아웃"
            description="정말 로그아웃 하시겠습니까?"
            confirmText="확인"
          />
          <Modal
            isOpen={modalType === "withdraw"}
            onClose={() => setModalType(null)}
            onConfirm={() => router.push("/login")}
            title="회원탈퇴"
            description="정말 탈퇴하시겠습니까?"
            confirmText="탈퇴"
          />
        </div>
      </div>
    </div>
  );
}
