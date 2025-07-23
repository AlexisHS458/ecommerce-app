import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { User } from '@angular/fire/auth';
import { UserProfile } from '../../../core/services/auth.service';

@Component({
  selector: 'app-user-menu',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonModule, AvatarModule],
  template: `
    <div class="relative" tabindex="0">
      <button (click)="menuOpen = !menuOpen" class="flex items-center gap-2 focus:outline-none" aria-haspopup="true" [attr.aria-expanded]="menuOpen">
        <p-avatar 
          styleClass="w-9 h-9 bg-white border-2 border-blue-400 shadow"
        >
          <span class="text-blue-700 text-base font-bold">
            {{ getUserInitials(user) }}
          </span>
        </p-avatar>
        <span class="text-white text-base font-semibold hidden lg:block">
          <ng-container *ngIf="!profileLoading; else loadingName">
            {{ displayName }}
          </ng-container>
          <ng-template #loadingName>
            <span class="inline-block w-24 h-4 bg-blue-300/40 rounded animate-pulse"></span>
          </ng-template>
        </span>
        <i class="pi pi-chevron-down text-white text-xs ml-1"></i>
      </button>
      <!-- Dropdown Menu -->
      <div *ngIf="menuOpen" class="absolute top-full right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50">
        <div class="py-2">
          <a routerLink="/profile" class="block px-4 py-2 text-sm text-blue-700 hover:bg-blue-50 flex items-center gap-2 transition-colors">
            <i class="pi pi-id-card"></i> Mi cuenta
          </a>
          <button
            (click)="logout.emit(); menuOpen = false"
            class="block w-full text-left px-4 py-2 text-sm text-blue-700 hover:bg-blue-50 flex items-center gap-2 transition-colors"
          >
            <i class="pi pi-sign-out"></i> Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  `
})
export class UserMenuComponent {
  @Input() user: User | null | undefined;
  @Input() userProfile!: UserProfile | null;
  @Input() displayName = '';
  @Input() getUserInitials: (user: User | null | undefined) => string = () => 'U';
  @Input() profileLoading = false;
  @Output() logout = new EventEmitter<void>();
  menuOpen = false;
} 