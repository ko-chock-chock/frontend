import Image from "next/image";
import {
  Post,
  getRelativeTimeString,
  isBookmarkedPost,
  isWishlistedPost,
} from "./types";

interface PostCardProps {
  post: Post;
  onPostClick: (id: number) => void;
}

export default function PostCard({ post, onPostClick }: PostCardProps) {
  // 기본 이미지 경로 상수화
  const DEFAULT_THUMBNAIL = "/images/post_list_default_img_100px.svg";
  const DEFAULT_PROFILE = "/images/post_list_profile_default_img_20px.svg";

  // 찜 거래 게시글 렌더링
  if (isWishlistedPost(post)) {
    return (
      <div
        className="max-w-full py-5 flex flex-col border-b  border-list-line cursor-pointer"
        onClick={() => onPostClick(post.id)}
      >
        <div className="flex justify-between items-center gap-4 w-full  ">
          <div className="w-[6.25rem] h-[6.25rem] relative rounded-xl overflow-hidden bg-black/20 flex-shrink-0">
            {post.thumbnailImage && (
              <Image
                src={post.thumbnailImage || DEFAULT_THUMBNAIL}
                alt={post.title}
                fill
                className="object-cover "
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/images/post_list_default_img_100px.svg";
                }}
              />
            )}
          </div>

          <div className="flex flex-col gap-1 flex-1 min-w-0">
            <div className="flex flex-center gap-1">
              <h2 className="text-title-lg truncate overflow-hidden flex-1 min-w-0">
                {post.title}
              </h2>
              <Image
                src="/icons/bookmark-like_Page/like_on_24px.svg"
                alt="찜on"
                width={20}
                height={20}
                className="cursor-pointer"
              />
            </div>

            <div className="flex items-center gap-1">
              <span className="text-sm-medium">{post.region}</span>
              <span className="text-sm-medium">∙</span>
              <span className="text-sm-medium">
                {getRelativeTimeString(post.createdAt)}
              </span>
            </div>

            <div className="flex items-center">
              <span className="text-base-semibold">
                {post.price.toLocaleString()}원
              </span>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1">
                <Image
                  src={post.writeUserProfileImage || DEFAULT_PROFILE}
                  alt="프로필"
                  width={20}
                  height={20}
                />
                <span className="text-sm-medium-quaternary">
                  {post.writeUserName}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <div className="flex items-center">
                  <Image
                    src="/icons/post_list_view_icon_24px.svg"
                    alt="조회수"
                    width={24}
                    height={24}
                  />
                  <span className="text-sm-medium-quaternary">
                    {post.viewCount}
                  </span>
                </div>
                <div className="flex items-center">
                  <Image
                    src="/icons/post_list_like_icon_24px.svg"
                    alt="좋아요"
                    width={24}
                    height={24}
                  />
                  <span className="text-sm-medium-quaternary">
                    {post.likeCount}
                  </span>
                </div>
                <div className="flex items-center">
                  <Image
                    src="/icons/post_list_chat_icon_24px.svg"
                    alt="채팅"
                    width={24}
                    height={24}
                  />
                  <span className="text-sm-medium-quaternary">
                    {post.chatRoomCount}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  

  // 북마크 커뮤니티 게시글 렌더링
  if (isBookmarkedPost(post)) {
    return (
      <div
        className="max-w-full py-5 flex flex-col border-b  border-list-line cursor-pointer"
        onClick={() => onPostClick(post.id)}
      >
        <div className="flex justify-between items-center gap-4 w-full  ">
          <div className="w-[6.25rem] h-[6.25rem] relative rounded-xl overflow-hidden bg-black/20 flex-shrink-0">
            {post.thumbnailImage && (
              <Image
                src={post.thumbnailImage || DEFAULT_THUMBNAIL}
                alt={post.title}
                fill
                className="object-cover "
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/images/post_list_default_img_100px.svg";
                }}
              />
            )}
          </div>

          <div className="flex flex-col gap-1 flex-1 min-w-0">
            <div className="flex flex-center gap-1">
              <h2 className="text-title-lg truncate flex-1 min-w-0">
                {post.title}
              </h2>
              <Image
                src="/icons/bookmark-like_Page/bookmark_on_24px.svg"
                alt="더보기"
                width={20}
                height={20}
                className="cursor-pointer"
              />
            </div>

            <div className="flex items-center gap-1">
              {/* <span className="text-sm-medium">∙</span> */}
              <span className="text-sm-medium">
                {getRelativeTimeString(post.createdAt)}
              </span>
            </div>

            <div className="flex items-center">
              <span className="text-base-semibold truncate ">
                {post.contents}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1">
                <Image
                  src={post.writeUserProfileImage || DEFAULT_PROFILE}
                  alt="프로필"
                  width={20}
                  height={20}
                />
                <span className="text-sm-medium-quaternary">
                  {post.writeUserName}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <div className="flex items-center">
                  <Image
                    src="/icons/post_list_view_icon_24px.svg"
                    alt="조회수"
                    width={24}
                    height={24}
                  />
                  <span className="text-sm-medium-quaternary">
                    {post.viewCount}
                  </span>
                </div>
                <div className="flex items-center">
                  <Image
                    src="/icons/community_detail_bookmark_24px.svg"
                    alt="북마크아이콘"
                    width={24}
                    height={24}
                  />
                  <span className="text-sm-medium-quaternary">
                    {post.bookmarkCount}
                  </span>
                </div>
                <div className="flex items-center">
                  <Image
                    src="/icons/post_list_chat_icon_24px.svg"
                    alt="덧글아이콘"
                    width={24}
                    height={24}
                  />
                  <span className="text-sm-medium-quaternary">
                    {post.commentCount}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
