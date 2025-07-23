import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselModule } from 'primeng/carousel';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { Product } from '../../../core/models/product.model';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-home-products-carousel',
  standalone: true,
  imports: [CommonModule, CarouselModule, ProductCardComponent, ProgressSpinnerModule],
  template: `
    <div class="mb-8 md:mb-16 bg-white rounded-xl shadow-lg border-2 border-blue-100 md:p-8 py-8">
      <h2 class="text-2xl font-bold text-blue-800 mb-6 text-center">{{ title }}</h2>
      <div *ngIf="loading" class="flex justify-center items-center py-12">
        <p-progressSpinner styleClass="w-12 h-12" strokeWidth="4"></p-progressSpinner>
      </div>
      <p-carousel 
        *ngIf="!loading"
        [value]="products" 
        [numVisible]="3" 
        [numScroll]="1"
        [responsiveOptions]="[
          { breakpoint: '1200px', numVisible: 3, numScroll: 1 },
          { breakpoint: '992px', numVisible: 2, numScroll: 1 },
          { breakpoint: '768px', numVisible: 1, numScroll: 1 }
        ]"
        [circular]="true"
        [autoplayInterval]="0"
        [showNavigators]="true"
        [showIndicators]="false"
        styleClass="products-carousel"
        itemStyleClass=""
      >
        <ng-template let-product pTemplate="item">
          <div class="product-card-wrapper max-w-[90vw] mx-auto px-2 md:px-6 lg:px-8 h-full min-h-[350px] flex py-4">
            <app-product-card 
              [product]="product"
              (addToCartClick)="addToCart.emit(product)"
              (addToWishlistClick)="addToWishlist.emit(product)"
              (removeFromWishlistClick)="removeFromWishlist.emit(product.id)"
              (viewProductClick)="viewProduct.emit(product.id)"
              [addingToCart]="addingToCart[product.id]"
              [addingToWishlist]="addingToWishlist[product.id]"
              [removingFromWishlist]="removingFromWishlist[product.id]"
              class="h-full w-full"
            ></app-product-card>
          </div>
        </ng-template>
      </p-carousel>
    </div>
  `
})
export class HomeProductsCarouselComponent {
  @Input() title = '';
  @Input() products: Product[] = [];
  @Input() loading = false;
  @Input() addingToCart: Record<number, boolean> = {};
  @Input() addingToWishlist: Record<number, boolean> = {};
  @Input() removingFromWishlist: Record<number, boolean> = {};
  @Output() addToCart = new EventEmitter<Product>();
  @Output() addToWishlist = new EventEmitter<Product>();
  @Output() removeFromWishlist = new EventEmitter<number>();
  @Output() viewProduct = new EventEmitter<number>();
} 