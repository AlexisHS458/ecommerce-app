import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { AuthService } from '../../../core/services/auth.service';
import { PasswordInputComponent } from '../../../shared/components/password-input/password-input.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    CardModule,
    RouterLink,
    PasswordInputComponent
  ],
  standalone: true
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';
  loading = false;


  authService = inject(AuthService);
  router = inject(Router);

  async login() {
    if (!this.email || !this.password) {
      this.error = 'Por favor completa todos los campos';
      return;
    }

    this.loading = true;
    this.error = '';

    try {
      await this.authService.signIn(this.email, this.password);
      this.router.navigate(['/']);
    } catch (error: unknown) {
      const errorMsg = (error && typeof error === 'object' && 'message' in error) ? (error as Error).message : 'Error desconocido';
      this.error = errorMsg;
    } finally {
      this.loading = false;
    }
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
} 