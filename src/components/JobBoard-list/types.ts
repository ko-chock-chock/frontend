export interface Board {
  board_id: number;
  title: string;
  contents: string;
  price: string;
  location: string;
  status: string;
  images: { image_url: string }[];
  created_date: string;
  user: { name: string };
}
