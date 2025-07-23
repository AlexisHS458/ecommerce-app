import { Review } from "./review.model";

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
  images?: string[];
  reviews?: Review[];
}
