import { Component, signal, inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './forgot-password.component.html',
})
export class ForgotPasswordComponent {
  email = '';
  loading = signal(false);
  success = signal('');
  error = signal('');
  emailTouched = false;

  get emailInvalid() {
    // Validar formato de email simple
    return !this.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(this.email);
  }

  onEmailBlur() {
    this.emailTouched = true;
  }

  private authService = inject(AuthService);

  validateForm(): boolean {
    if (!this.email) {
      this.error.set('Por favor ingresa tu correo electrónico');
      return false;
    }
    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!emailRegex.test(this.email)) {
      this.error.set('Por favor ingresa un correo electrónico válido');
      return false;
    }
    this.error.set('');
    return true;
  }

  async onSubmit() {
    this.success.set('');
    this.error.set('');
    this.emailTouched = true;
    if (!this.validateForm()) {
      return;
    }
    this.loading.set(true);
    try {
      await this.authService.resetPassword(this.email);
      this.success.set('Se ha enviado un correo para restablecer tu contraseña.');
      this.email = '';
      this.emailTouched = false;
    } catch (err: unknown) {
      let msg = 'Error al enviar el correo.';
      if (err && typeof err === 'object' && 'message' in err && typeof (err as any).message === 'string') {
        msg = (err as any).message;
      }
      this.error.set(msg);
    } finally {
      this.loading.set(false);
    }
  }
} 