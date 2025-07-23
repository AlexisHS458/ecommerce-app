import { Injectable, signal } from '@angular/core';

export interface Review {
  id: number;
  productId: number;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  reviews = signal<Review[]>([]);

  addReview(review: Omit<Review, 'id' | 'date'>) {
    const newReview: Review = {
      ...review,
      id: this.reviews().length + 1,
      date: new Date().toISOString().split('T')[0]
    };
    this.reviews.update(reviews => [...reviews, newReview]);
  }

} 