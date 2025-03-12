export interface CommunityPostDetail {
  id: number;
  title: string;
  contents: string;
  createdAt: string;
  updatedAt: string;
  viewCount: number;
  bookmarkCount: number;
  commentCount: number;
  images: string[];
  writeUserId: number;
  writeUserName: string;
  writeUserProfileImage?: string;
}
