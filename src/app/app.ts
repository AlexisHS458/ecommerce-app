import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { SplitButtonModule } from 'primeng/splitbutton';
import { FooterComponent } from './shared/components/footer/footer';
import { NavbarComponent } from './shared/components/navbar/navbar';
import { ModalService } from './core/services/modal.service';
import { ProductService } from './core/services/product.service';
import { CartService } from './core/services/cart.service';
import { CommonModule } from '@angular/common';
import { AuthService } from './core/services/auth.service';
import { effect, OnInit } from '@angular/core';
import { WishlistService } from './core/services/wishlist.service';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  imports: [
    ToolbarModule,
    NavbarComponent,
    FooterComponent,
    RouterOutlet,
    HttpClientModule,
    ButtonModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    SplitButtonModule,
    CommonModule,
    ToastModule,
  ],

  styleUrl: './app.css',
})
export class App implements OnInit {
  modalService = inject(ModalService);
  productService = inject(ProductService);
  cartService = inject(CartService);
  wishlistService = inject(WishlistService);
  authService = inject(AuthService);

  constructor() {
    // Sincroniza carrito
    effect(() => {
      const user = this.authService.user();
      if (user) {
        this.cartService.fetchCart();
      }
    });
    // Sincroniza wishlist
    effect(() => {
      const user = this.authService.user();
      if (user) {
        this.wishlistService.fetchWishlist();
      }
    });
  }

  ngOnInit() {
    this.productService.getCategories();
  }

  logout() {
    this.authService.signOut();
    this.cartService.cartItems.set([]);
    this.wishlistService.wishlistItems.set([]);
  }
}
