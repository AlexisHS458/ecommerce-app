import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { User } from '@angular/fire/auth';
import { CartService } from '../../../core/services/cart.service';
import { WishlistService } from '../../../core/services/wishlist.service';
import { inject } from '@angular/core';
import { Category } from '../../../core/models/category.model';

@Component({
  selector: 'app-navbar-mobile-menu',
  standalone: true,
  imports: [CommonModule, RouterLink, DrawerModule, ButtonModule, AvatarModule],
  template: `
    <p-drawer [(visible)]="showMobileDrawer" header="" position="left" styleClass="!w-full md:!w-80 lg:!w-[30rem] bg-white">
      <div class="flex flex-col h-full">
        <!-- Header sencillo -->
        <div class="flex items-center gap-3 px-6 py-5 border-b border-blue-100 mb-2">
          <p-avatar *ngIf="user; else guestIcon" styleClass="w-10 h-10 bg-blue-100 text-blue-700 font-bold border-2 border-blue-200">
            <span class="text-lg">{{ getUserInitials(user) }}</span>
          </p-avatar>
          <ng-template #guestIcon>
            <p-avatar styleClass="w-10 h-10 bg-blue-100 text-blue-400 border-2 border-blue-200">
              <i class="pi pi-user text-xl"></i>
            </p-avatar>
          </ng-template>
          <div>
            <span class="block text-base font-semibold text-blue-800">{{ user ? displayName : 'Bienvenido' }}</span>
            <span class="block text-xs text-blue-400" *ngIf="!user">Inicia sesión o regístrate</span>
          </div>
        </div>
        <!-- Menú de navegación -->
        <ul class="flex flex-col gap-1 py-2 px-1 overflow-y-auto max-h-[80vh]">
          <li>
            <a routerLink="/" (click)="closeDrawer()" class="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-blue-50 text-blue-800 font-medium text-sm">
              <i class="pi pi-home text-base"></i> Inicio
            </a>
          </li>
          <li>
            <a routerLink="/products" (click)="closeDrawer()" class="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-blue-50 text-blue-800 font-medium text-sm">
              <i class="pi pi-list text-base"></i> Productos
            </a>
          </li>
          <li>
            <button type="button" (click)="toggleCategories()" class="flex items-center gap-1 w-full px-2 py-1 rounded-lg hover:bg-blue-50 text-blue-800 font-medium text-sm focus:outline-none">
              <i class="pi pi-tags text-base"></i> Categorías
              <i class="pi ml-auto" [ngClass]="showMobileCategories ? 'pi-chevron-up' : 'pi-chevron-down'"></i>
            </button>
            <ul *ngIf="showMobileCategories" class="ml-4 mt-1 flex flex-col gap-0.5">
              <li *ngFor="let category of categories">
                <a
                  (click)="viewCategory(category.name)"
                  (keyup.enter)="viewCategory(category.name)"
                  tabindex="0"
                  class="block px-2 py-1 rounded hover:bg-blue-50 text-blue-700 text-xs font-normal flex items-center gap-1"
                >
                  <i [ngClass]="category.icon" class="text-base"></i>
                  {{ category.name }}
                </a>
              </li>
            </ul>
          </li>
        </ul>
        <!-- Separador visual -->
        <div class="my-2 border-t border-blue-100"></div>
        <!-- Usuario -->
        <div class="px-6 pb-6">
          <ng-container *ngIf="user; else guestLinks">
            <ul class="flex flex-col gap-1">
              <li>
                <a routerLink="/profile" (click)="closeDrawer()" class="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-blue-50 text-blue-800 font-medium">
                  <i class="pi pi-user text-base"></i> Mi cuenta
                </a>
              </li>
              <li>
                <button (click)="logout.emit(); closeDrawer()" class="flex items-center gap-2 w-full px-4 py-2 rounded-lg hover:bg-blue-50 text-blue-800 font-medium">
                  <i class="pi pi-sign-out text-base"></i> Cerrar sesión
                </button>
              </li>
            </ul>
          </ng-container>
          <ng-template #guestLinks>
            <ul class="flex flex-col gap-1">
              <li>
                <a routerLink="/login" (click)="closeDrawer()" class="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-blue-50 text-blue-800 font-medium">
                  <i class="pi pi-sign-in text-base"></i> Iniciar Sesión
                </a>
              </li>
              <li>
                <a routerLink="/register" (click)="closeDrawer()" class="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-blue-50 text-blue-800 font-medium">
                  <i class="pi pi-user-plus text-base"></i> Registrarse
                </a>
              </li>
            </ul>
          </ng-template>
        </div>
      </div>
    </p-drawer>
  `
})
export class NavbarMobileMenuComponent {
  @Input() user: User | null | undefined;
  @Input() displayName = '';
  @Input() getUserInitials: (user: User | null | undefined) => string = () => 'U';
  @Input() categories: Category[] = [];
  private _showMobileDrawer = false;
  @Input()
  get showMobileDrawer() {
    return this._showMobileDrawer;
  }
  set showMobileDrawer(val: boolean) {
    this._showMobileDrawer = val;
    this.showMobileDrawerChange.emit(this._showMobileDrawer);
  }
  @Input() showMobileCategories = false;
  @Output() showMobileDrawerChange = new EventEmitter<boolean>();
  @Output() showMobileCategoriesChange = new EventEmitter<boolean>();
  @Output() logout = new EventEmitter<void>();
  @Output() viewCategoryEvent = new EventEmitter<string>();

  cartService = inject(CartService);
  wishlistService = inject(WishlistService);

  getCategoryLabel(category: string): string {
    if (!category) return '';
    // Reemplaza guiones por espacios y capitaliza la primera letra de cada palabra
    return category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  closeDrawer() {
    this.showMobileDrawerChange.emit(false);
  }
  toggleCategories() {
    this.showMobileCategoriesChange.emit(!this.showMobileCategories);
  }
  viewCategory(category: string) {
    this.viewCategoryEvent.emit(category);
    this.closeDrawer();
    this.showMobileCategoriesChange.emit(false);
  }
} 