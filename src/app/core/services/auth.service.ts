import { Injectable, signal } from '@angular/core';
import { Observable, of, delay, map } from 'rxjs';
import { User, LoginCredentials, AuthResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly STORAGE_KEY = 'auth_token';
  private readonly USER_KEY = 'current_user';
  
  private currentUser = signal<User | null>(null);

  constructor() {
    this.loadUserFromStorage();
  }

  login(credentials: LoginCredentials): Observable<AuthResponse> {
    return of(this.mockLogin(credentials)).pipe(
      delay(500),
      map(response => {
        this.setSession(response);
        return response;
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUser.set(null);
  }

  getCurrentUser(): User | null {
    return this.currentUser();
  }

  getCurrentUserSignal() {
    return this.currentUser.asReadonly();
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.STORAGE_KEY);
  }

  isAdmin(): boolean {
    const user = this.currentUser();
    return user?.role === 'admin';
  }

  getToken(): string | null {
    return localStorage.getItem(this.STORAGE_KEY);
  }

  private mockLogin(credentials: LoginCredentials): AuthResponse {
    const isAdmin = credentials.email.endsWith('@sdi.es');
    const mockToken = `mock_token_${Date.now()}`;
    
    const user: User = {
      id: '1',
      email: credentials.email,
      name: credentials.email.split('@')[0],
      role: isAdmin ? 'admin' : 'user'
    };

    return {
      token: mockToken,
      user
    };
  }

  private setSession(response: AuthResponse): void {
    localStorage.setItem(this.STORAGE_KEY, response.token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(response.user));
    this.currentUser.set(response.user);
  }

  private loadUserFromStorage(): void {
    const userStr = localStorage.getItem(this.USER_KEY);
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        this.currentUser.set(user);
      } catch (e) {
        this.logout();
      }
    }
  }
}
