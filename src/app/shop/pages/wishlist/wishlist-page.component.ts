import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WishlistService } from '../../../core/services/wishlist.service';
import { CartService } from '../../../core/services/cart.service';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { Router } from '@angular/router';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Product } from '../../../core/models/product.model';
import { AuthService } from '../../../core/services/auth.service';
import { WishlistItem } from '../../../core/models/wishlist-item.model';

@Component({
  selector: 'app-wishlist-page',
  templateUrl: './wishlist-page.component.html',
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    TagModule,
    RatingModule,
    FormsModule,
    ProductCardComponent,
    ProgressSpinnerModule
  ],
  standalone: true
})
export class WishlistPageComponent {
  wishlistItems = computed(() => this.wishlistService.wishlistItems());
  addingToCart: Record<number, boolean> = {};
  addingToWishlist: Record<number, boolean> = {};
  removingFromWishlist: Record<number, boolean> = {};

  constructor(
  ) {
    if (this.wishlistService.wishlistItems().length === 0) {
      this.wishlistService.fetchWishlist();
    }
  }

  wishlistService = inject(WishlistService);
  cartService = inject(CartService);
  router = inject(Router);
  authService = inject(AuthService);

  async removeFromWishlist(productId: number) {
    this.removingFromWishlist[productId] = true;
    try {
      await this.wishlistService.removeFromWishlist(productId);
    } finally {
      this.removingFromWishlist[productId] = false;
    }
  }

  async addToCart(product: Product) {
    this.addingToCart[product.id] = true;
    try {
      await this.cartService.addToCart(product);
      await this.wishlistService.removeFromWishlist(product.id);
    } finally {
      this.addingToCart[product.id] = false;
    }
  }

  async addToWishlist(product: Product) {
    this.addingToWishlist[product.id] = true;
    try {
      await this.wishlistService.addToWishlist(product);
    } finally {
      this.addingToWishlist[product.id] = false;
    }
  }

  clearWishlist() {
    this.wishlistService.clearWishlist();
  }

  get loading() {
    return this.wishlistService.loading();
  }

  getItemPrice(item: WishlistItem): number {
    return item.discountPercentage 
      ? item.price * (1 - item.discountPercentage / 100)
      : item.price;
  }

  getWishlistTotal(): number {
    return this.wishlistItems().reduce((total, item) => {
      const price = item.discountPercentage 
        ? item.price * (1 - item.discountPercentage / 100)
        : item.price;
      return total + price;
    }, 0);
  }

  addAllToCart() {
    this.wishlistItems().forEach(item => {
      this.cartService.addToCart(item as Product);
    });
    this.wishlistService.clearWishlist();
  }

  viewProduct(productId: number) {
    this.router.navigate(['/product', productId]);
  }

} 