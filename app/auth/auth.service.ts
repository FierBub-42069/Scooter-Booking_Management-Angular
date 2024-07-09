import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  login(username: string, password: string): boolean {
    if (username === 'admin' && password === 'Pass123$') {
      localStorage.setItem('admin', 'true');
      return true;
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem('admin');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('admin');
  }
}