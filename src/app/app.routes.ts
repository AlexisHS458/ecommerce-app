import { Routes } from '@angular/router';
import { NotFoundComponent } from './not-found/not-found.component';
import { LoginComponent } from './auth/pages/login/login.component';
import { AuthGuard } from './core/guards/auth.guard';
import { ProfileComponent } from './auth/pages/profile/profile.component';

export const routes: Routes = [
    {
      path: '',
      loadChildren: () => import('./shop/shop.routes').then(m => m.SHOP_ROUTES)
    },
    { path: 'login', component: LoginComponent },
    { path: 'register', loadComponent: () => import('./auth/pages/register/register.component').then(m => m.RegisterComponent) },
    { path: 'profile', canActivate: [AuthGuard], component: ProfileComponent },
    { path: 'wishlist', canActivate: [AuthGuard], loadComponent: () => import('./shop/pages/wishlist/wishlist-page.component').then(m => m.WishlistPageComponent) },
    { path: 'cart', canActivate: [AuthGuard], loadComponent: () => import('./shop/pages/cart/cart-page.component').then(m => m.CartPageComponent) },
    { path: 'forgot-password', loadComponent: () => import('./auth/pages/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent) },
    { path: 'reset-password', loadComponent: () => import('./auth/pages/reset-password/reset-password.component').then(m => m.ResetPasswordComponent) },
    { path: '**', component: NotFoundComponent }
];
