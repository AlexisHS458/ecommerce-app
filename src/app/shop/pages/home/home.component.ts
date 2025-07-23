import { Component, inject, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';
import { WishlistService } from '../../../core/services/wishlist.service';
import { CarouselModule } from 'primeng/carousel';  
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { Product } from '../../../core/models/product.model';
import { HomeHeroComponent } from './home-hero.component';
import { HomeCategoriesCarouselComponent } from './home-categories-carousel.component';
import { HomeProductsCarouselComponent } from './home-products-carousel.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [
    CommonModule,
    CarouselModule,
    CardModule,
    ButtonModule,
    HomeHeroComponent,
    HomeCategoriesCarouselComponent,
    HomeProductsCarouselComponent
  ],
  standalone: true
})
export class HomeComponent implements OnInit, AfterViewInit {
  heroImages = [
    {
      image: 'assets/hero.webp',
      title: 'Nuevas Colecciones',
      subtitle: 'Descubre las últimas tendencias'
    }
  ];



  productService = inject(ProductService);
  cartService = inject(CartService);
  wishlistService = inject(WishlistService);
  router = inject(Router);

  isMobile = false;

  ngOnInit() {
    this.productService.fetchProducts({ limit: 100 });
    this.productService.getCategories();
    this.isMobile = window.innerWidth < 768;
    if (this.isMobile) {
      this.showCategoriesCarousel = true;
      this.showFeaturedCarousel = true;
      this.showNewArrivalsCarousel = true;
      this.showDealsCarousel = true;
    }
  }

  addingToCart: Record<number, boolean> = {};
  addingToWishlist: Record<number, boolean> = {};
  removingFromWishlist: Record<number, boolean> = {};

  showCategoriesCarousel = false;
  showFeaturedCarousel = false;
  showNewArrivalsCarousel = false;
  showDealsCarousel = false;

  @ViewChild('categoriesCarousel', { static: false }) categoriesCarouselRef!: ElementRef;
  @ViewChild('featuredCarousel', { static: false }) featuredCarouselRef!: ElementRef;
  @ViewChild('newArrivalsCarousel', { static: false }) newArrivalsCarouselRef!: ElementRef;
  @ViewChild('dealsCarousel', { static: false }) dealsCarouselRef!: ElementRef;

  ngAfterViewInit() {
    if (this.isMobile) return;
    if (this.categoriesCarouselRef) {
      this.observeSection(this.categoriesCarouselRef, () => this.showCategoriesCarousel = true);
    }
    if (this.featuredCarouselRef) {
      this.observeSection(this.featuredCarouselRef, () => this.showFeaturedCarousel = true);
    }
    if (this.newArrivalsCarouselRef) {
      this.observeSection(this.newArrivalsCarouselRef, () => this.showNewArrivalsCarousel = true);
    }
    if (this.dealsCarouselRef) {
      this.observeSection(this.dealsCarouselRef, () => this.showDealsCarousel = true);
    }
  }

  observeSection(elementRef: ElementRef, callback: () => void) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          callback();
          obs.disconnect();
        }
      });
    }, { threshold: 0.1 });
    observer.observe(elementRef.nativeElement);
  }

  get featuredProducts() {
    return this.productService.products().slice(0, 8);
  }

  get newArrivals() {
    const products = this.productService.products();
    const featuredIds = new Set(this.featuredProducts.map(p => p.id));
    return products
      .filter(product => (product.rating ?? 0) >= 4.5 && !featuredIds.has(product.id))
      .slice(0, 8);
  }

  get dealsProducts() {
    const products = this.productService.products();
    const excludeIds = new Set([
      ...this.featuredProducts.map(p => p.id),
      ...this.newArrivals.map(p => p.id)
    ]);
    return products
      .filter(product => (product.discountPercentage ?? 0) > 0 && !excludeIds.has(product.id))
      .slice(0, 12);
  }

  async addToCart(product: Product) {
    this.addingToCart[product.id] = true;
    try {
      await this.cartService.addToCart(product);
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

  toggleWishlist(product: Product) {
    if (this.wishlistService.isInWishlist(product.id)) {
      this.wishlistService.removeFromWishlist(product.id);
    } else {
      this.wishlistService.addToWishlist(product);
    }
  }

  async removeFromWishlist(productId: number) {
    this.removingFromWishlist[productId] = true;
    try {
      await this.wishlistService.removeFromWishlist(productId);
    } finally {
      this.removingFromWishlist[productId] = false;
    }
  }

  getDiscountPrice(product: Product): number {
    return product.discountPercentage 
      ? product.price * (1 - product.discountPercentage / 100)
      : product.price;
  }

  viewProduct(productId: number) {
    this.router.navigate(['/product', productId]);
  }

  viewCategory(category: string) {
    this.router.navigate(['/products'], {
      queryParams: { category: category }
    });
  }
}
