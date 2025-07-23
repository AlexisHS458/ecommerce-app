import { Component, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';
import { WishlistService } from '../../../core/services/wishlist.service';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { ProductCardComponent } from '../product-card/product-card.component';
import { Product } from '../../../core/models/product.model';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    TagModule,
    RatingModule,
    FormsModule,
    ProductCardComponent
  ],
  standalone: true
})
export class ProductListComponent implements OnInit {
  products = computed(() => this.productService.products());


  productService = inject(ProductService);
  router = inject(Router);
  cartService = inject(CartService);
  wishlistService = inject(WishlistService);

  ngOnInit() {
    this.productService.fetchProducts();
  }

  addToCart(product: Product) {
    this.cartService.addToCart(product);
  }

  addToWishlist(product: Product) {
    this.wishlistService.addToWishlist(product);
  }

  isInWishlist(productId: number): boolean {
    return this.wishlistService.isInWishlist(productId);
  }

  viewProduct(productId: number) {
    this.router.navigate(['/product', productId]);
  }

  getDiscountPrice(product: Product): number {
    return product.discountPercentage 
      ? product.price * (1 - product.discountPercentage / 100)
      : product.price;
  }
} 