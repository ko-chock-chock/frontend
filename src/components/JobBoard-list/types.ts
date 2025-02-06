export interface Board {
  id: number;
  thumbnailImage: string;
  title: string;
  region: string;
  price: number;
  contents: string;
  state: "TRADING" | "COMPLETED";
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
