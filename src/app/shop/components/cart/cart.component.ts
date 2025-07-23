import { Component, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../../core/services/cart.service';
import { CartItem } from '../../../core/models/cart-item.model';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';
import { DividerModule } from 'primeng/divider';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { BlockUIModule } from 'primeng/blockui';
import { signal } from '@angular/core';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    InputNumberModule,
    FormsModule,
    DividerModule,
    ProgressSpinnerModule,
    BlockUIModule,
    TableModule
  ],
  standalone: true
})
export class CartComponent implements OnInit {
  cartItems = computed(() => this.cartService.cartItems());
  cartTotal = computed(() => this.cartService.getCartTotal());
  cartCount = computed(() => this.cartService.getCartCount());
  blockCart = signal(false);



  cartService = inject(CartService);

  ngOnInit() {
    const items = this.cartService.cartItems() ?? [];
    if (items.length === 0) {
      this.cartService.fetchCart();
    }
  }

  async updateQuantity(item: CartItem, quantity: number) {
    this.blockCart.set(true);
    try {
      await this.cartService.updateQuantity(item.id, quantity);
    } finally {
      this.blockCart.set(false);
    }
  }

  async removeItem(productId: number) {
    this.blockCart.set(true);
    try {
      await this.cartService.removeFromCart(productId);
    } finally {
      this.blockCart.set(false);
    }
  }

  clearCart() {
    this.cartService.clearCart();
  }

  checkout() {
    console.log('Proceder al checkout con total:', this.cartTotal());
  }

  get loading() {
    return this.cartService.loading();
  }

  getItemPrice(item: CartItem): number {
    return item.discountPercentage 
      ? item.price * (1 - item.discountPercentage / 100)
      : item.price;
  }
} 