import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../models/product.model';
import { MessageService } from 'primeng/api';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Category } from '../models/category.model';
import { environment } from '../../../../environments/enviroments';


@Injectable({ providedIn: 'root' })
export class ProductService {
  products = signal<Product[]>([]);
  categories = signal<Category[]>([]);
  totalProducts = signal<number>(0);
  loading = signal<boolean>(false);
  loadingCategories = signal<boolean>(false);

  private http = inject(HttpClient);
  private messageService = inject(MessageService);

  // Mapa de iconos PrimeNG por slug
  private categoryIcons: Record<string, string> = {
    beauty: 'pi pi-star',
    fragrances: 'pi pi-sun',
    furniture: 'pi pi-table',
    groceries: 'pi pi-shopping-bag',
    'home-decoration': 'pi pi-home',
    'kitchen-accessories': 'pi pi-inbox',
    laptops: 'pi pi-desktop',
    'mens-shirts': 'pi pi-user',
    'mens-shoes': 'pi pi-shopping-bag',
    'mens-watches': 'pi pi-clock',
    'mobile-accessories': 'pi pi-mobile',
    motorcycle: 'pi pi-car',
    'skin-care': 'pi pi-heart',
    smartphones: 'pi pi-mobile',
    'sports-accessories': 'pi pi-bolt',
    sunglasses: 'pi pi-eye',
    tablets: 'pi pi-tablet',
    tops: 'pi pi-user',
    vehicle: 'pi pi-car',
    'womens-bags': 'pi pi-briefcase',
    'womens-dresses': 'pi pi-user',
    'womens-jewellery': 'pi pi-gem',
    'womens-shoes': 'pi pi-shopping-bag',
    'womens-watches': 'pi pi-clock',
  };

  getCategoryIcon(slug: string): string {
    return this.categoryIcons[slug] || 'pi pi-tag';
  }

  fetchProducts({
    limit = 12,
    skip = 0,
    category = '',
    search = '',
    sortBy = '',
    order = '',
  }: {
    limit?: number;
    skip?: number;
    category?: string;
    search?: string;
    sortBy?: string;
    order?: string;
  } = {}) {
    this.loading.set(true);
    let url = `${environment.apiUrl}/products?limit=${limit}&skip=${skip}&select=id,title,price,thumbnail,category,description,discountPercentage,rating,stock,images,reviews`;
    if (category) {
      url = `${environment.apiUrl}/products/category/${encodeURIComponent(category)}?limit=${limit}&skip=${skip}&select=id,title,price,thumbnail,category,description,discountPercentage,rating,stock,images,reviews`;
    }
    if (search) {
      url = `${environment.apiUrl}/products/search?q=${encodeURIComponent(search)}&limit=${limit}&skip=${skip}&select=id,title,price,thumbnail,category,description,discountPercentage,rating,stock,images,reviews`;
    }
    // Agregar ordenamiento si está presente y soportado
    if (sortBy) {
      url += `&sortBy=${sortBy}`;
      if (order) {
        url += `&order=${order}`;
      }
    }
    this.http.get<{ products: Product[]; total: number }>(url).subscribe({
      next: (response) => {
        this.products.set(response.products || []);
        this.totalProducts.set(
          response.total || (response.products ? response.products.length : 0)
        );
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error fetching products:', error);
        this.products.set([]);
        this.totalProducts.set(0);
        this.loading.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail:
            'No se pudieron cargar los productos. Intenta de nuevo más tarde.',
        });
      },
    });
  }

  getCategories() {
    if (this.categories().length > 0) return;
    this.loadingCategories.set(true);
    this.http
      .get<
        {
          slug: string;
          name: string;
          url: string;
        }[]
      >(`${environment.apiUrl}/products/categories`)
      .subscribe({
        next: (response) => {
          // Agrega el icono SVG a cada categoría
          const categoriesWithIcon = response.map((category) => ({
            ...category,
            icon: this.getCategoryIcon(category.slug),
          }));
          this.categories.set(categoriesWithIcon);
        },
        error: (error) => {
          console.error('Error fetching categories:', error);
          this.categories.set([]);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail:
              'No se pudieron cargar las categorías. Intenta de nuevo más tarde.',
          });
        },
        complete: () => {
          this.loadingCategories.set(false);
        },
      });
  }

  getProductById(id: number | string) {
    return this.http
      .get<Product>(
        `${environment.apiUrl}/products/${id}?select=id,title,price,thumbnail,category,description,discountPercentage,rating,stock,images,reviews`
      )
      .pipe(
        catchError((error) => {
          console.error('Error fetching product by ID:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail:
              'No se pudo cargar el producto. Intenta de nuevo más tarde.',
          });
          return throwError(() => error);
        })
      );
  }
}
