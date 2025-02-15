export interface BoardData {
  id: number;
  thumbnailImage: string;
  title: string;
  region: string;
  price: number;
  contents: string;
  state: string;
  images: string[];
  writeUserId: number;
  writeUserProfileImage: string;
  writeUserName: string;
  likeCount: number;
  viewCount: number;
  chatRoomCount: number;
  isLiked: boolean;
  createdAt: string;
  updatedAt: string;
}
export interface CheckLike {
  id: number;
}
export interface CheckLikeBoardParams {
  checkLike: CheckLike[] | null;
  boardId: string;
}
