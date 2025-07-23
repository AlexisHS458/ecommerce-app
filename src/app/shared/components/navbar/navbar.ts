import { Component, computed, inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { ModalService } from '../../../core/services/modal.service';
import { ProductService } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';
import { WishlistService } from '../../../core/services/wishlist.service';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { ToolbarModule } from 'primeng/toolbar';
import { RouterLink, Router, NavigationStart } from '@angular/router';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { SplitButtonModule } from 'primeng/splitbutton';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { CommonModule } from '@angular/common';
import { MenuModule } from 'primeng/menu';
import { MegaMenuModule } from 'primeng/megamenu';
import { FormsModule } from '@angular/forms';
import { DrawerModule } from 'primeng/drawer';
import { BadgeModule } from 'primeng/badge';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { UserMenuComponent } from './user-menu.component';
import { NavbarSearchComponent } from './navbar-search.component';
import { User } from '@angular/fire/auth';
import { NavbarMobileMenuComponent } from './navbar-mobile-menu.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    ButtonModule,
    AvatarModule,
    ToolbarModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    SplitButtonModule,
    MenubarModule,
    OverlayBadgeModule,
    MenuModule,
    MegaMenuModule,
    DrawerModule,
    BadgeModule,
    ProgressSpinnerModule,
    UserMenuComponent,
    NavbarSearchComponent,
    NavbarMobileMenuComponent
  ]
})
export class NavbarComponent {
  private searchTimeout: ReturnType<typeof setTimeout> | undefined;
  searchQuery = '';
  showMobileSearch = false;
  showMobileMenu = false;
  showMobileCategories = false;
  showMobileDrawer = false;


  menuUser = computed(() => [
    {
      label: this.authService.user()?.email || 'Usuario',
      items: [
        {
          label: 'Mi cuenta',
          icon: 'pi pi-user',
        },
        {
          label: 'Salir',
          icon: 'pi pi-sign-out',
          command: () => this.logout(),
        },
      ],
    },
  ]);

  constructor(
  ) {
    // Cargar categorías al inicializar
    //this.productService.getCategories();
    // Cierra el buscador mobile en cualquier navegación
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.showMobileSearch = false;
      }
    });
  }

  modalService = inject(ModalService);
  authService = inject(AuthService);
  productService = inject(ProductService);
  cartService = inject(CartService);
  wishlistService = inject(WishlistService);
  router = inject(Router);

  toggleMobileSearch() {
    this.showMobileSearch = !this.showMobileSearch;
    if (this.showMobileSearch) {
      this.showMobileMenu = false;
    }
  }

  toggleMobileMenu() {
    this.showMobileMenu = !this.showMobileMenu;
    if (this.showMobileMenu) {
      this.showMobileSearch = false;
    }
  }

  logout() {
    this.authService.signOut();
    this.cartService.cartItems.set([]);
    this.wishlistService.wishlistItems.set([]);
  }

  get displayName(): string {
    const profile = this.authService.userProfile();
    if (profile && profile.firstName) {
      return `${profile.firstName} ${profile.lastName || ''}`.trim();
    }
   return 'Usuario';
  }

  get profileLoading(): boolean {
    return !!this.authService.user() && !this.authService.userProfile();
  }

  getUserInitials = (user: User | null | undefined) => {
    if (!user) return 'U';
    if (user.displayName) return user.displayName.charAt(0).toUpperCase();
    const email = user.email || '';
    return email.charAt(0).toUpperCase();
  };

  searchProducts(event: Event) {
    const input = event.target as HTMLInputElement;
    const query = input.value;
    this.searchQuery = query;

    // Limpiar timeout anterior
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    // Crear nuevo timeout
    this.searchTimeout = setTimeout(() => {
      if (query.trim()) {
       // this.productService.searchProducts(query);
      } else {
        this.productService.fetchProducts();
      }
    }, 300);
  }

  viewCategory(category: string) {
    this.modalService.closeLogin();
    this.showMobileSearch = false;
    this.router.navigate(['/products'], {
      queryParams: { category: category }
    });
  }


  get mobileMenuItems(): MenuItem[] {
    return [
      { label: 'Inicio', icon: 'pi pi-home', routerLink: '/' },
      { label: 'Productos', icon: 'pi pi-list', routerLink: '/products' },
      {
        label: 'Categorías', icon: 'pi pi-tags',
        items: this.productService.categories().map(cat => ({
          label: cat.name,
          command: () => { this.viewCategory(cat.name); this.showMobileDrawer = false; }
        }))
      }
    ];
  }

  userMenuItems: MenuItem[] = [
    { label: 'Mi cuenta', icon: 'pi pi-user', routerLink: '/profile' },
    { label: 'Cerrar sesión', icon: 'pi pi-sign-out', command: () => this.logout() }
  ];

  guestMenuItems: MenuItem[] = [
    { label: 'Iniciar Sesión', icon: 'pi pi-sign-in', routerLink: '/login', command: () => { this.showMobileDrawer = false; } },
    { label: 'Registrarse', icon: 'pi pi-user-plus', routerLink: '/register', command: () => { this.showMobileDrawer = false; } }
  ];

  goToProductsSearch() {
    this.modalService.closeLogin();
    this.showMobileSearch = false;
    if (this.searchQuery && this.searchQuery.trim()) {
      this.router.navigate(['/products'], { queryParams: { search: this.searchQuery, category: undefined, page: 1 } });
    } else {
      this.router.navigate(['/products']);
    }
  }

  get cartLoading(): boolean {
    return !!this.cartService.loading();
  }

  get wishlistLoading(): boolean {
    return !!this.wishlistService.loading();
  }

  // Cambia el handler del botón para que solo abra el drawer si no está abierto
  openMobileDrawer() {
    this.showMobileDrawer = true;
  }
}
