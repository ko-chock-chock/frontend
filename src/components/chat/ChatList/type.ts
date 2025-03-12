export interface ChatRoom {
  chatRoomId: string;
  lastMessage: string;
  updatedAt: string;
  opponentName: string;
  opponentProfileImage?: string;
  tradeUserProfileImage?: string;
  tradePostId: number;
  tradePostTitle?: string;
  tradePostPrice?: string;
  tradePostImage?: string;
  tradeUserId: string;
  tradeUserName: string;
  tradeUserImage: string;
}

export interface TradePost {
  title: string;
  price: string;
  thumbnailImage: string;
  writeUserId: string;
  writeUserName: string;
  writeUserProfileImage: string;
}

export interface ChatRoomApiResponse {
  writeUserProfileImage: string;
  id: string;
  lastMessage?: string;
  lastMessageDateTime?: string;
  requestUserName: string;
  requestUserProfileImage?: string;
  tradePostId: number;
}
