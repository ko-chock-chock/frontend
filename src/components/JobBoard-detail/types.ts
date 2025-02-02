export interface Image {
  image_url: string;
  is_thumbnail: boolean;
}

export interface User {
  name: string;
  profile_image: string;
}

export interface BoardData {
  board_id: number;
  title: string;
  contents: string;
  price: string;
  location: string;
  status: string;
  created_date: string;
  updated_date: string;
  images: Image[];
  user: User;
}

export interface ApiResponse {
  message: string;
  data: BoardData;
}
