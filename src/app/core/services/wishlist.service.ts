import { Injectable, signal, inject } from '@angular/core';
import { Firestore, collection, doc, setDoc, getDocs, deleteDoc } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { Product } from '../models/product.model';
import { MessageService } from 'primeng/api';

export interface WishlistItem {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  category: string;
  rating: number;
  stock: number;
  discountPercentage?: number;
}

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  wishlistItems = signal<WishlistItem[]>([]);
  loading = signal<boolean>(false);
  private firestore = inject(Firestore);
  private authService = inject(AuthService);
  private messageService = inject(MessageService);

  async fetchWishlist() {
    this.loading.set(true);
    const user = this.authService.user();
    if (!user) return;
    const wishlistRef = collection(this.firestore, `users/${user.uid}/wishlist`);
    const snapshot = await getDocs(wishlistRef);
    this.wishlistItems.set(snapshot.docs.map(doc => ({ id: +doc.id, ...doc.data() } as WishlistItem)));
    this.loading.set(false);
  }

  async addToWishlist(product: Product) {
    this.loading.set(true);
    const user = this.authService.user();
    if (!user) {
      this.messageService.add({severity:'warn', summary:'Inicia sesión', detail:'Debes iniciar sesión para agregar productos a favoritos'});
      this.loading.set(false);
      return;
    }
    try {
      const safeProduct: Product = {
        ...product,
        thumbnail: product.thumbnail || '',
        category: product.category || '',
        rating: product.rating ?? 0
      };
      const wishlistRef = doc(this.firestore, `users/${user.uid}/wishlist/${safeProduct.id}`);
      await setDoc(wishlistRef, safeProduct, { merge: true });
      this.wishlistItems.set([...(this.wishlistItems() ?? []), safeProduct as WishlistItem]);
      this.messageService.add({severity:'success', summary:'Favorito agregado', detail:`${safeProduct.title} fue añadido a tu wishlist.`});
    } catch {
      this.messageService.add({severity:'error', summary:'Error', detail:'No se pudo agregar el producto a favoritos.'});
    } finally {
      this.loading.set(false);
    }
  }

  async removeFromWishlist(productId: number) {
    const user = this.authService.user();
    if (!user) {
      this.messageService.add({severity:'warn', summary:'Inicia sesión', detail:'Debes iniciar sesión para modificar tu lista de favoritos'});
      return;
    }
    try {
      const wishlistRef = doc(this.firestore, `users/${user.uid}/wishlist/${productId}`);
      await deleteDoc(wishlistRef);
      this.wishlistItems.set(this.wishlistItems().filter(item => item.id !== productId));
      this.messageService.add({severity:'info', summary:'Removido de favoritos', detail:'El producto fue removido de tu wishlist.'});
    } catch {
      this.messageService.add({severity:'error', summary:'Error', detail:'No se pudo eliminar el producto de favoritos.'});
    }
  }

  async clearWishlist() {
    const user = this.authService.user();
    if (!user) {
      this.messageService.add({severity:'warn', summary:'Inicia sesión', detail:'Debes iniciar sesión para modificar tu lista de favoritos'});
      return;
    }
    const wishlistRef = collection(this.firestore, `users/${user.uid}/wishlist`);
    const snapshot = await getDocs(wishlistRef);
    for (const docSnap of snapshot.docs) {
      await deleteDoc(docSnap.ref);
    }
    this.wishlistItems.set([]);
  }

  isInWishlist(productId: number): boolean {
    return this.wishlistItems().some(item => item.id === productId);
  }

  getWishlistCount(): number {
    return this.wishlistItems().length;
  }
} 