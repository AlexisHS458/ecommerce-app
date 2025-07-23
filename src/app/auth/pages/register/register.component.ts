import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    CardModule
  ],
  standalone: true
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
    { label: 'Prefiero no decir', value: 'prefer-not-to-say' }
  ];


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
      const userProfile = {
        firstName: this.firstName,
        lastName: this.lastName,
        phone: this.phone,
        dateOfBirth: this.dateOfBirth ? this.dateOfBirth.toISOString().split('T')[0] : undefined,
        gender: this.gender,
        newsletter: this.newsletter,
        email: this.email,
        uid: ''       
      };

      // Register with Firebase and save profile in Firestore
      await this.authService.signUpAndSaveProfile(this.email, this.password, userProfile);
      this.router.navigate(['/']);
    } catch (error: unknown) {
      const errorMsg = (error && typeof error === 'object' && 'message' in error) ? (error as Error).message : 'Error al registrar usuario';
      this.error = errorMsg;
    } finally {
      this.loading = false;
    }
  }

  validateForm(): boolean {
    // Required fields
    if (!this.firstName || !this.lastName || !this.email || !this.password || !this.confirmPassword) {
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
    if (this.password.length < 6) {
      this.error = 'La contraseña debe tener al menos 6 caracteres';
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