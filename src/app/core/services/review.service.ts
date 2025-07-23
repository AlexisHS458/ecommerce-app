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

  constructor() {
    // Mock data for reviews
    this.reviews.set([
      {
        id: 1,
        productId: 1,
        userName: 'María García',
        rating: 5,
        comment: 'Excelente producto, muy buena calidad y llegó antes de lo esperado.',
        date: '2024-01-15'
      },
      {
        id: 2,
        productId: 1,
        userName: 'Carlos López',
        rating: 4,
        comment: 'Buen producto, cumple con lo esperado. Recomendado.',
        date: '2024-01-10'
      },
      {
        id: 3,
        productId: 1,
        userName: 'Ana Martínez',
        rating: 5,
        comment: 'Perfecto, superó mis expectativas. Definitivamente lo compraría de nuevo.',
        date: '2024-01-08'
      },
      {
        id: 4,
        productId: 2,
        userName: 'Luis Rodríguez',
        rating: 3,
        comment: 'Producto aceptable, pero podría mejorar en algunos aspectos.',
        date: '2024-01-12'
      },
      {
        id: 5,
        productId: 2,
        userName: 'Sofia Pérez',
        rating: 5,
        comment: 'Increíble calidad, muy satisfecha con la compra.',
        date: '2024-01-05'
      }
    ]);
  }

  getReviewsByProductId(productId: number): Review[] {
    return this.reviews().filter(review => review.productId === productId);
  }

  addReview(review: Omit<Review, 'id' | 'date'>) {
    const newReview: Review = {
      ...review,
      id: this.reviews().length + 1,
      date: new Date().toISOString().split('T')[0]
    };
    this.reviews.update(reviews => [...reviews, newReview]);
  }

  getAverageRating(productId: number): number {
    const productReviews = this.getReviewsByProductId(productId);
    if (productReviews.length === 0) return 0;
    
    const totalRating = productReviews.reduce((sum, review) => sum + review.rating, 0);
    return Math.round((totalRating / productReviews.length) * 10) / 10;
  }

  getRatingCount(productId: number): number {
    return this.getReviewsByProductId(productId).length;
  }
} 