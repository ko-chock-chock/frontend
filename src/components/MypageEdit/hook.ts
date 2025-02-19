// src/components/MyPageEdit/hook.ts
"use client";

/**
 * 프로필 수정 커스텀 훅
 *
 * ✨ 주요 기능:
 * 1. 프로필 이미지 업로드/수정/삭제
 * 2. 닉네임 변경 및 유효성 검사
 * 3. 비밀번호 변경 및 유효성 검사
 * 4. 로그아웃/회원탈퇴 처리
 * 5. 폼 상태 및 UI 상태 관리
 *
 * 🔄 수정사항 (2024.02.14):
 * 1. 이미지 상태 관리 최적화
 *   - tempImageUrl 상태 추가 (미리보기용)
 *   - 실제 이미지 업로드와 미리보기 분리
 *
 * 2. 의존성 배열 최적화
 *   - useCallback 의존성 올바르게 설정
 *   - 메모이제이션 성능 개선
 *
 * 3. 비밀번호 유효성 검사 기준 변경
 * 4. 초기 상태에서 불필요한 유효성 체크 표시 제거
 * 5. 이미지/닉네임 변경 상태에 따른 버튼 텍스트 동적 변경
 * 6. 비밀번호 변경 성공 시 모달 처리 추가
 *
 * 💡 프로필 이미지 관련:
 * - 기본 이미지: /images/profileEdit_Img_upload_btn_img.svg
 * - 카메라 아이콘: /images/profileEdit_camera.svg
 * - 이미지 업로드 API: POST /api/uploads/single
 * - 이미지 수정 API: PUT /api/users/profile-image
 * - 이미지 삭제 API: DELETE /api/users/profile-image
 */

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/commons/store/userStore";
import { TokenStorage } from "@/components/auth/utils/tokenUtils";

export const useProfileEdit = () => {
  const router = useRouter();
  const { user, updateUserInfo, clearUser } = useUserStore();

  // 상태 관리
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordFormVisible, setIsPasswordFormVisible] = useState(false);
  const [modalType, setModalType] = useState<"logout" | "withdraw" | null>(
    null
  );
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // 폼 데이터 상태
  const [nickname, setNickname] = useState(user?.name || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // 🔄 이미지 관련 상태 개선
  const [tempImageUrl, setTempImageUrl] = useState<string | null>(null); // 미리보기용
  const [isImageChanged, setIsImageChanged] = useState(false);
  const [isNicknameChanged, setIsNicknameChanged] = useState(false);

  /**
   * 비밀번호 유효성 검사 함수
   * 🔄 수정: 빈 비밀번호 입력시 모든 검증 false 반환
   */
  const validatePassword = useCallback((password: string) => {
    if (!password) {
      return {
        hasMultipleTypes: false,
        hasValidLength: false,
        noConsecutive: false,
      };
    }

    // 각 문자 타입 존재 여부 확인
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    // 포함된 문자 타입 개수 계산
    const typeCount = [hasLetter, hasNumber, hasSpecial].filter(Boolean).length;

    return {
      hasMultipleTypes: typeCount >= 2,
      hasValidLength:
        password.length >= 7 &&
        password.length <= 32 &&
        !password.includes(" "),
      noConsecutive: !/(.)\1{2,}/.test(password),
    };
  }, []);

  /**
   * 프로필 이미지 업로드 처리
   * @param file 업로드할 이미지 파일
   */
  const handleImageUpload = useCallback(async (file: File) => {
    try {
      // 파일 유효성 검사 (기존 코드 유지)
      if (file.size > 5 * 1024 * 1024) {
        alert("파일 크기는 5MB를 초과할 수 없습니다.");
        return;
      }

      if (!file.type.startsWith("image/")) {
        alert("이미지 파일만 업로드 가능합니다.");
        return;
      }

      setIsLoading(true);
      const formData = new FormData();
      formData.append("file", file);

      // 이미지 업로드 API 호출
      const response = await fetch("/api/uploads/single", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("[Upload] Error:", errorText);
        throw new Error("이미지 업로드에 실패했습니다");
      }

      const imageUrl = await response.text();
      console.log("[Upload] Success - Image URL:", imageUrl);

      // 🔑 중요: 토큰 확인 및 프로필 이미지 변경 API 호출
      const token = TokenStorage.getAccessToken();
      if (!token) {
        throw new Error("인증 토큰이 없습니다.");
      }

      // 🚨 추가: 디버깅용 토큰 로깅 (배포 시 제거)
      console.log("[Debug] Authorization Token:", token);

      const profileUpdateResponse = await fetch("/api/users/profile-image", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`, // 🔑 명시적 토큰 헤더 추가
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ profileImage: imageUrl }),
      });

      console.log(
        "[Upload] Profile update status:",
        profileUpdateResponse.status
      );

      if (!profileUpdateResponse.ok) {
        const errorData = await profileUpdateResponse.json();
        console.error("[Upload] Profile update error:", errorData);
        throw new Error(errorData.message || "프로필 이미지 업데이트 실패");
      }

      // 상태 업데이트
      setTempImageUrl(imageUrl);
      setIsImageChanged(true);

      return imageUrl;
    } catch (error) {
      console.error("[ProfileEdit] 이미지 업로드 실패:", error);
      alert(
        error instanceof Error
          ? error.message
          : "이미지 업로드에 실패했습니다. 다시 시도해주세요."
      );
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * 변경사항 저장 처리
   * 이미지 URL이 있을 경우 프로필 업데이트 진행
   */
  const saveChanges = useCallback(async () => {
    try {
      // 1. 이미지 업데이트
      if (isImageChanged && tempImageUrl) {
        const token = TokenStorage.getAccessToken();
        if (!token) {
          throw new Error("인증 토큰이 없습니다.");
        }

        const response = await fetch("/api/users/profile-image", {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`, // 🔑 토큰 헤더 추가
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ profileImage: tempImageUrl }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("[Profile Image Update] Error:", errorData);
          throw new Error(errorData.message || "프로필 이미지 업데이트 실패");
        }

        // Store 업데이트
        updateUserInfo({ profileImage: tempImageUrl });
      }

      // 2. 닉네임 업데이트
      if (isNicknameChanged && nickname !== user?.name) {
        const token = TokenStorage.getAccessToken();
        if (!token) {
          throw new Error("인증 토큰이 없습니다.");
        }

        const response = await fetch("/api/users/name", {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`, // 🔑 토큰 헤더 추가
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: nickname }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("[Nickname Update] Error:", errorData);
          throw new Error(errorData.message || "닉네임 변경에 실패했습니다");
        }

        // Store 업데이트
        updateUserInfo({ name: nickname });
      }

      // 성공 시 마이페이지로 이동
      router.push("/mypage");
    } catch (error) {
      console.error("[SaveChanges] Error:", error);
      alert(
        error instanceof Error ? error.message : "변경사항 저장에 실패했습니다."
      );
    }
  }, [
    isImageChanged,
    tempImageUrl,
    isNicknameChanged,
    nickname,
    user?.name,
    router,
    updateUserInfo,
  ]);

  /**
   * 프로필 이미지 삭제 처리
   */
  const handleImageDelete = useCallback(async () => {
    try {
      const token = TokenStorage.getAccessToken();
      if (!token) {
        throw new Error("인증 토큰이 없습니다.");
      }

      setIsLoading(true);
      const response = await fetch("/api/users/profile-image", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("[Profile Image Delete] Error:", errorData);
        throw new Error(
          errorData.message || "프로필 이미지 삭제에 실패했습니다"
        );
      }

      // 🔄 상태 업데이트
      updateUserInfo({ profileImage: undefined });
      setTempImageUrl(null);
      setIsImageChanged(false);

      // BottomSheet 닫기 로직 제거
      // setIsBottomSheetOpen(false) 제거
    } catch (error) {
      console.error("[ProfileEdit] 이미지 삭제 실패:", error);
      alert(
        error instanceof Error
          ? error.message
          : "이미지 삭제에 실패했습니다. 다시 시도해주세요."
      );
    } finally {
      setIsLoading(false);
    }
  }, [updateUserInfo]); // 불필요한 의존성 제거

  /**
   * 비밀번호 변경 처리
   * 🔄 수정: 성공 시 모달 표시 추가
   */
  const handlePasswordUpdate = useCallback(async () => {
    try {
      setIsLoading(true);
  
      // TokenStorage에서 토큰 가져오기
      const token = TokenStorage.getAccessToken();
      if (!token) {
        throw new Error("인증 토큰이 없습니다.");
      }
  
      const response = await fetch("/api/users/password", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`, // 토큰을 Authorization 헤더에 추가
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "비밀번호 변경에 실패했습니다");
      }

      // 성공 모달 표시
      setShowSuccessModal(true);

      // 폼 초기화
      setCurrentPassword("");
      setNewPassword("");
      setIsPasswordFormVisible(false);
    } catch (error) {
      console.error("[ProfileEdit] 비밀번호 변경 실패:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [currentPassword, newPassword]);

  /**
   * 모달 확인 버튼 핸들러
   * 비밀번호 변경 성공 시 로그아웃 처리
   */
  const handleModalConfirm = useCallback(() => {
    setShowSuccessModal(false);
    TokenStorage.clearTokens();
    clearUser();
    router.push("/login");
  }, [clearUser, router]);

  /**
   * 회원 탈퇴 처리
   */
  const handleWithdraw = useCallback(async () => {
    try {
      // TokenStorage에서 토큰 가져오기
      const token = TokenStorage.getAccessToken();
      if (!token) {
        throw new Error("인증 토큰이 없습니다.");
      }
  
      const response = await fetch("/api/users", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`, // 토큰을 Authorization 헤더에 추가
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "회원 탈퇴에 실패했습니다");
      }
  
      TokenStorage.clearTokens();
      clearUser();
      router.push("/login");
    } catch (error) {
      console.error("[ProfileEdit] 회원 탈퇴 실패:", error);
      alert(error instanceof Error ? error.message : "회원 탈퇴에 실패했습니다");
    }
  }, [clearUser, router]);
  /**
   * 로그아웃 처리
   */
  const handleLogout = useCallback(() => {
    TokenStorage.clearTokens();
    clearUser();
    router.push("/login");
  }, [clearUser, router]);

  /**
   * 이미지 변경 핸들러
   */
  const handleImageChange = useCallback(
    (file: File | null) => {
      if (!file) return;

      handleImageUpload(file).catch((error) => {
        alert("이미지 업로드에 실패했습니다. 다시 시도해주세요.");
        console.error("[ImageChange] Error:", error);
      });
    },
    [handleImageUpload]
  );

  /**
   * 닉네임 변경 핸들러
   */
  const handleNicknameChange = useCallback(
    (value: string) => {
      setNickname(value);
      setIsNicknameChanged(value !== user?.name);
    },
    [user?.name]
  );

  /**
   * 버튼 텍스트 결정 함수
   * 🆕 추가: 이미지/닉네임 변경 상태에 따른 동적 텍스트
   */
  const getButtonText = useCallback(() => {
    if (isImageChanged && isNicknameChanged) return "변경사항 저장";
    if (isImageChanged) return "프로필 사진 변경";
    if (isNicknameChanged) return "닉네임 변경";
    return "변경";
  }, [isImageChanged, isNicknameChanged]);

  return {
    // 상태
    user,
    isLoading,
    isPasswordFormVisible,
    modalType,
    showSuccessModal,
    nickname,
    currentPassword,
    newPassword,
    tempImageUrl,
    isImageChanged,
    isNicknameChanged,

    // 상태 변경 함수
    setModalType,
    setNickname: handleNicknameChange,
    setCurrentPassword,
    setNewPassword,
    setIsPasswordFormVisible,
    setShowSuccessModal,

    // 유효성 검사
    validatePassword,

    // 이벤트 핸들러
    handleImageUpload,
    handleImageDelete,
    saveChanges,
    handlePasswordUpdate,
    handleLogout,
    handleWithdraw,
    handleModalConfirm,
    getButtonText,
    handleImageChange,
  };
};
