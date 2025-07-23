import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselModule } from 'primeng/carousel';
import { CardModule } from 'primeng/card';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-home-categories-carousel',
  standalone: true,
  imports: [CommonModule, CarouselModule, CardModule, ProgressSpinnerModule],
  template: `
    <div class="mb-10 bg-white rounded-xl shadow-lg border-2 border-blue-100 md:p-8 py-8">
      <h2 class="text-2xl font-bold text-blue-800 mb-6 text-center">Categorías</h2>
      <div *ngIf="loading" class="flex justify-center items-center py-12">
        <p-progressSpinner styleClass="w-12 h-12" strokeWidth="4"></p-progressSpinner>
      </div>
      <p-carousel 
        *ngIf="!loading"
        [value]="categories" 
        [numVisible]="6" 
        [numScroll]="2"
        [circular]="true"
        [autoplayInterval]="0"
        [showNavigators]="true"
        [showIndicators]="false"
        class="categories-carousel"
        style="gap: 0;"
        itemStyleClass="px-2 md:px-4 min-h-[180px] md:min-h-[200px]"
        [responsiveOptions]="[
          { breakpoint: '1200px', numVisible: 5, numScroll: 1 },
          { breakpoint: '992px', numVisible: 2, numScroll: 2 },
          { breakpoint: '768px', numVisible: 1, numScroll: 1 }
        ]"
      >
        <ng-template let-category pTemplate="item">
          <div class="product-card-wrapper max-w-[90vw] mx-auto h-full min-h-[200px] flex justify-center items-center px-2 md:px-6 lg:px-8 py-4">
            <p-card (click)="viewCategory.emit(category.slug)" styleClass="category-card cursor-pointer hover:border-blue-500 hover:shadow-2xl hover:scale-105 transition-all duration-200 h-full bg-white rounded-xl flex flex-col items-center justify-center px-3 md:px-6 border border-blue-100 text-center">
              <div class="w-16 h-16 bg-blue-200 rounded-full flex items-center justify-center mb-4 shadow mx-auto">
                <i [ngClass]="category.icon" class="text-2xl text-blue-700"></i>
              </div>
              <h3 class="text-base font-semibold text-blue-800 mb-1 text-center min-h-[2.5rem]">{{ category.name }}</h3>
              <p class="text-xs text-blue-500">Ver productos</p>
            </p-card>
          </div>
        </ng-template>
      </p-carousel>
    </div>
  `
})
export class HomeCategoriesCarouselComponent {
  @Input() categories: { slug: string; name: string; url: string }[] = [];
  @Input() loading = false;
  @Output() viewCategory = new EventEmitter<string>();
} 