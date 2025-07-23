import { Review } from "./review.model";

export interface Product {
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