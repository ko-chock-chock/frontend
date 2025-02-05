// src/components/Mypage/ProfileCard/types.ts

/**
 * 프로필 카드 관련 타입 정의
 */

/**
 * 프로필 카드 컴포넌트 Props
 * @property {function} onEditClick - 프로필 수정 버튼 클릭 핸들러
 * @property {boolean} isLoading - 로딩 상태 표시 (optional)
 */
export interface ProfileCardProps {
  onEditClick: () => void;
  isLoading?: boolean;
}

/**
 * 프로필 관련 상수
 */
export const PROFILE_CONSTANTS = {
  DEFAULT_IMAGE: '/images/mypage_profile_img_48px.svg',
  IMAGE_SIZE: 48,
  LOADING_TEXT: "로딩 중..."
} as const;