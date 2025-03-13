export interface Message {
  createdAt?: string;
  writeUserName?: string;
  message: string;
  chatRoomId: number;
  type: string; // 메시지 타입 ('text' 또는 'system')
  text?: string; // 일반 메시지 내용
  writeUserProfileImage?: string;
  writeUserId?: number | undefined;
}
