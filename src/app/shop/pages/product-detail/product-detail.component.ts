import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';
import { WishlistService } from '../../../core/services/wishlist.service';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RatingModule } from 'primeng/rating';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CarouselModule } from 'primeng/carousel';
import { FormsModule } from '@angular/forms';
import { Pipe, PipeTransform } from '@angular/core';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';
import { Product } from '../../../core/models/product.model';

@Pipe({ name: 'reviewDate' })
export class ReviewDatePipe implements PipeTransform {
  transform(value: string | Date): string {
    if (!value) return '';
    const date = typeof value === 'string' ? new Date(value) : value;
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'hoy';
    if (diffDays === 1) return 'ayer';
    if (diffDays < 7) return `hace ${diffDays} días`;
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
  }
}

export interface Review {
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
  imports: [
    CommonModule,
    RouterModule,
    CarouselModule,
    CardModule,
    ButtonModule,
    ProgressSpinnerModule,
    RatingModule,
    FormsModule,
    InputTextModule,
    ReviewDatePipe,
    TooltipModule,
  ],
  providers: [MessageService],
  standalone: true
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  quantity = 1;
  selectedImageIndex = 0;
  reviews: Review[] = [];
  showReviewForm = false;
  addingToCart = false;
  addingToWishlist = false;
  
  // Hacer Math disponible en el template
  Math = Math;
  newReview = {
    userName: '',
    rating: 5,
    comment: ''
  };


  route = inject(ActivatedRoute);
  productService = inject(ProductService);
  cartService = inject(CartService);
  wishlistService = inject(WishlistService);
  messageService = inject(MessageService);

  ngOnInit() {
    this.route.params.subscribe(params => {
      const productId = params['id'];
      this.loadProduct(productId);
    });
  }

  loadProduct(id: string) {
    this.productService.getProductById(id).subscribe(product => {
      this.product = product;
      this.reviews = product.reviews || [];
    });
  }

  async addToCart() {
    this.addingToCart = true;
    try {
      if (!this.product) {
        this.messageService.add({severity:'error', summary:'Error', detail:'No se pudo agregar el producto al carrito.'});
        return;
      }
      await this.cartService.addToCart(this.product, this.quantity);
    } finally {
      this.addingToCart = false;
    }
  }

  async addToWishlist() {
    this.addingToWishlist = true;
    try {
      if (!this.product) {
        this.messageService.add({severity:'error', summary:'Error', detail:'No se pudo agregar el producto a favoritos.'});
        return;
      }
      await this.wishlistService.addToWishlist(this.product);
    } finally {
      this.addingToWishlist = false;
    }
  }

  async removeFromWishlist(productId: number) {
    this.addingToWishlist = true;
    try {
      await this.wishlistService.removeFromWishlist(productId);
    } finally {
      this.addingToWishlist = false;
    }
  }

  isInWishlist(): boolean {
    return this.product?.id !== undefined && this.wishlistService.isInWishlist(this.product.id);
  }

  onImageChange(index: number) {
    this.selectedImageIndex = index;
  }

  get discountPrice() {
    if (!this.product) return 0;
    return this.product.price * (1 - (this.product.discountPercentage || 0) / 100);
  }

  get productImages() {
    if (!this.product) return [];
    const images = [this.product.thumbnail];
    if (this.product.images && Array.isArray(this.product.images)) {
      images.push(...this.product.images);
    }
    return images;
  }

  get reviewCount() {
    return this.reviews.length;
  }

  toggleReviewForm() {
    this.showReviewForm = !this.showReviewForm;
  }

  submitReview() {
    // Solo agregar review localmente (DummyJSON no permite POST real)
    if (this.newReview.userName && this.newReview.comment && this.product) {
      this.reviews = [
        ...this.reviews,
        {
          userName: this.newReview.userName,
          rating: this.newReview.rating,
          comment: this.newReview.comment,
          date: new Date().toISOString().split('T')[0]
        }
      ];
      this.newReview = { userName: '', rating: 5, comment: '' };
      this.showReviewForm = false;
    }
  }
} 