import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ProductsComponent } from './pages/products/products.component';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';
import { CartPageComponent } from './pages/cart/cart-page.component';
import { WishlistPageComponent } from './pages/wishlist/wishlist-page.component';

export const SHOP_ROUTES: Routes = [
  { path: '', component: HomeComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'product/:id', component: ProductDetailComponent },
  { path: 'cart', component: CartPageComponent },
  { path: 'wishlist', component: WishlistPageComponent }
]; 