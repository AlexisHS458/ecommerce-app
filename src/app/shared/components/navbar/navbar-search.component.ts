import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-navbar-search',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule],
  template: `
    <!-- Desktop Search -->
    <div class="relative w-64 hidden md:block">
      <i class="pi pi-search absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300"></i>
      <input
        pInputText
        [(ngModel)]="searchQuery"
        type="text"
        placeholder="Buscar productos..."
        (input)="searchProducts.emit($event)"
        (keyup.enter)="goToProductsSearch.emit()"
        class="w-full pl-10 pr-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-blue-50 text-blue-900"
      />
    </div>
    <!-- Mobile Search Bar -->
    <div *ngIf="showMobileSearch" class="md:hidden py-3 border-blue-200 bg-blue-100">
      <div class="relative w-full px-4">
        <i class="pi pi-search absolute left-7 top-1/2 transform -translate-y-1/2 text-blue-300"></i>
        <input
          pInputText
          [(ngModel)]="searchQuery"
          type="text"
          placeholder="Buscar productos..."
          (input)="searchProducts.emit($event)"
          (keyup.enter)="goToProductsSearch.emit()"
          class="w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white text-blue-900"
        />

      </div>
    </div>
  `
})
export class NavbarSearchComponent {
  @Input() searchQuery = '';
  @Input() showMobileSearch = false;
  @Output() searchProducts = new EventEmitter<Event>();
  @Output() goToProductsSearch = new EventEmitter<void>();
} 