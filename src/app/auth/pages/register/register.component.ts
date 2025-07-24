import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { AuthService } from '../../../core/services/auth.service';
import { Timestamp } from 'firebase/firestore';
import { UserProfile } from '../../../core/models/user-profile.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    CardModule,
    RouterLink
  ],
  standalone: true,
})
export class RegisterComponent {
  // Personal Information
  firstName = '';
  lastName = '';
  email = '';
  phone = '';
  dateOfBirth: Date | null = null;

  // Account Information
  password = '';
  confirmPassword = '';

  // Additional Information
  gender = '';
  newsletter = false;
  termsAccepted = false;

  // UI State
  error = '';
  loading = false;

  // Options for dropdowns
  genderOptions = [
    { label: 'Seleccionar género', value: '' },
    { label: 'Masculino', value: 'male' },
    { label: 'Femenino', value: 'female' },
    { label: 'No binario', value: 'non-binary' },
    { label: 'Prefiero no decir', value: 'prefer-not-to-say' },
  ];

  showPassword = false;
  showConfirmPassword = false;

  authService = inject(AuthService);
  router = inject(Router);

  async register() {
    // Validation
    if (!this.validateForm()) {
      return;
    }

    this.loading = true;
    this.error = '';

    try {
      // Create user profile data
      //1999-07-07
      const userProfile = {
        firstName: this.firstName,
        lastName: this.lastName,
        phone: this.phone,
        dateOfBirth: this.dateOfBirth
          ? Timestamp.fromDate(new Date(this.dateOfBirth))
          : null,
        gender: this.gender,
        newsletter: this.newsletter,
        email: this.email,
        uid: '',
      } as UserProfile;

      // Register with Firebase and save profile in Firestore
      await this.authService.signUpAndSaveProfile(
        this.email,
        this.password,
        userProfile
      );
      this.router.navigate(['/']);
    } catch (error: unknown) {
      const errorMsg =
        error && typeof error === 'object' && 'message' in error
          ? (error as Error).message
          : 'Error al registrar usuario';
      this.error = errorMsg;
    } finally {
      this.loading = false;
    }
  }

  validateForm(): boolean {
    // Required fields
    if (
      !this.firstName ||
      !this.lastName ||
      !this.email ||
      !this.password ||
      !this.confirmPassword
    ) {
      this.error = 'Por favor completa todos los campos obligatorios';
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.error = 'Por favor ingresa un email válido';
      return false;
    }

    // Password validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
    if (!passwordRegex.test(this.password)) {
      this.error = 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.';
      return false;
    }
    if (this.password !== this.confirmPassword) {
      this.error = 'Las contraseñas no coinciden';
      return false;
    }

    // Phone validation (optional but if provided, validate format)
    if (this.phone && !/^[\d\s\-+()]+$/.test(this.phone)) {
      this.error = 'Por favor ingresa un número de teléfono válido';
      return false;
    }

    // Terms acceptance
    if (!this.termsAccepted) {
      this.error = 'Debes aceptar los términos y condiciones';
      return false;
    }

    this.error = '';
    return true;
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
