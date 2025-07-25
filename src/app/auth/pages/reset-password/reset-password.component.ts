import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  Auth,
  confirmPasswordReset,
  verifyPasswordResetCode,
} from '@angular/fire/auth';
import { PasswordInputComponent } from '../../../shared/components/password-input/password-input.component';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, PasswordInputComponent, ButtonModule],
  templateUrl: './reset-password.component.html',
})
export class ResetPasswordComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private auth = inject(Auth);

  password = '';
  confirmPassword = '';
  loading = signal(false);
  error = signal('');
  success = signal('');
  code: string | null = null;
  email: string | null = null;

  constructor() {
    this.route.queryParamMap.subscribe(async (params) => {
      this.code = params.get('oobCode');
      if (this.code) {
        try {
          this.email = await verifyPasswordResetCode(this.auth, this.code);
        } catch {
          this.error.set(
            'El enlace de recuperación no es válido o ha expirado.'
          );
        }
      } else {
        this.error.set('Código de recuperación no encontrado.');
      }
    });
  }

  validateForm(): boolean {
    if (!this.password || !this.confirmPassword) {
      this.error.set('Por favor completa ambos campos.');
      return false;
    }
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
    if (!passwordRegex.test(this.password)) {
      this.error.set(
        'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.'
      );
      return false;
    }
    if (this.password !== this.confirmPassword) {
      this.error.set('Las contraseñas no coinciden.');
      return false;
    }
    this.error.set('');
    return true;
  }

  async onSubmit() {
    this.success.set('');
    this.error.set('');
    if (!this.validateForm() || !this.code) return;
    this.loading.set(true);
    try {
      await confirmPasswordReset(this.auth, this.code, this.password);
      this.success.set(
        '¡Contraseña restablecida con éxito! Ahora puedes iniciar sesión.'
      );
      setTimeout(() => this.router.navigate(['/login']), 2000);
    } catch (err) {
      const errorMessage =
        err instanceof Error && err.message
          ? err.message
          : 'Error al restablecer la contraseña.';
      this.error.set(errorMessage);
    } finally {
      this.loading.set(false);
    }
  }
}
