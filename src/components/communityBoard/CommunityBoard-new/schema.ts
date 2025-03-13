import { z } from "zod";

// 📌 커뮤니티 게시글 유효성 검사 스키마
export const communityFormSchema = z.object({
  title: z.string().min(1, "제목을 입력해주세요"),
  contents: z.string().min(1, "내용을 입력해주세요"),
  images: z.array(z.instanceof(File)).optional(),
});
