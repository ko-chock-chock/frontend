import Image from "next/image";
import { 
  Post, 
  isTradePost, 
  isCommunityPost, 
  isReviewPost, 
  getRelativeTimeString 
} from "./types";

interface PostCardProps {
  post: Post;
  onPostClick: (id: number) => void;
}

export default function PostCard({ post, onPostClick }: PostCardProps) {
  // 커뮤니티 게시글 렌더링
  if (isCommunityPost(post)) {
    return (
      <div className="h-[9.1875rem] p-5 border-b border-list-line flex justify-center items-center">
        <div className="w-[20.625rem] flex justify-center items-center gap-[1.5625rem]">
          <div className="w-[12.875rem] flex flex-col gap-1">
            <div className="flex items-center">
              <span className="text-text-secondary text-xs font-medium">{post.writeUserName}</span>
              <span className="text-text-tertiary text-xs font-medium"> ∙ </span>
              <span className="text-text-tertiary text-xs font-medium">
                {getRelativeTimeString(post.createdAt)}
              </span>
            </div>

            <div className="h-[3.5625rem] flex flex-col">
              <div className="text-base-medium">{post.title}</div>
              <div className="text-xs-medium">{post.contents}</div>
            </div>

            <div className="flex items-center gap-[0.3125rem]">
              <div className="flex items-center">
                <Image
                  src="/icons/post_list_view_icon_24px.svg"
                  alt="조회수"
                  width={24}
                  height={24}
                />
                <span className="text-sm-medium-quaternary">{post.viewCount}</span>
              </div>
              <div className="flex items-center">
                <Image
                  src="/icons/post_list_chat_icon_24px.svg"
                  alt="댓글"
                  width={24}
                  height={24}
                />
                <span className="text-sm-medium-quaternary">{post.commentCount}</span>
              </div>
            </div>
          </div>

          <div className="w-[6.25rem] h-[6.25rem] bg-black/20 rounded-xl">
            {post.thumbnailImage && (
              <Image
                src={post.thumbnailImage}
                alt={post.title}
                width={100}
                height={100}
                className="rounded-xl object-cover"
              />
            )}
          </div>
        </div>
      </div>
    );
  }

  // 거래 게시글 렌더링
  if (isTradePost(post)) {
    return (
      <div 
        className="flex flex-col border-b border-list-line cursor-pointer" 
        onClick={() => onPostClick(post.id)}
      >
        <div className="p-5 flex gap-4">
          <div className="w-[6.25rem] h-[6.25rem] relative rounded-xl overflow-hidden bg-black/20 flex-shrink-0">
            {post.thumbnailImage && (
              <Image
                src={post.thumbnailImage}
                alt={post.title}
                fill
                className="object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/images/post_list_default_img_100px.svg";
                }}
              />
            )}
          </div>

          <div className="flex-1 flex flex-col gap-1">
            <div className="flex justify-between">
              <h2 className="text-title-lg truncate">{post.title}</h2>
              <Image
                src="/icons/dots_icon_24px.svg"
                alt="더보기"
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
                  src={post.writeUserProfileImage}
                  alt="프로필"
                  width={20}
                  height={20}
                />
                <span className="text-sm-medium-quaternary">{post.writeUserName}</span>
              </div>

              <div className="flex items-center gap-1">
                <div className="flex items-center">
                  <Image
                    src="/icons/post_list_view_icon_24px.svg"
                    alt="조회수"
                    width={24}
                    height={24}
                  />
                  <span className="text-sm-medium-quaternary">{post.viewCount}</span>
                </div>
                <div className="flex items-center">
                  <Image
                    src="/icons/post_list_like_icon_24px.svg"
                    alt="좋아요"
                    width={24}
                    height={24}
                  />
                  <span className="text-sm-medium-quaternary">{post.likeCount}</span>
                </div>
                <div className="flex items-center">
                  <Image
                    src="/icons/post_list_chat_icon_24px.svg"
                    alt="채팅"
                    width={24}
                    height={24}
                  />
                  <span className="text-sm-medium-quaternary">{post.chatRoomCount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 후기 게시글 렌더링
  if (isReviewPost(post)) {
    return (
      <div className="p-5 border-b border-list-line">
        <div className="flex items-center gap-2">
          <Image
            src={post.writeUserProfileImage}
            alt="프로필"
            width={40}
            height={40}
            className="rounded-full"
          />
          <div>
            <div className="flex items-center gap-1">
              <span className="text-sm-medium">{post.writeUserName}</span>
              <span className="text-text-tertiary text-xs">
                {getRelativeTimeString(post.createdAt)}
              </span>
            </div>
            <div className="text-base-medium">{post.title}</div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}