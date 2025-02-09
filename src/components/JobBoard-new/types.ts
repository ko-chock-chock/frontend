import { z } from "zod";
import { jobFormSchema } from ".";

/* eslint-disable @typescript-eslint/no-unused-vars */
export interface BoardImage {
  image_id: number;
  image_url: string;
  is_thumbnail: boolean;
}

export interface BoardData {
  board_id: number;
  title: string;
  contents: string;
  price: number;
  location: string;
  status: string;
  created_date: string;
  updated_date: string;
  images: BoardImage[];
  user: {
    name: string;
    profile_image: string;
  };
}
export interface ExistingImage {
  image_id: number;
  image_url: string;
  is_thumbnail: boolean;
}

export type JobFormData = z.infer<typeof jobFormSchema>;

export interface BoardImage {
  image_id: number;
  image_url: string;
  is_thumbnail: boolean;
}

export interface BoardData {
  board_id: number;
  title: string;
  contents: string;
  price: number;
  location: string;
  status: string;
  created_date: string;
  updated_date: string;
  images: BoardImage[];
  user: {
    name: string;
    profile_image: string;
  };
}

// 이미지 타입 수정
export interface ExistingImage {
  image_id: number;
  image_url: string;
  is_thumbnail: boolean;
}
