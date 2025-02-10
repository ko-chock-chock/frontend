// src/components/Bookmark/TabGroup/index.tsx

import { TabGroupProps, TABS, TabType } from "./types";
import { useCallback } from "react";

/**
 * 마이페이지 탭 그룹 컴포넌트
 *
 * 주요 기능:
 * 1. 게시글 상태별 탭 UI 제공
 *   - 게시중/게시완료/내 커뮤니티/받은 후기 탭
 *   - 각 탭별 게시글 수 표시
 *
 * 2. 탭 상태 관리
 *   - 활성/비활성 상태에 따른 스타일 적용
 *   - 클릭 이벤트 핸들링
 *
 * 3. 게시글 수 표시
 *   - 각 탭별 게시글 수를 상단에 표시
 *   - 활성/비활성 상태에 따른 텍스트 스타일 적용
 *
 * UI/UX 고려사항:
 * 1. 탭 레이아웃
 *   - 균일한 너비 분배
 *   - 간격 및 정렬 최적화
 *
 * 2. 시각적 피드백
 *   - 활성 탭 강조
 *   - 부드러운 상태 전환
 *
 * 3. 접근성
 *   - 클릭 가능한 영역 최적화
 *   - 상태 변화 시각적 표시
 *
 * 스타일링:
 * - Tailwind 클래스 사용
 * - Button 컴포넌트 design5 스타일 활용
 * - globals.css 텍스트 스타일 적용
 *
 * 수정사항 (2024.02.04):
 * 1. Button design5 스타일 적용 개선
 * 2. active prop을 통한 탭 상태 관리 추가
 * 3. 게시글 수 표시 방식 최적화
 * 4. 레이아웃 및 간격 조정
 */
export default function TabGroup({
  currentTab,
  onTabChange,
  postCounts,
}: TabGroupProps) {
    /**
   * 탭 선택 핸들러
   * 탭 클릭시 상태 변경 및 콜백 실행
   */
    const handleTabClick = useCallback((tab: TabType) => {
      if (currentTab !== tab) {
        onTabChange(tab);
      }
    }, [currentTab, onTabChange]);

    return (
      <div className=" bg-background">
        {/* 탭 컨테이너 */}
        <div className="flex w-full border-b border-list-line shadow-[0px_10px_20px_0px_rgba(0,0,0,0.05)]">
          {TABS.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => handleTabClick(value)}
              className={`
                relative flex-1 px-4 py-3
                text-base-medium transition-colors
                ${currentTab === value
                  ? "text-primary" // 활성 탭 스타일
                  : "text-text-tertiary" // 비활성 탭 스타일
                }
              `}
            >
              {/* 탭 레이블과 게시글 수 */}
              <span className="flex items-center justify-center gap-1">
                {label}
                <span className={`
                  ml-1 text-sm
                  ${currentTab === value 
                    ? "text-primary"
                    : "text-text-quaternary"
                  }
                `}>
                  {postCounts[value]}
                </span>
              </span>
  
              {/* 활성 탭 인디케이터 */}
              {currentTab === value && (
                <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-primary" />
              )}
            </button>
          ))}
        </div>
      </div>
    );
  }

/**
 * 사용 예시:
 *
 * const [currentTab, setCurrentTab] = useState<TabType>("게시중");
 * const postCounts = {
 *   "게시중": 5,
 *   "게시완료": 3,
 *   "내 커뮤니티": 8,
 *   "받은 후기": 2
 * };
 *
 * <TabGroup
 *   currentTab={currentTab}
 *   onTabChange={setCurrentTab}
 *   postCounts={postCounts}
 * />
 */
