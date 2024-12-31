// src/app/mypage/components/TabGroup.tsx

import { TabType } from "@/types/mypage";
import { Post } from "@/types/post";


interface TabGroupProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
  posts: Post[];
}

export default function TabGroup({ currentTab, onTabChange, posts }: TabGroupProps) {
  return (
    <div className=" mx-2 bg-background">
      <div className="flex w-full border-b border-list-line shadow-[0px_10px_20px_0px_rgba(0,0,0,0.05)]">
        {[ "구인중", "구인완료"].map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab as TabType)}
            className={`w-1/2 px-4 py-2 text-base-medium ${
              currentTab === tab
                ? "text-primary border-b-[3px] border-primary"
                : "text-text-tertiary"
            }`}
          >
            {tab}
            {tab !== "전체" && (
              <span className="ml-1 text-text-quaternary">
                {posts.filter((post) => post.isMyPost && post.status === tab).length}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}