// src/components/SignUp/hook.ts
"use client";

/**
 * 회원가입 커스텀 훅
 *
 * ✨ 주요 기능:
 * 1. API 통신 및 데이터 관리
 *   - API 응답 안전성 강화
 *   - 중복 검사 및 유효성 검증
 * 
 * 2. 폼 상태 관리
 *   - Zod 스키마 기반 통합 유효성 검사
 *   - 실시간 피드백 제공
 * 
 * 3. 성능 최적화
 *   - 디바운스 처리
 *   - 불필요한 API 호출 방지
 * 
 * 🔄 수정사항 (2024.02.11):
 * - Zod 스키마에서 모든 비밀번호 검증 통합
 * - useEffect 검증 로직 제거
 * - 실시간 피드백 개선
 * 
 * 🔥 버그 수정 (2024.02.11):
 * - 이메일/닉네임 중복 검사 응답 처리 로직 수정
 * - isFormValid 계산 로직 개선
 * - 에러 메시지 중복 표시 방지
 * 
 * 🎯 타입 시스템 개선 (2024.02.13):
 * - API 관련 타입 추가 및 활용
 * - 유효성 검사 결과 타입 적용
 * - 에러 처리 타입 강화
 */

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  SignUpFormData, 
  FeedbackMessage,
  // 🎯 필요한 타입들 추가 import
  SignUpRequestData,
  SignUpResponse,
  SignUpErrorResponse,
  PasswordValidation,
  ERROR_MESSAGES
} from "./types";

// ✨ API 기본 설정
const API_BASE_URL = 'http://3.36.40.240:8001';

/**
 * ✨ 회원가입 폼 유효성 검사 스키마
 */
const signupSchema = z
  .object({
    email: z
      .string()
      .min(1, "이메일을 입력해주세요")
      .email("올바른 이메일 형식이 아닙니다"),
    name: z
      .string()
      .min(1, "닉네임을 입력해주세요")
      .max(20, "닉네임은 20자 이하여야 합니다"),
    password: z
      .string()
      .min(1, "비밀번호를 입력해주세요")
      .min(7, "비밀번호는 7자 이상이어야 합니다")
      .max(32, "비밀번호는 32자 이하여야 합니다")
      .refine(
        (password) => {
          if (!password) return false;
          const hasLetter = /[a-zA-Z]/.test(password);
          const hasNumber = /[0-9]/.test(password);
          const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
          const typeCount = [hasLetter, hasNumber, hasSpecial].filter(Boolean).length;
          return typeCount >= 2;
        },
        { message: "영문/숫자/특수문자 중 2가지 이상을 포함해야 합니다" }
      )
      .refine(
        (password) => {
          if (!password) return false;
          return !/(.)\1{2,}/.test(password);
        },
        { message: "연속된 3자 이상의 동일한 문자/숫자는 사용할 수 없습니다" }
      ),
    passwordConfirm: z.string().min(1, "비밀번호 확인을 입력해주세요"),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "비밀번호가 일치하지 않습니다",
    path: ["passwordConfirm"],
  });

/**
 * ✨ API 응답 검증 함수
 * 🎯 타입 안전성 강화를 위해 SignUpResponse, SignUpErrorResponse 타입 활용
 */
const validateApiResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const errorText = await response.text();
    let errorData: SignUpErrorResponse;
    try {
      errorData = JSON.parse(errorText);
    } catch {
      errorData = { 
        message: ERROR_MESSAGES[response.status as keyof typeof ERROR_MESSAGES] || ERROR_MESSAGES.DEFAULT,
        data: null 
      };
    }
    throw new Error(errorData.message);
  }

  const text = await response.text();
  try {
    return JSON.parse(text) as T;
  } catch {
    return text as T;
  }
};

/**
 * ✨ 디바운스 함수
 */
const createDebounce = <T extends unknown[], R>(
  func: (...args: T) => Promise<R>,
  delay: number
) => {
  let timeoutId: NodeJS.Timeout;

  return (...args: T): Promise<R> => {
    return new Promise((resolve) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(async () => {
        const result = await func(...args);
        resolve(result);
      }, delay);
    });
  };
};

export const useSignUp = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [emailMessage, setEmailMessage] = useState<FeedbackMessage | null>(null);
  const [nameMessage, setNameMessage] = useState<FeedbackMessage | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [passwordConfirmMessage, setPasswordConfirmMessage] = useState<FeedbackMessage | null>(null);

  // 🎯 비밀번호 유효성 검사 결과 타입 적용
  const [passwordValidation, setPasswordValidation] = useState<PasswordValidation>({
    hasMultipleTypes: false,
    hasValidLength: false,
    noConsecutive: false
  });
  
  // ✨ 유효성 검사 상태
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isNameValid, setIsNameValid] = useState(false);

  /**
   * ✨ 폼 초기화 및 설정
   */
  const {
    control,
    handleSubmit,
    watch,
    setError,
    formState: { errors }
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signupSchema),
    mode: "onChange"
  });

  const password = watch("password");
  const passwordConfirm = watch("passwordConfirm");

  /**
   * ✨ 이메일 중복 검사
   */
  const checkEmailDuplicate = useCallback(async (email: string) => {
    try {
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.(com|net|co\.kr|org)$/;
      if (!emailRegex.test(email)) {
        setEmailMessage({
          message: "올바른 이메일 형식이 아닙니다",
          type: 'error'
        });
        setIsEmailValid(false);
        return false;
      }

      const response = await fetch(
        `${API_BASE_URL}/api/users/check-email?email=${encodeURIComponent(email)}`
      );

      const isDuplicate = await validateApiResponse<boolean>(response);
      const isValid = !isDuplicate;
      
      setIsEmailValid(isValid);
      setEmailMessage({
        message: isValid ? "사용 가능한 이메일입니다" : "이미 사용중인 이메일입니다",
        type: isValid ? 'success' : 'error'
      });
      
      return isValid;
    } catch (error) {
      console.error("[SignUp] 이메일 중복 검사 실패:", error);
      setEmailMessage({
        message: "이메일 중복 검사에 실패했습니다",
        type: 'error'
      });
      setIsEmailValid(false);
      return false;
    }
  }, []);

  /**
   * ✨ 닉네임 중복 검사
   */
  const checkNameDuplicate = useCallback(async (name: string) => {
    try {
      if (name.length < 2) {
        setNameMessage({
          message: "닉네임은 2자 이상이어야 합니다",
          type: 'error'
        });
        setIsNameValid(false);
        return false;
      }

      const response = await fetch(
        `${API_BASE_URL}/api/users/check-name?name=${encodeURIComponent(name)}`
      );

      const isDuplicate = await validateApiResponse<boolean>(response);
      const isValid = !isDuplicate;
      
      setIsNameValid(isValid);
      setNameMessage({
        message: isValid ? "사용 가능한 닉네임입니다" : "이미 사용중인 닉네임입니다",
        type: isValid ? 'success' : 'error'
      });
      
      return isValid;
    } catch (error) {
      console.error("[SignUp] 닉네임 중복 검사 실패:", error);
      setNameMessage({
        message: "닉네임 중복 검사에 실패했습니다",
        type: 'error'
      });
      setIsNameValid(false);
      return false;
    }
  }, []);

  /**
   * ✨ 비밀번호 일치 여부 검사
   */
  const checkPasswordMatch = useCallback((password: string, confirmValue: string) => {
    if (!confirmValue) {
      setPasswordConfirmMessage({
        message: "비밀번호 확인을 입력해주세요",
        type: 'error'
      });
      return;
    }

    if (!password) {
      setPasswordConfirmMessage({
        message: "비밀번호를 먼저 입력해주세요",
        type: 'error'
      });
      return;
    }

    const isMatching = password === confirmValue;
    setPasswordConfirmMessage({
      message: isMatching ? "비밀번호가 일치합니다" : "비밀번호가 일치하지 않습니다",
      type: isMatching ? 'success' : 'error'
    });
  }, []);

  // ✨ 디바운스된 검사 함수들
  const debouncedEmailCheck = useMemo(
    () => createDebounce(checkEmailDuplicate, 500),
    [checkEmailDuplicate]
  );
  
  const debouncedNameCheck = useMemo(
    () => createDebounce(checkNameDuplicate, 500),
    [checkNameDuplicate]
  );

  /**
   * ✨ 비밀번호 확인 일치 여부 체크
   */
  useEffect(() => {
    if (passwordConfirm) {
      checkPasswordMatch(password || "", passwordConfirm);
    }
  }, [password, passwordConfirm, checkPasswordMatch]);

  /**
   * ✨ 폼 제출 처리
   * 🎯 SignUpRequestData 타입 활용
   */
  const onSubmit = async (formData: SignUpFormData) => {
    setIsLoading(true);
    try {
      const requestData: SignUpRequestData = {
        email: formData.email,
        name: formData.name,
        password: formData.password,
        confirmPassword: formData.passwordConfirm
      };

      const response = await fetch(`${API_BASE_URL}/api/users/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      // 🎯 API 응답 타입 활용
      const result = await validateApiResponse<SignUpResponse>(response);
      if (result === 'success') {
        setShowSuccessModal(true);
      }

    } catch (error) {
      console.error("[SignUp] 에러 발생:", error);
      setError("root", {
        message: error instanceof Error ? error.message : ERROR_MESSAGES.DEFAULT
      });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * ✨ 입력 필드 이벤트 핸들러
   */
  const handleEmailChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const email = event.target.value;
    if (email) {
      await debouncedEmailCheck(email);
    } else {
      setEmailMessage(null);
      setIsEmailValid(false);
    }
  };

  const handleNameChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.value;
    if (name) {
      await debouncedNameCheck(name);
    } else {
      setNameMessage(null);
      setIsNameValid(false);
    }
  };

  /**
   * ✨ 모달 확인 버튼 핸들러
   */
  const handleModalConfirm = () => {
    setShowSuccessModal(false);
    router.push("/login");
  };

  /**
   * ✨ 버튼 활성화 상태 계산
   * 🎯 PasswordValidation 타입 활용
   */
  const isFormValid = useMemo(() => {
    const passwordRequirements = password 
      ? [
          /[a-zA-Z]/.test(password),  // 영문 포함
          /[0-9]/.test(password),     // 숫자 포함
          /[!@#$%^&*(),.?":{}|<>]/.test(password)  // 특수문자 포함
        ].filter(Boolean).length >= 2  // 2가지 이상 충족
      : false;

    const passwordValidation: PasswordValidation = {
      hasMultipleTypes: passwordRequirements,
      hasValidLength: password ? password.length >= 7 && password.length <= 32 : false,
      noConsecutive: password ? !/(.)\1{2,}/.test(password) : false
    };

    // 비밀번호 유효성 검사 결과 업데이트
    setPasswordValidation(passwordValidation);

    return (
      isEmailValid &&
      isNameValid &&
      password &&
      passwordConfirm &&
      password === passwordConfirm &&
      Object.values(passwordValidation).every(Boolean)
    );
  }, [isEmailValid, isNameValid, password, passwordConfirm]);

  return {
    form: {
      control,
      formState: { errors, isValid: isFormValid },
      handleSubmit,
      watch,
      setError
    },
    isLoading,
    onSubmit: handleSubmit(onSubmit),
    emailMessage,
    nameMessage,
    handleEmailChange,
    handleNameChange,
    showSuccessModal,
    handleModalConfirm,
    passwordConfirmMessage,
    checkPasswordMatch,
    // 🎯 비밀번호 유효성 검사 결과 반환 추가
    passwordValidation
  };
};