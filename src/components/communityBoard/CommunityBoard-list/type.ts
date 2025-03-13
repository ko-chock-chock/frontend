export interface CommunityPost {
  bookmarkCount: number;
  id: number;
  title: string;
  contents: string;
  createdAt: string;
  updatedAt: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  thumbnailImage?: string;
  writeUserId: number;
  writeUserName: string;
  writeUserProfileImage?: string;
}
