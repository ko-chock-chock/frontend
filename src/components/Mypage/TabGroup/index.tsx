// src/components/Mypage/TabGroup/index.tsx

import { TabGroupProps, TABS } from "./types";
import Button from "@/commons/Button";

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
  return (
    <div className="w-full bg-background">
      {/* 탭 버튼 컨테이너 */}
      <div className="py-2.5 flex">
        <div className="w-full flex justify-between items-center gap-1">
          {TABS.map(({ label, value }) => {
            const isActive = currentTab === value;

            return (
              <Button
                key={value}
                design="design5" // 탭 버튼 디자인 (design5: 세그먼트 컨트롤 스타일)
                active={isActive} // 현재 선택된 탭 활성화 상태
                onClick={() => onTabChange(value)}
                className="transition-colors duration-200" // 상태 변경 시 부드러운 전환 효과
              >
                <div className="flex items-center justify-center gap-1">
                  {/* 탭 레이블 */}
                  <span>{label}</span>

                  {/* 게시글 수 표시
                   * - active 상태: 흰색 텍스트 (text-button-text-primary)
                   * - 비활성 상태: 어두운 회색 텍스트 (text-button-text-secondary)
                   */}
                  <span
                    className={`
                    text-sm
                    ${
                      isActive
                        ? "text-button-text-primary"
                        : "text-button-text-secondary"
                    }
                  `}
                  >
                    {postCounts[value]}
                  </span>
                </div>
              </Button>
            );
          })}
        </div>
      </div>

      {/* 그림자 효과가 있는 구분선
       * - 상단 고정 시 구분감 제공
       * - 부드러운 그림자로 층위감 표현
       */}
      <div className="h-5 bg-background shadow-[0_0.625rem_1.25rem_0_rgba(0,0,0,0.05)] border-b border-list-line" />
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
