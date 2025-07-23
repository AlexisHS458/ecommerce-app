import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';

@Component({
  selector: 'app-navbar-cart-wishlist',
  standalone: true,
  imports: [CommonModule, ButtonModule, BadgeModule],
  template: `
    <div class="flex items-center space-x-4 ml-4">
      <!-- Carrito -->
      <div class="relative cursor-pointer" routerLink="/cart">
        <ng-container *ngIf="cartLoading; else cartIcon">
          <span class="inline-block w-7 h-7 bg-blue-300/40 rounded-full animate-pulse"></span>
        </ng-container>
        <ng-template #cartIcon>
          <p-button icon="pi pi-shopping-cart" styleClass="text-white text-lg p-button-text no-hover"></p-button>
          <span *ngIf="cartCount > 0"
                pBadge
                [value]="cartCount"
                severity="danger"
                styleClass="absolute -top-2 -right-2"
          ></span>
        </ng-template>
      </div>
      <!-- Wishlist -->
      <div class="relative cursor-pointer" routerLink="/wishlist">
        <ng-container *ngIf="wishlistLoading; else wishlistIcon">
          <span class="inline-block w-7 h-7 bg-blue-300/40 rounded-full animate-pulse"></span>
        </ng-container>
        <ng-template #wishlistIcon>
          <p-button icon="pi pi-heart" styleClass="text-white text-lg p-button-text no-hover"></p-button>
          <span *ngIf="wishlistCount > 0"
                pBadge
                [value]="wishlistCount"
                severity="info"
                styleClass="absolute -top-2 -right-2"
          ></span>
        </ng-template>
      </div>
    </div>
  `
})
export class NavbarCartWishlistComponent {
  @Input() cartLoading = false;
  @Input() wishlistLoading = false;
  @Input() cartCount = 0;
  @Input() wishlistCount = 0;
} 