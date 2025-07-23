import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ModalService {
  isLoginOpen = signal(false);

  openLogin() {
    this.isLoginOpen.set(true);
  }

  closeLogin() {
    this.isLoginOpen.set(false);
  }
}