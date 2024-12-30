// src/app/mypage/components/PostCard.tsx

import Image from "next/image";
import Button from "@/commons/Button";
import { Post } from "@/types/post";
import { useState } from "react";
import BottomSheetModal from "@/commons/BottomSheetModal";
import { useJobStore } from "@/_store/jobStore";

// PostCard 컴포넌트에 전달되는 props 타입 정의
interface PostCardProps {
  post: Post; // 게시글 정보
  onPostClick: (id: number) => void; // 게시글 클릭 시 실행될 함수
  onChatClick: (id: number) => void; // 채팅 버튼 클릭 시 실행될 함수
  chatCount: number; // 해당 게시글의 채팅방 수
}

/**
 * 게시글 카드 컴포넌트
 * @param post - 게시글 정보
 * @param onPostClick - 게시글 클릭 핸들러
 * @param onChatClick - 채팅 버튼 클릭 핸들러
 * @param chatCount - 채팅방 수
 */
const PostCard = ({
  post,
  onPostClick,
  onChatClick,
  chatCount,
}: PostCardProps) => {
  // 바텀 시트 모달의 열림/닫힘 상태를 관리하는 state
  // * 더보기(...) 아이콘 클릭 시 실행되는 핸들러
  const [isModalOpen, setIsModalOpen] = useState(false);
  // store에서 필요한 액션들을 가져옵니다
  const { updatePostStatus, deletePost } = useJobStore();

  /**
   * 게시글 상태 변경 핸들러
   * 현재는 프론트엔드에서만 상태를 관리하며,
   * 추후 API 연동 시 이 부분만 수정하면 됨
   */
  const handleComplete = () => {
    updatePostStatus(post.id);
    handleModalClose();
  };

  /**
   * 게시글 삭제 핸들러
   * 현재는 프론트엔드에서만 상태를 관리하며,
   * 추후 API 연동 시 이 부분만 수정하면 됨
   */
  const handleDelete = () => {
    deletePost(post.id);
    handleModalClose();
  };

  // 게시글 상태에 따른 버튼 텍스트 결정
  const getStatusButtonText = () => {
    return post.status === "구인중" ? "구인 완료" : "구인 중";
  };

  const handleDotsClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // 이벤트 버블링 방지 (부모 요소의 onClick 이벤트가 발생하지 않도록)
    setIsModalOpen(true); // 모달 열기
  };
  /**
   * 모달을 닫는 핸들러
   * 배경 클릭이나 특정 액션 완료 후 모달을 닫을 때 사용
   */
  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  // 채팅 버튼 클릭 시 이벤트 버블링 방지
  const handleChatButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // 이벤트 버블링 방지
    onChatClick(post.id);
  };

  return (
    // 게시글 카드 전체 영역에 클릭 이벤트 추가
    // 게시글 카드 컨테이너
    // w-full: 너비 100%, p-5: 패딩 20px, bg-[#f3f3f0]: 배경색,
    // border-b border-[#e8e7e3]: 하단 테두리, flex flex-col: 세로 방향 정렬, gap-3: 요소 간격
    <div
      className="max-w-full  mx-2 p-5 border-b border-list-line flex flex-col items-center justify-center gap-3 cursor-pointer  "
      onClick={() => onPostClick(post.id)}
    >
      {/* 게시글 상단 영역: 이미지와 정보를 가로로 배치 */}
      <div className="w-full  flex items-center gap-4">
        {/* 게시글 이미지 영역 */}
        <div
          className="w-[100px] h-[100px] relative rounded-xl overflow-hidden bg-black/20 flex-shrink-0"
          onClick={() => onPostClick(post.id)}
        >
          {/* 이미지가 있는 경우에만 이미지 표시 */}
          {post.imageUrl && (
            <Image
              src={post.imageUrl}
              alt={post.title}
              fill // 부모 요소 크기에 맞춤
              className="object-cover" // 이미지 비율 유지하며 영역 채움
              onError={(e) => {
                // 이미지 로드 실패 시 기본 이미지로 대체
                const target = e.target as HTMLImageElement;
                target.src = "/images/post_list_default_img_100px.svg";
              }}
            />
          )}
        </div>

        {/* 게시글 정보 영역 */}
        <div className="flex-1 min-w-0   h-[100px] flex flex-col ">
          {/* 제목 영역 */}
          <div className="flex items-center justify-between  ">
            <h2 className="text-title-lg truncate ">{post.title}</h2>
            <Image
              src="/icons/dots_icon_24px.svg"
              alt="게시물 상태 변경 모달띄우기"
              width={20}
              height={20}
              onClick={handleDotsClick}
              className="cursor-pointer"
            />
          </div>

          {/* 위치와 시간 정보 */}
          <div className="flex items-center gap-1">
            <span className="text-sm-medium">{post.location}</span>
            <span className="text-sm-medium">∙</span>
            <span className="text-sm-medium">{post.createdAt}</span>
          </div>

          {/* 가격 정보 */}
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <span className="text-base-semibold ">
                {post.price.toLocaleString()} {/* 천 단위 구분자 추가 */}
              </span>
              <span className="text-base-semibold">원</span>
            </div>
          </div>

          {/* 작성자 정보와 상호작용 정보 (조회수, 좋아요, 채팅) */}
          <div className=" flex justify-between items-center ">
            {/* 작성자 프로필 */}
            <div className="flex items-center justify-start gap-1">
              <Image
                src="/images/post_list_profile_default_img_20px.svg"
                alt="게시글 작성자프로필이미지"
                width={20}
                height={20}
              />
              {/* 프로필 이미지와 닉네임*/}
              <span className="w-auto text-sm-medium text-quaternary">
                {post.writer}
              </span>
            </div>

            {/* 조회수, 좋아요, 채팅 수 표시 */}
            <div className="flex items-center gap-1">
              {/* 조회수 */}
              <div className="flex items-center gap-1 ">
                <Image
                  src="/icons/post_list_view_icon_24px.svg"
                  alt="조회수"
                  width={24}
                  height={24}
                />
                <span className="text-sm-medium text-quaternary">
                  {post.views}
                </span>
              </div>
              {/* 좋아요 수 */}
              <div className="flex items-center">
                <Image
                  src="/icons/post_list_like_icon_24px.svg"
                  alt="좋아요"
                  width={24}
                  height={24}
                />
                <span className="text-sm-medium text-quaternary">
                  {post.likes}
                </span>
              </div>
              {/* 채팅 수 */}
              <div className="flex items-center">
                <Image
                  src="/icons/post_list_chat_icon_24px.svg"
                  alt="채팅"
                  width={24}
                  height={24}
                />
                <span className="text-sm-medium text-quaternary">
                  {chatCount}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* 채팅 버튼 영역 - 이벤트 버블링 방지 */}
      <div className="w-full" onClick={(e) => e.stopPropagation()}>
        {/* Button 컴포넌트 사용 
           design="design2": 미리 정의된 버튼 스타일
           width="full": 너비 100%
           onClick: 채팅 버튼 클릭 시 실행될 함수 */}
        <Button design="design2" width="full" onClick={handleChatButtonClick}>
          <Image
            src="/icons/chat_icon_24px.svg"
            alt="채팅 아이콘"
            width={24}
            height={24}
          />
          채팅방 보러가기
        </Button>
      </div>
      {/* // PostCard 컴포넌트 return문 맨 아래에 BottomSheetModal 추가 */}
      <BottomSheetModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        postId={post.id.toString()}
        onComplete={handleComplete}
        onDelete={handleDelete}
        statusText={getStatusButtonText()}
      />
    </div>
  );
};

export default PostCard;
