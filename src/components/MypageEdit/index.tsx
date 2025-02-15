// src/components/MyPageEdit/index.tsx
"use client";

/**
 * 프로필 수정 컴포넌트
 *
 * ✨ 주요 기능:
 * 1. 프로필 이미지 관리
 *   - 이미지 업로드/수정/삭제
 *   - 카메라 아이콘 오버레이
 *   - BottomSheetModal 연동
 *
 * 2. 닉네임 수정
 *   - 입력값 유효성 검사
 *   - 실시간 상태 업데이트
 *
 * 3. 비밀번호 변경
 *   - 아코디언 스타일 UI
 *   - 강화된 유효성 검사
 *   - 성공 시 자동 로그아웃
 *
 * 4. 계정 관리
 *   - 로그아웃
 *   - 회원탈퇴
 *
 * 🔄 수정사항 (2024.02.14):
 * 1. 이미지 처리 로직 개선
 * 2. 컴포넌트 구조 최적화
 * 3. 에러 처리 강화
 * 4. 접근성 개선
 */

import { useRef, useState, useCallback } from "react";
import Image from "next/image";
import Button from "@/commons/Button";
import Input from "@/commons/input";
import Modal from "@/commons/Modal";
import BottomSheetModal from "@/commons/BottomSheetModal";
import { useProfileEdit } from "./hook";

// 아이콘 imports 👇
import CheckIcon from "@/../public/icons/signup_check_disabled_icon_24px.svg";
import CheckValidIcon from "@/../public/icons/signup_check_valid_icon_24px.svg";
import CollapseIcon from "@/../public/icons/editAccount_collapse_24px.svg";
import ExpandIcon from "@/../public/icons/editAccount_expand_24px.svg";
import CameraIcon from "@/../public/images/profileEdit_camera.svg";

// 상수 정의
const DEFAULT_PROFILE_IMAGE = "/images/profileEdit_Img_upload_btn_img.svg";

/**
 * 비밀번호 유효성 검사 아이템 컴포넌트
 */
interface PasswordValidationItemProps {
  isValid: boolean;
  text: string;
}

const PasswordValidationItem = ({
  isValid,
  text,
}: PasswordValidationItemProps) => (
  <div className="flex items-center gap-2">
    <Image
      src={isValid ? CheckValidIcon : CheckIcon}
      alt=""
      width={24}
      height={24}
    />
    <p
      className={`text-sm-medium-quaternary ${isValid ? "!text-primary" : ""}`}
    >
      {text}
    </p>
  </div>
);

export default function ProfileEdit() {
  const {
    user,
    isLoading,
    isPasswordFormVisible,
    modalType,
    showSuccessModal,
    nickname,
    currentPassword,
    newPassword,
    tempImageUrl,
    validatePassword,
    setModalType,
    setNickname,
    setCurrentPassword,
    setNewPassword,
    setIsPasswordFormVisible,
    handleImageChange,
    handleImageDelete,
    saveChanges,
    handlePasswordUpdate,
    handleLogout,
    handleWithdraw,
    handleModalConfirm,
    getButtonText,
  } = useProfileEdit();

  // 🎯 Refs & State
  const passwordSectionRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  /**
   * 파일 입력 핸들러
   * 🔄 이미지 업로드 로직 개선
   */
  const onFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      try {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        // 🔍 파일 유효성 검사
        if (selectedFile.size > 5 * 1024 * 1024) {
          alert("파일 크기는 5MB를 초과할 수 없습니다.");
          return;
        }

        if (!selectedFile.type.startsWith("image/")) {
          alert("이미지 파일만 업로드 가능합니다.");
          return;
        }

        // 📤 이미지 변경 핸들러 호출
        handleImageChange(selectedFile);
      } catch (error) {
        console.error("[ProfileImage] 파일 업로드 실패:", error);
        alert("이미지 업로드에 실패했습니다. 다시 시도해주세요.");
      } finally {
        // 🧹 입력 필드 초기화
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    },
    [handleImageChange]
  );

  /**
   * 📸 이미지 처리 핸들러
   */
  const handleImageError = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      const target = e.target as HTMLImageElement;
      if (target.src.includes(DEFAULT_PROFILE_IMAGE)) return;
      target.src = DEFAULT_PROFILE_IMAGE;
    },
    []
  );

  const handleProfileImageClick = useCallback(() => {
    if (!user?.profileImage && !tempImageUrl) {
      fileInputRef.current?.click();
    } else {
      setIsBottomSheetOpen(true);
    }
  }, [user?.profileImage, tempImageUrl]);

  /**
   * 🔽 바텀시트 메뉴 아이템 정의
   */
  const bottomSheetMenuItems = [
    {
      label: "내 앨범에서 선택",
      onClick: () => fileInputRef.current?.click(),
      type: "default" as const,
    },
    {
      label: "프로필 이미지 삭제",
      onClick: handleImageDelete,
      type: "danger" as const,
    },
    {
      label: "창 닫기",
      onClick: () => setIsBottomSheetOpen(false),
      type: "cancel" as const,
    },
  ];

  // 비밀번호 유효성 검사 결과
  const passwordValidation = validatePassword(newPassword);

  return (
    <div className="min-h-screen flex flex-col">
      <main className="w-full px-5 pt-12 pb-24 flex flex-col space-y-7">
        <section className="space-y-7">
          {/* 프로필 이미지 영역 */}
          <div className="grid gap-[1.375rem]">
            <h2 className="text-sm-bold">프로필 정보 수정</h2>
            <div className="flex justify-center">
              <div className="relative w-[100px] h-[100px]">
                <button
                  onClick={handleProfileImageClick}
                  className="w-full h-full relative"
                >
                  <Image
                    src={
                      tempImageUrl
                        ? tempImageUrl
                        : user?.profileImage || DEFAULT_PROFILE_IMAGE
                    }
                    alt="프로필 이미지"
                    fill
                    priority
                    onError={handleImageError}
                    className="rounded-full object-cover"
                  />
                  {/* 조건문 제거하여 항상 카메라 아이콘이 표시되도록 함 */}
                  <div className="absolute right-0 bottom-0 w-7 h-7 flex items-center justify-center">
                    <Image
                      src={CameraIcon}
                      alt="카메라 아이콘"
                      width={28}
                      height={28}
                    />
                  </div>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={onFileChange}
                />
              </div>
            </div>
          </div>

          {/* 닉네임 변경 영역 */}
          <div className="space-y-1">
            <label htmlFor="nickname" className="text-sm-bold">
              닉네임
            </label>
            <div className="flex items-center gap-5">
              {/* 🔑 Input을 감싸는 래퍼 div 추가 */}
              <div className="flex-1">
                <Input
                  id="nickname"
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="닉네임을 입력해주세요"
                  className="w-full text-base-medium" // 🆕 w-full 추가
                />
              </div>
              <Button
                design="design1"
                width="fit" // 내용물 크기에 맞춤
                className="w-[40%]" // 명시적 너비 지정
                onClick={saveChanges}
                disabled={isLoading}
              >
                {getButtonText()}
              </Button>
            </div>
          </div>

          {/* 구분선 */}
          <div className="h-7 border-b border-[#E9E8E3]" />

          {/* 비밀번호 변경 토글 버튼 */}
          {!isPasswordFormVisible && (
            <Button
              design="design2"
              onClick={() => setIsPasswordFormVisible(true)}
              className="w-full h-12 flex items-center justify-center gap-2"
            >
              <Image src={CollapseIcon} alt="" width={24} height={24} />
              <span>비밀번호 변경</span>
            </Button>
          )}
        </section>

        {/* 비밀번호 변경 폼 (아코디언) */}
        {isPasswordFormVisible && (
          <section ref={passwordSectionRef} className="space-y-7">
            {/* 현재 비밀번호 입력 */}
            <div className="space-y-1">
              <label htmlFor="currentPassword" className="text-sm-bold">
                현재 비밀번호
              </label>
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="현재 비밀번호를 입력해주세요"
                className="w-full text-base-medium"
              />
            </div>

            {/* 새 비밀번호 입력 */}
            <div className="space-y-3">
              <div className="space-y-1">
                <label htmlFor="newPassword" className="text-sm-bold">
                  새 비밀번호
                </label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="새 비밀번호를 입력해주세요"
                  className="w-full text-base-medium"
                />
              </div>

              {/* 비밀번호 유효성 체크 표시 */}
              <div className="py-3 space-y-2">
                <PasswordValidationItem
                  isValid={passwordValidation.hasMultipleTypes}
                  text="영문/숫자/특수문자 중, 2가지 이상 포함"
                />
                <PasswordValidationItem
                  isValid={passwordValidation.hasValidLength}
                  text="7자 이상 32자 이하 입력 (공백 제외)"
                />
                <PasswordValidationItem
                  isValid={
                    Boolean(newPassword) && passwordValidation.noConsecutive
                  }
                  text="연속 3자 이상 동일한 문자/숫자 제외"
                />
              </div>

              {/* 버튼 영역 */}
              <div className="flex gap-4 mt-4">
                <Button
                  design="design2"
                  width="fit" // 🔑 중요: width를 'fit'으로 변경
                  onClick={() => setIsPasswordFormVisible(false)}
                  className="w-1/4 h-12" // Tailwind로 추가 너비 조정
                >
                  <Image src={ExpandIcon} alt="" width={24} height={24} />
                  <span>취소</span>
                </Button>
                <Button
                  design="design1"
                  width="fit" // 🔑 중요: width를 'fit'으로 변경
                  onClick={handlePasswordUpdate}
                  disabled={isLoading}
                  className="flex-1" // 나머지 공간 차지
                >
                  비밀번호 변경
                </Button>
              </div>
            </div>
          </section>
        )}

        {/* 계정 관리 버튼 영역 */}
        <section className="flex flex-col items-center gap-4">
          <Button
            design="design1"
            className="w-full !bg-[#E8E7E3] !text-[#26210C]"
            onClick={() => setModalType("logout")}
          >
            로그아웃
          </Button>
          <Button design="design4" onClick={() => setModalType("withdraw")}>
            회원탈퇴
          </Button>
        </section>
      </main>

      {/* 모달 영역 */}
      <Modal
        isOpen={modalType === "logout"}
        onClose={() => setModalType(null)}
        onConfirm={handleLogout}
        title="로그아웃"
        description="정말 로그아웃 하시겠습니까?"
        confirmText="확인"
      />
      <Modal
        isOpen={modalType === "withdraw"}
        onClose={() => setModalType(null)}
        onConfirm={handleWithdraw}
        title="회원탈퇴"
        description="정말 탈퇴하시겠습니까?"
        confirmText="탈퇴"
      />
      <Modal
        isOpen={showSuccessModal}
        onConfirm={handleModalConfirm}
        hasCancel={false}
        title="비밀번호 변경 성공"
        description={`비밀번호가 변경되었습니다\n로그인을 다시 해주세요`}
        confirmText="확인"
      />

      {/* 프로필 이미지 관리 바텀시트 */}
      <BottomSheetModal
        isOpen={isBottomSheetOpen}
        onClose={() => setIsBottomSheetOpen(false)}
        menuItems={bottomSheetMenuItems}
      />
    </div>
  );
}
