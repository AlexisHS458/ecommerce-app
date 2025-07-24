import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-home-hero',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  template: `
    <div class="mb-8 rounded-xl bg-blue-50 py-12 px-4 text-center shadow">
      <h1 class="text-4xl font-extrabold text-blue-700 mb-4">¡Bienvenido a Ecommerce!</h1>
      <p class="text-lg text-gray-700 mb-8">Descubre los mejores productos, ofertas y novedades.<br><span class="text-blue-500 font-semibold">¡Tu próxima compra favorita está aquí!</span></p>
      <p-button 
        label="Explorar productos"
        icon="pi pi-arrow-right"
        styleClass="btn-primary h-14"
        (onClick)="explore.emit()"
      ></p-button>
    </div>
  `
})
export class HomeHeroComponent {
  @Output() explore = new EventEmitter<void>();
} 