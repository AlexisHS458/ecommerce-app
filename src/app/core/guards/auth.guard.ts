import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  private authService = inject(AuthService);
  private router = inject(Router);

  async canActivate(): Promise<boolean> {
    for (let i = 0; i < 20; i++) {
      if (this.authService.user() !== undefined) break;
      await new Promise(res => setTimeout(res, 50));
    }
    if (!this.authService.user()) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}