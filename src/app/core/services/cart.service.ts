import { Injectable, signal, inject } from '@angular/core';
import { Firestore, collection, doc, setDoc, getDocs, deleteDoc, updateDoc } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { Product } from '../models/product.model';
import { MessageService } from 'primeng/api';

export interface CartItem {
  id: number;
  title: string;
  price: number;
  quantity: number;
  thumbnail: string;
  category: string;
  discountPercentage?: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cartItems = signal<CartItem[] | undefined>(undefined);
  loading = signal<boolean>(false);
  private firestore = inject(Firestore);
  private authService = inject(AuthService);
  private messageService = inject(MessageService);

  async fetchCart() {
    this.loading.set(true);
    const user = this.authService.user();
    if (!user) {
      this.loading.set(false);
      this.cartItems.set([]);
      return;
    }
    const cartRef = collection(this.firestore, `users/${user.uid}/cart`);
    const snapshot = await getDocs(cartRef);
    this.cartItems.set(snapshot.docs.map(doc => ({ id: +doc.id, ...doc.data() } as CartItem)));
    this.loading.set(false);
  }

  async addToCart(product: Product, quantity = 1) {
    const user = this.authService.user();
    if (!user) {
      this.messageService.add({severity:'warn', summary:'Inicia sesión', detail:'Debes iniciar sesión para agregar productos al carrito'});
      return;
    }
    if(quantity > (product.stock ?? 0)) {
      this.messageService.add({severity:'error', summary:'Error', detail:'No hay suficiente stock disponible.'});
      return;
    }
    try {
      // Garantiza que thumbnail y category siempre estén presentes
      const safeProduct: Product = {
        ...product,
        thumbnail: product.thumbnail || '',
        category: product.category || ''
      };
      const cartRef = doc(this.firestore, `users/${user.uid}/cart/${safeProduct.id}`);
      const existing = this.cartItems()?.find(item => item.id === safeProduct.id);
      const newQuantity = existing ? existing.quantity + quantity : quantity;
      await setDoc(cartRef, { ...safeProduct, quantity: newQuantity }, { merge: true });
      if (existing) {
        this.cartItems.set(this.cartItems()?.map(item => item.id === safeProduct.id ? { ...item, quantity: newQuantity } : item));
      } else {
        this.cartItems.set([...(this.cartItems() ?? []), { ...safeProduct, quantity: newQuantity }]);
      }
      this.messageService.add({severity:'success', summary:'¡Producto agregado!', detail:`${safeProduct.title} fue agregado a tu carrito.`});
    } catch {
      this.messageService.add({severity:'error', summary:'Error', detail:'No se pudo agregar el producto al carrito.'});
    }
  }

  async removeFromCart(productId: number) {
    const user = this.authService.user();
    if (!user) {
      this.messageService.add({severity:'warn', summary:'Inicia sesión', detail:'Debes iniciar sesión para modificar el carrito'});
      return;
    }
    try {
      const cartRef = doc(this.firestore, `users/${user.uid}/cart/${productId}`);
      await deleteDoc(cartRef);
      this.cartItems.set(this.cartItems()?.filter(item => item.id !== productId));
      this.messageService.add({severity:'info', summary:'Producto eliminado', detail:'El producto fue eliminado del carrito.'});
    } catch {
      this.messageService.add({severity:'error', summary:'Error', detail:'No se pudo eliminar el producto del carrito.'});
    }
  }

  async updateQuantity(productId: number, quantity: number) {
    const user = this.authService.user();
    if (!user) {
      this.messageService.add({severity:'warn', summary:'Inicia sesión', detail:'Debes iniciar sesión para modificar el carrito'});
      return;
    }
    if (quantity <= 0) {
      await this.removeFromCart(productId);
      return;
    }
    const cartRef = doc(this.firestore, `users/${user.uid}/cart/${productId}`);
    await updateDoc(cartRef, { quantity });
    this.cartItems.set(this.cartItems()?.map(item => item.id === productId ? { ...item, quantity } : item));
  }

  async clearCart() {
    const user = this.authService.user();
    if (!user) {
      this.messageService.add({severity:'warn', summary:'Inicia sesión', detail:'Debes iniciar sesión para modificar el carrito'});
      return;
    }
    this.loading.set(true);
    const cartRef = collection(this.firestore, `users/${user.uid}/cart`);
    const snapshot = await getDocs(cartRef);
    for (const docSnap of snapshot.docs) {
      await deleteDoc(docSnap.ref);
    }
    this.cartItems.set([]);
    this.loading.set(false);
  }

  getCartTotal(): number {
    return this.cartItems()?.reduce((total, item) => {
      const price = item.discountPercentage 
        ? item.price * (1 - item.discountPercentage / 100)
        : item.price;
      return total + (price * item.quantity);
    }, 0) || 0;
  }

  getCartCount(): number {
    return this.cartItems()?.reduce((count, item) => count + item.quantity, 0) || 0;
  }

  isInCart(productId: number): boolean {
    return this.cartItems()?.some(item => item.id === productId) || false;
  }
}