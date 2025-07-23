import { Component, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';
import { DividerModule } from 'primeng/divider';
import { AuthService } from '../../../core/services/auth.service';
import { CartService } from '../../../core/services/cart.service';
import { WishlistService } from '../../../core/services/wishlist.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { BadgeModule } from 'primeng/badge';
import { TabsModule } from 'primeng/tabs';
import { UserProfile } from '../../../core/models/user-profile.model';
import { Timestamp } from 'firebase/firestore';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    CardModule,
    AvatarModule,
    DividerModule,
    ProgressSpinnerModule,
    BadgeModule,
    TabsModule,
  ],
  standalone: true,
})
export class ProfileComponent {
  get user() {
    return this.authService.user();
  }
  get userProfile() {
    return this.authService.userProfile();
  }
  get globalLoading() {
    return (
      this.authService.isLoadingProfile ||
      this.authService.user() === undefined ||
      this.authService.userProfile() === undefined
    );
  }
  activeTab = 0;

  profileForm: UserProfile = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: Timestamp.fromDate(new Date()),
    gender: '',
    newsletter: false,
    uid: '',
    createdAt: Timestamp.fromDate(new Date()),
  };

  // Security form
  securityForm = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  };

  loading = false;
  message = '';
  messageType: 'success' | 'error' = 'success';

  // Declara el effect como campo de clase
  readonly profileEffect = effect(() => {
    const profile = this.userProfile;
    if (profile) {
      this.profileForm.firstName = profile.firstName || '';
      this.profileForm.lastName = profile.lastName || '';
      this.profileForm.phone = profile.phone || '';
      this.profileForm.dateOfBirth = profile.dateOfBirth || Timestamp.fromDate(new Date());
      this.profileForm.gender = profile.gender || '';
      this.profileForm.newsletter = profile.newsletter || false;
    }
    const user = this.user;
    this.profileForm.email = user?.email || '';
  });

  authService = inject(AuthService);
  cartService = inject(CartService);
  wishlistService = inject(WishlistService);
  router = inject(Router);

  setProfileForm() {
    const profile = this.userProfile;
    const user = this.user;
    this.profileForm = {
      uid: '',
      firstName: profile?.firstName || '',
      lastName: profile?.lastName || '',
      email: user?.email || '',
      phone: profile?.phone || '',
      dateOfBirth: profile?.dateOfBirth || Timestamp.fromDate(new Date()),
      gender: profile?.gender || '',
      newsletter: profile?.newsletter || false,
    };
  }

  async updateProfile() {
    this.loading = true;
    this.message = '';
    try {
      const user = this.user;
      if (!user) throw new Error('No hay usuario autenticado');
      await this.authService.updateUserProfile(user.uid, this.profileForm);
      this.message = 'Perfil actualizado correctamente';
      this.messageType = 'success';
      setTimeout(() => {
        this.message = '';
      }, 3000);
    } catch (error: unknown) {
      const errorMsg =
        error && typeof error === 'object' && 'message' in error
          ? (error as Error).message
          : 'Error al actualizar el perfil';
      this.message = errorMsg;
      this.messageType = 'error';
    } finally {
      this.loading = false;
    }
  }

  async updatePassword() {
    if (this.securityForm.newPassword !== this.securityForm.confirmPassword) {
      this.message = 'Las contraseñas no coinciden';
      this.messageType = 'error';
      return;
    }

    if (this.securityForm.newPassword.length < 6) {
      this.message = 'La nueva contraseña debe tener al menos 6 caracteres';
      this.messageType = 'error';
      return;
    }

    this.loading = true;
    this.message = '';

    try {
      await this.authService.updateUserPassword(
        this.securityForm.currentPassword,
        this.securityForm.newPassword
      );
      this.message = 'Contraseña actualizada correctamente';
      this.messageType = 'success';
      // Limpiar formulario
      this.securityForm = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      };
      setTimeout(() => {
        this.message = '';
      }, 3000);
    } catch (error: unknown) {
      const errorMsg =
        error && typeof error === 'object' && 'message' in error
          ? (error as Error).message
          : 'Error al actualizar la contraseña';
      this.message = errorMsg;
      this.messageType = 'error';
    } finally {
      this.loading = false;
    }
  }

  async logout() {
    try {
      await this.authService.signOut();
      this.router.navigate(['/']);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }

  get cartCount() {
    return this.cartService.getCartCount();
  }

  get wishlistCount() {
    return this.wishlistService.getWishlistCount();
  }

  getInitials(email: string): string {
    return email?.charAt(0)?.toUpperCase() || 'U';
  }
}
