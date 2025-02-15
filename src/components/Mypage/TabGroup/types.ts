// src/components/Mypage/TabGroup/types.ts

/**
 * 탭 타입 정의
 * 마이페이지에서 사용되는 게시글 상태 분류
 */
export type TabType = "게시중" | "게시완료" | "내 커뮤니티" | "받은 후기";

/**
 * 게시글 수를 저장하는 Record 타입
 * 각 탭별 게시글 수를 number 타입으로 저장
 */
export type PostCountsType = Record<TabType, number>;

/**
 * TabGroup Props 인터페이스
 * @property {TabType} currentTab - 현재 선택된 탭
 * @property {function} onTabChange - 탭 변경 핸들러 함수
 * @property {PostCountsType} postCounts - 각 탭별 게시글 수
 */
export interface TabGroupProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
  postCounts: PostCountsType;  // posts 대신 postCounts를 사용
}

/**
 * 탭 설정 상수
 * 각 탭의 레이블과 값 정의
 */
export const TABS: { label: string; value: TabType }[] = [
  { label: "게시중", value: "게시중" },
  { label: "게시완료", value: "게시완료" },
  { label: "내 커뮤니티", value: "내 커뮤니티" },
  { label: "받은 후기", value: "받은 후기" }
];