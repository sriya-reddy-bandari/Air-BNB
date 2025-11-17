import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

   private readonly baseUrl = 'http://localhost:8085/api/auth'; // Backend base URL

  constructor(private readonly http: HttpClient) {}

  // ✅ Login API
  login(role: string, username: string, password: string): Observable<{ token: string }> {
    const url = `${this.baseUrl}/login_in/${role}`;
    const body = { username, password };
    return this.http.post<{ token: string }>(url, body);
  }

  // ✅ Signup API
  signUp(role: string, username: string, password: string): Observable<string> {
    const url = `${this.baseUrl}/sign_in/${role}`;
    const body = { username, password };
    return this.http.post(url, body, { responseType: 'text' });
  }

  // ✅ Save token to local storage
  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  // ✅ Get token from local storage
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // ✅ Logout
  logout(): void {
    localStorage.clear();
  }

   

}