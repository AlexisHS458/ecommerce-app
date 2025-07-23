import { Injectable, signal } from '@angular/core';
import { Review } from '../models/review.model';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  reviews = signal<Review[]>([]);

  addReview(review: Omit<Review, 'id' | 'date'>) {
    const newReview: Review = {
      ...review,
      date: new Date().toISOString().split('T')[0]
    };
    this.reviews.update(reviews => [...reviews, newReview]);
  }

} 