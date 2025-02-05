// src/components/MyPageEdit/index.tsx
"use client";

/**
 * 프로필 수정 컴포넌트
 * 
 * 주요 기능:
 * 1. 프로필 이미지 변경 (기본 이미지 폴백 처리 포함)
 * 2. 닉네임 수정
 * 3. 비밀번호 변경 (아코디언)
 * 4. 계정 관리 (로그아웃/회원탈퇴)
 * 
 * 디자인 스펙:
 * - 텍스트: global.css의 layer components 클래스 사용
 *   - 라벨: text-sm-bold (14px Bold)
 *   - 입력 텍스트: text-base-medium (16px Medium)
 *   - 유효성 안내: text-sm-medium-quaternary (14px Medium)
 * - 아이콘:
 *   - 비밀번호 변경: editAccount_collapse_24px.svg
 *   - 취소: editAccount_expand_24px.svg
 *   - 유효성 체크: signup_check_(disabled/valid)_icon_24px.svg
 * 
 * 수정사항 (2024.02.04):
 * 1. 이미지 에러 핸들링 개선
 *    - 기본 이미지 경로 상수화
 *    - 무한 재귀 방지 로직 추가
 * 2. 텍스트 스타일 최적화
 * 3. 아코디언 동작 개선
 */

import { useEffect, useRef } from "react";
import Image from "next/image";
import Button from "@/commons/Button";
import Input from "@/commons/input";
import Modal from "@/commons/Modal";
import { useProfileEdit } from "./hook";

// 아이콘 imports
import CheckIcon from "@/../public/icons/signup_check_disabled_icon_24px.svg";
import CheckValidIcon from "@/../public/icons/signup_check_valid_icon_24px.svg";
import CollapseIcon from "@/../public/icons/editAccount_collapse_24px.svg";
import ExpandIcon from "@/../public/icons/editAccount_expand_24px.svg";

// 상수 정의
const DEFAULT_PROFILE_IMAGE = "/images/profileEdit_Img_upload_btn_img.svg";

export default function ProfileEdit() {
  const {
    user,
    isLoading,
    isPasswordFormVisible,
    modalType,
    nickname,
    currentPassword,
    newPassword,
    setModalType,
    setNickname,
    setCurrentPassword,
    setNewPassword,
    setIsPasswordFormVisible,
    validatePassword,
    handleNicknameUpdate,
    handlePasswordUpdate,
    handleLogout,
    handleWithdraw
  } = useProfileEdit();

  // 비밀번호 유효성 검사 결과
  const passwordValidation = validatePassword(newPassword);

  // 비밀번호 섹션 ref (스크롤 처리용)
  const passwordSectionRef = useRef<HTMLDivElement>(null);

  // 이미지 에러 핸들러
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    
    // 이미 기본 이미지인 경우 추가 처리하지 않음
    if (target.src.includes(DEFAULT_PROFILE_IMAGE)) {
      return;
    }

    target.src = DEFAULT_PROFILE_IMAGE;
    
    if (process.env.NODE_ENV === 'development') {
      console.warn('프로필 이미지 로드 실패 - 기본 이미지로 대체됨');
    }
  };

  // 비밀번호 섹션 열릴 때 스크롤 처리
  useEffect(() => {
    if (isPasswordFormVisible && passwordSectionRef.current) {
      passwordSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isPasswordFormVisible]);

  return (
    <div className="min-h-screen flex flex-col">
      <main className="w-full px-5 pt-12 pb-24 flex flex-col space-y-7">
        {/* 프로필 정보 수정 섹션 */}
        <section className="space-y-7">
          {/* 프로필 이미지 영역 */}
          <div className="grid gap-[1.375rem]">
            <h2 className="text-sm-bold">
              프로필 정보 수정
            </h2>
            <div className="flex justify-center">
              <button>
                <Image
                  src={user?.profileImage || DEFAULT_PROFILE_IMAGE}
                  width={100}
                  height={100}
                  alt="프로필 이미지"
                  priority
                  onError={handleImageError}
                  
                />
              </button>
            </div>
          </div>

          {/* 닉네임 변경 영역 */}
          <div className="space-y-1">
            <label htmlFor="nickname" className="text-sm-bold">
              닉네임
            </label>
            <div className="flex items-center gap-5">
              <Input
                id="nickname"
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="닉네임을 입력해주세요"
                className="flex-1 text-base-medium"
              />
              <Button
                design="design1"
                className=" px-5"
                onClick={handleNicknameUpdate}
                disabled={isLoading}
              >
                변경
              </Button>
            </div>
          </div>

          {/* 구분선 */}
          <div className="h-7 border-b border-[#E9E8E3]" />

          {/* 비밀번호 변경 토글 버튼 */}
          <Button
            design="design2"
            onClick={() => setIsPasswordFormVisible(!isPasswordFormVisible)}
            className="w-full h-12 flex items-center justify-center gap-2"
          >
            <Image
              src={CollapseIcon}
              alt=""
              width={24}
              height={24}
            />
            <span>비밀번호 변경</span>
          </Button>
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
                <div className="flex items-center gap-2">
                  <Image
                    src={passwordValidation.hasMultipleTypes ? CheckValidIcon : CheckIcon}
                    alt=""
                    width={24}
                    height={24}
                  />
                  <p className={`text-sm-medium-quaternary ${
                    passwordValidation.hasMultipleTypes ? "!text-primary" : ""
                  }`}>
                    영문/숫자/특수문자 중, 2가지 이상 포함
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Image
                    src={passwordValidation.hasValidLength ? CheckValidIcon : CheckIcon}
                    alt=""
                    width={24}
                    height={24}
                  />
                  <p className={`text-sm-medium-quaternary ${
                    passwordValidation.hasValidLength ? "!text-primary" : ""
                  }`}>
                    8자 이상 32자 이하 입력 (공백 제외)
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Image
                    src={passwordValidation.noConsecutive ? CheckValidIcon : CheckIcon}
                    alt=""
                    width={24}
                    height={24}
                  />
                  <p className={`text-sm-medium-quaternary ${
                    passwordValidation.noConsecutive ? "!text-primary" : ""
                  }`}>
                    연속 3자 이상 동일한 문자/숫자 제외
                  </p>
                </div>
              </div>

              {/* 비밀번호 변경 버튼 영역 */}
              <div className="flex space-between h-12 gap-5 ">
                <Button
                  design="design2"
                  onClick={() => setIsPasswordFormVisible(false)}
                  className="h-full w-20 flex-shrink-0 "
                >
                  <Image
                    src={ExpandIcon}
                    alt=""
                    width={24}
                    height={24}
                  />
                  <span>취소</span>
                </Button>
                <Button
                  design="design1"
                  onClick={handlePasswordUpdate}
                  className="flex-grow"
                  disabled={isLoading}
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
          <Button
            design="design4"
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
    </div>
  );
}