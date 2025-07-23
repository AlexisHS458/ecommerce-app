import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { BadgeModule } from 'primeng/badge';
import { RatingModule } from 'primeng/rating';
import { CartService } from '../../../core/services/cart.service';
import { WishlistService } from '../../../core/services/wishlist.service';
import { FormsModule } from '@angular/forms';
import { TooltipModule } from 'primeng/tooltip';
import { Product } from '../../../core/models/product.model';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    CardModule,
    BadgeModule,
    RatingModule,
    TooltipModule
  ],
  standalone: true
})
export class ProductCardComponent {
  @Input() product!: Product;
  @Input() showActions = true;
  @Input() showRating = true;
  @Input() addingToWishlist = false;
  @Input() addingToCart = false;
  @Input() removingFromWishlist = false;

  
  @Output() addToCartClick = new EventEmitter<Product>();
  @Output() addToWishlistClick = new EventEmitter<Product>();
  @Output() viewProductClick = new EventEmitter<Product>();
  @Output() removeFromWishlistClick = new EventEmitter<Product>();

  cartService = inject(CartService);
  wishlistService = inject(WishlistService);
  router = inject(Router);

  async addToCart() {
    this.addingToCart = true;
    try {
    this.addToCartClick.emit(this.product);
    } finally {
      this.addingToCart = false;
    }
  }

  addToWishlist() {
    this.addToWishlistClick.emit(this.product);
  }

  removeFromWishlist() {
    this.removeFromWishlistClick.emit(this.product);
  }

  viewProduct() {
    this.router.navigate(['/product', this.product.id]);
    this.viewProductClick.emit(this.product);
  }

  isInWishlist(): boolean {
    return this.wishlistService.isInWishlist(this.product?.id);
  }

  isInCart(): boolean {
    return this.cartService.isInCart(this.product?.id);
  }

  getDiscountPrice(price: number, discountPercentage: number): number {
    return price * (1 - (discountPercentage || 0) / 100);
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img) {
      img.style.display = 'none';
    }
  }

  handleWishlistClick(event: Event) {
    
    if (this.isInWishlist()) {
      this.removeFromWishlist();
    } else {
      this.addToWishlist();
    }
    event.stopPropagation();
  }
} 