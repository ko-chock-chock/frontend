// src/components/MyPageEdit/hook.ts
"use client";

/**
 * 프로필 수정 커스텀 훅
 *
 * 주요 기능:
 * 1. 프로필 이미지 업로드/수정
 * 2. 닉네임 변경
 * 3. 비밀번호 변경 및 유효성 검사
 * 4. 로그아웃/회원탈퇴 처리
 * 5. 폼 상태 관리
 *
 * 수정사항 (2024.02.05):
 * - 비밀번호 유효성 검사 로직 추가
 * - 폼 상태 관리 최적화
 * - 에러 처리 강화
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/commons/store/userStore";
import {
  TokenStorage,
  authenticatedFetch,
} from "@/components/auth/utils/tokenUtils";
import { API_ENDPOINTS, HTTP_METHODS, ERROR_MESSAGES } from "./types";

export const useProfileEdit = () => {
  const router = useRouter();
  const { user, updateUserInfo, clearUser } = useUserStore();

  // 로딩 상태
  const [isLoading, setIsLoading] = useState(false);
  // 비밀번호 변경 폼 표시 여부 (아코디언)
  const [isPasswordFormVisible, setIsPasswordFormVisible] = useState(false);
  // 모달 상태
  const [modalType, setModalType] = useState<"logout" | "withdraw" | null>(
    null
  );

  // 폼 데이터 상태 관리
  const [nickname, setNickname] = useState(user?.name || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);

  /**
   * 비밀번호 유효성 검사 함수
   * @param password 검사할 비밀번호 문자열
   * @returns 각 조건별 검사 결과 객체
   */
  const validatePassword = (password: string) => {
    // 각 문자 타입 존재 여부 확인
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    // 포함된 문자 타입 개수 계산
    const typeCount = [hasLetter, hasNumber, hasSpecial].filter(Boolean).length;
    const hasMultipleTypes = typeCount >= 2;

    return {
      // 영문/숫자/특수문자 중 2가지 이상 포함
      hasMultipleTypes,
      // 8자 이상 32자 이하 (공백 제외)
      hasValidLength:
        password.length >= 8 &&
        password.length <= 32 &&
        !password.includes(" "),
      // 연속된 3자 이상의 동일한 문자/숫자 제외
      noConsecutive: !/(.)\1{2,}/.test(password),
    };
  };

  /**
   * 프로필 이미지 업로드 처리
   * @param file 업로드할 이미지 파일
   */
  const handleImageUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await authenticatedFetch(API_ENDPOINTS.PROFILE_IMAGE, {
        method: HTTP_METHODS.PUT,
        body: formData,
      });

      if (!response.ok) {
        throw new Error(ERROR_MESSAGES.IMAGE_UPLOAD_FAILED);
      }

      // 성공 응답 처리
      await response.text(); // 'success' 응답 처리
      console.log("[ProfileEdit] 이미지 업로드 성공");
    } catch (error) {
      console.error("[ProfileEdit] 이미지 업로드 실패:", error);
      throw error;
    }
  };

  /**
   * 닉네임 변경 처리
   * - 현재 닉네임과 동일한 경우 처리
   * - API 요청 및 상태 업데이트
   */
  const handleNicknameUpdate = async () => {
    if (nickname === user?.name) {
      throw new Error("현재 닉네임과 동일합니다");
    }

    try {
      setIsLoading(true);
      const response = await authenticatedFetch(API_ENDPOINTS.NAME_UPDATE, {
        method: HTTP_METHODS.PUT,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: nickname }),
      });

      if (!response.ok) {
        throw new Error(ERROR_MESSAGES.PROFILE_UPDATE_FAILED);
      }

      // UserStore 업데이트
      updateUserInfo({ name: nickname });
      console.log("[ProfileEdit] 닉네임 변경 성공");

      //성공시 페이지 이동
      router.push("/mypage");
    } catch (error) {
      console.error("[ProfileEdit] 닉네임 변경 실패:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 비밀번호 변경 처리
   * - 유효성 검사 수행
   * - API 요청 및 상태 업데이트
   */
  const handlePasswordUpdate = async () => {
    // 비밀번호 유효성 검사
    const validation = validatePassword(newPassword);
    if (
      !validation.hasMultipleTypes ||
      !validation.hasValidLength ||
      !validation.noConsecutive
    ) {
      throw new Error("비밀번호 형식이 올바르지 않습니다");
    }

    try {
      setIsLoading(true);
      const response = await authenticatedFetch(API_ENDPOINTS.PASSWORD_UPDATE, {
        method: HTTP_METHODS.PUT,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || ERROR_MESSAGES.PASSWORD_MISMATCH);
      }

      // 비밀번호 변경 성공 후 폼 초기화
      setCurrentPassword("");
      setNewPassword("");
      setIsPasswordFormVisible(false);
      console.log("[ProfileEdit] 비밀번호 변경 성공");

     /**
   * 비밀번호 변경 성공 시
   * - 토큰 삭제
   * - 사용자 정보 초기화
   * - 로그인 페이지로 이동
   */
      TokenStorage.clearTokens();
      clearUser();
      //성공시 페이지 이동
      router.push("/login");
    } catch (error) {
      console.error("[ProfileEdit] 비밀번호 변경 실패:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 로그아웃 처리
   * - 토큰 삭제
   * - 사용자 정보 초기화
   * - 로그인 페이지로 이동
   */
  const handleLogout = () => {
    TokenStorage.clearTokens();
    clearUser();
    router.push("/login");
  };

  /**
   * 회원 탈퇴 처리
   * - API 요청
   * - 토큰 및 사용자 정보 초기화
   * - 로그인 페이지로 이동
   */
  const handleWithdraw = async () => {
    try {
      const response = await authenticatedFetch(API_ENDPOINTS.USER_DELETE, {
        method: HTTP_METHODS.DELETE,
      });

      if (!response.ok) {
        throw new Error("회원 탈퇴에 실패했습니다");
      }

      TokenStorage.clearTokens();
      clearUser();
      router.push("/login");
    } catch (error) {
      console.error("[ProfileEdit] 회원 탈퇴 실패:", error);
      throw error;
    }
  };

  return {
    // 상태
    user,
    isLoading,
    isPasswordFormVisible,
    modalType,
    nickname,
    currentPassword,
    newPassword,
    profileImage,

    // 상태 변경 함수
    setModalType,
    setNickname,
    setCurrentPassword,
    setNewPassword,
    setProfileImage,
    setIsPasswordFormVisible,

    // 유효성 검사
    validatePassword,

    // 이벤트 핸들러
    handleImageUpload,
    handleNicknameUpdate,
    handlePasswordUpdate,
    handleLogout,
    handleWithdraw,
  };
};
