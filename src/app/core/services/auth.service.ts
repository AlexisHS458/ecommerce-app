import { inject, Injectable, signal } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User,
  updatePassword as fbUpdatePassword,
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Firestore, doc, setDoc, getDoc, updateDoc } from '@angular/fire/firestore';

export interface UserProfile {
  uid: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  newsletter?: boolean;
  createdAt?: Date | string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user = signal<User | undefined | null>(undefined);
  userProfile = signal<UserProfile | null>(null);
  loadingProfile = signal<boolean>(false);

  constructor() {
    this.auth.onAuthStateChanged(async (user) => {
      this.user.set(user ?? null);
      if (user) {
        this.loadingProfile.set(true);
        await this.fetchUserProfile(user.uid);
        this.loadingProfile.set(false);
      } else {
        this.userProfile.set(null);
        this.loadingProfile.set(false);
      }
    });
  }

  auth = inject(Auth);
  router = inject(Router);
  firestore = inject(Firestore);

  async signIn(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  async signUp(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  async signUpAndSaveProfile(email: string, password: string, profile: UserProfile) {
    const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
    const user = userCredential.user;
    // Guarda datos adicionales en Firestore
    // Avoid duplicate uid and email fields by spreading profile first, then overriding with correct values
    await setDoc(doc(this.firestore, `users/${user.uid}`), {
      ...profile,
      uid: user.uid,
      email: user.email,
      createdAt: new Date()
    });
    await this.fetchUserProfile(user.uid);
    return userCredential;
  }

  async fetchUserProfile(uid: string) {
    this.loadingProfile.set(true);
    const userDoc = await getDoc(doc(this.firestore, `users/${uid}`));
    if (userDoc.exists()) {
      this.userProfile.set(userDoc.data() as UserProfile);
    } else {
      this.userProfile.set(null);
    }
    this.loadingProfile.set(false);
  }

  async updateUserProfile(uid: string, profileUpdates: Partial<UserProfile>) {
    await updateDoc(doc(this.firestore, `users/${uid}`), profileUpdates);
    await this.fetchUserProfile(uid);
  }

  async updateUserPassword(currentPassword: string, newPassword: string) {
    const user = this.auth.currentUser;
    if (!user || !user.email) throw new Error('Usuario no autenticado');
    // Reautenticación
    await signInWithEmailAndPassword(this.auth, user.email, currentPassword);
    // Cambiar contraseña
    await fbUpdatePassword(user, newPassword);
  }

  async signOut() {
    return signOut(this.auth);
  }

  async isAuthenticated() {
    return this.auth.currentUser !== null;
  }

  get isLoadingProfile() {
    return this.loadingProfile();
  }
}
