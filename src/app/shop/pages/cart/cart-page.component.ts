import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartComponent } from '../../components/cart/cart.component';

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.component.html',
  imports: [
    CommonModule,
    CartComponent
  ],
  standalone: true
})
export class CartPageComponent {
  
} 