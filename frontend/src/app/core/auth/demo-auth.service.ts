import { Injectable, computed, signal } from '@angular/core';
import { User } from '../models';

const STORAGE_KEY = 'spesenportal.demoUser';

/** Demo-Login (ADR-0004): merkt sich den gewählten Nutzer im localStorage. */
@Injectable({ providedIn: 'root' })
export class DemoAuthService {
  private readonly user = signal<User | null>(this.restore());

  readonly currentUser = this.user.asReadonly();
  readonly isLoggedIn = computed(() => this.user() !== null);

  login(user: User): void {
    this.user.set(user);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  }

  logout(): void {
    this.user.set(null);
    localStorage.removeItem(STORAGE_KEY);
  }

  private restore(): User | null {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  }
}
