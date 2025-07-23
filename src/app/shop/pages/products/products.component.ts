import { Component, inject, OnInit } from '@angular/core';
import { ProductService } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';
import { WishlistService } from '../../../core/services/wishlist.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { CarouselModule } from 'primeng/carousel';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { RatingModule } from 'primeng/rating';
import { PaginatorModule } from 'primeng/paginator';
import { DividerModule } from 'primeng/divider';
import { ChipModule } from 'primeng/chip';
import { TooltipModule } from 'primeng/tooltip';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { PanelModule } from 'primeng/panel';
import { SplitButtonModule } from 'primeng/splitbutton';
import { MenuModule } from 'primeng/menu';
import { SelectModule } from 'primeng/select';    
import { Product } from '../../../core/models/product.model';
import { AuthService } from '../../../core/services/auth.service';


@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    CarouselModule,
    ProductCardComponent,
    InputTextModule,
    ButtonModule,
    CardModule,
    RatingModule,
    PaginatorModule,
    DividerModule,
    ChipModule,
    TooltipModule,
    ProgressSpinnerModule,
    PanelModule,
    SplitButtonModule,
    MenuModule,
    SelectModule,
  ],
  standalone: true
})
export class ProductsComponent implements OnInit {
  searchQuery = '';
  selectedCategory = '';
  priceRange: [number, number] = [0, 2000];
  selectedRating = 0;
  sortBy = 'name';
  viewMode: 'grid' | 'list' = 'grid';
  currentPage = 1;
  itemsPerPage = 12;
  showFilters = true;
  isMobile = false;
  addingToCart: Record<number, boolean> = {};
  addingToWishlist: Record<number, boolean> = {};
  removingFromWishlist: Record<number, boolean> = {};

  sortOptions = [
    { label: 'Nombre A-Z', value: 'title' },
    { label: 'Nombre Z-A', value: 'title-desc' },
    { label: 'Precio menor', value: 'price' },
    { label: 'Precio mayor', value: 'price-desc' },
    { label: 'Mejor rating', value: 'rating' },
    { label: 'Mayor descuento', value: 'discount' },
    { label: 'Más recientes', value: 'newest' }
  ];

  itemsPerPageOptions = [
    { label: '12', value: 12 },
    { label: '24', value: 24 },
    { label: '48', value: 48 }
  ];

  viewModeOptions = [
    {
      label: 'Vista Lista',
      icon: 'pi pi-list',
      command: () => this.viewMode = 'list'
    }
  ];
  

  productService = inject(ProductService);
  cartService = inject(CartService);
  wishlistService = inject(WishlistService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  authService = inject(AuthService);

  ngOnInit() {
    this.productService.getCategories();
    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['search'] || '';
      this.selectedCategory = params['category'] || '';
      this.currentPage = params['page'] ? parseInt(params['page'], 10) : 1;
      this.itemsPerPage = params['limit'] ? parseInt(params['limit'], 10) : 12;
      this.fetchProducts();
    });
  }

  get paginatedProducts() {
    return this.productService.products();
  }

  get totalPages() {
    return Math.ceil(this.productService.totalProducts() / this.itemsPerPage);
  }

  get loading() {
    return this.productService.loading();
  }

  fetchProducts() {
    const skip = (this.currentPage - 1) * this.itemsPerPage;
    let sortBy = '';
    let order = '';
    switch (this.sortBy) {
      case 'title':
        sortBy = 'title'; order = 'asc'; break;
      case 'title-desc':
        sortBy = 'title'; order = 'desc'; break;
      case 'price':
        sortBy = 'price'; order = 'asc'; break;
      case 'price-desc':
        sortBy = 'price'; order = 'desc'; break;
      case 'rating':
        sortBy = 'rating'; order = 'desc'; break;
      case 'discount':
        sortBy = 'discountPercentage'; order = 'desc'; break;
      case 'newest':
        sortBy = 'id'; order = 'desc'; break;
    }
    // Lógica condicional para endpoint correcto
    if (this.searchQuery) {
      // Solo búsqueda
      this.productService.fetchProducts({
        limit: this.itemsPerPage,
        skip,
        search: this.searchQuery,
        sortBy,
        order
      });
    } else if (this.selectedCategory) {
      // Solo categoría
      this.productService.fetchProducts({
        limit: this.itemsPerPage,
        skip,
        category: this.selectedCategory,
        sortBy,
        order
      });
    } else {
      // Todos los productos
      this.productService.fetchProducts({
        limit: this.itemsPerPage,
        skip,
        sortBy,
        order
      });
    }
  }

  onSearch() {
    this.currentPage = 1;
    this.updateUrlParams();
  }

  onFilterChange() {
    this.currentPage = 1;
    this.updateUrlParams();
  }

  onSortChange() {
    this.currentPage = 1;
    this.fetchProducts();
  }

  onItemsPerPageChange() {
    this.currentPage = 1;
    this.updateUrlParams();
  }

  onPrimeNgPageChange(event: { first: number; rows: number; page: number; pageCount: number }) {
    this.itemsPerPage = event.rows;
    this.currentPage = Math.floor(event.first / event.rows) + 1;
    this.updateUrlParams();
  }

  updateUrlParams() {
    const params: Record<string, unknown> = {};    
    if (this.searchQuery){
      params['search'] = this.searchQuery;
    } else {
      params['search'] = undefined; // Elimina el parámetro de la URL si está vacío
    }
    if (this.selectedCategory) {
      params['category'] = this.selectedCategory;
    } else {
      params['category'] = undefined; // Elimina el parámetro de la URL si está vacío
    }
    if (this.currentPage > 1) {
      params['page'] = this.currentPage;
    } else {
      params['page'] = 1; // Elimina el parámetro de la URL si está vacío
    }
    if (this.itemsPerPage !== 12) params['limit'] = this.itemsPerPage;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: params,
      queryParamsHandling: 'merge'
    });
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updateUrlParams();
    }
  }

  clearAllFilters() {
    this.searchQuery = '';
    this.selectedCategory = '';
    this.currentPage = 1;
    this.updateUrlParams();
  }

  clearSearch() {
    this.searchQuery = '';
    this.currentPage = 1;
    this.updateUrlParams();
  }

  clearCategory() {
    this.selectedCategory = '';
    this.currentPage = 1;
    this.updateUrlParams();
  }

  hasActiveFilters(): boolean {
    return !!(this.searchQuery || this.selectedCategory);
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

  async removeFromWishlist(productId: number) {
    this.removingFromWishlist[productId] = true;
    try {
      await this.wishlistService.removeFromWishlist(productId);
    } finally {
      this.removingFromWishlist[productId] = false;
    }
  }

  toggleFilters() {
    this.showFilters = !this.showFilters;
  }

  viewProduct(productId: number) {
    this.router.navigate(['/product', productId]);
  }


  getDiscountPrice(price: number, discountPercentage: number): number {
    if (!discountPercentage) return price;
    return price - (price * discountPercentage / 100);
  }

  getSortedProducts() {
    return this.productService.products();
  }

  get categoryOptions() {
    return [
      { label: 'Todas las categorías', value: '' },
      ...this.productService.categories().map(cat => ({ label: cat.name, value: cat.name }))
    ];
  }
} 