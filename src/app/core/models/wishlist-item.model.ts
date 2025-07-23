export interface Review {
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface WishlistItem {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  category: string;
  description?: string;
  discountPercentage?: number;
  rating?: number;
  stock?: number;
  brand?: string;
  images?: string[];
  reviews?: Review[];
}
