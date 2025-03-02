export interface Reply {
  id: number;
  writeUserProfileImage?: string;
  writeUserName: string;
  content: string;
  createdAt: string;
}

export interface CommentType {
  id: number;
  writeUserProfileImage: string;
  writeUserName: string;
  content: string;
  createdAt: string;
  replies?: Reply[]; // ✅ replies 속성 추가 (대댓글)
}
