import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UserContextService {
  private userId: string | null = null;

  constructor() {
    this.userId = localStorage.getItem('userId');
  }

  setUser(id: string): void {
    this.userId = id;
    localStorage.setItem('userId', id);
  }

  getUser(): string | null {
    return this.userId;
  }

  clearUser(): void {
    this.userId = null;
    localStorage.removeItem('userId');
  }
}