import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { User } from '../model/user';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  

  private baseURL = "http://localhost:8080/api/v1/auth";
 
  private loginURL = "http://localhost:8080/api/v1/login";
  constructor(private httpClient: HttpClient) { }

  private token?: string | null
  getHeader():HttpHeaders{
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return headers;
  }
  postLogin(signInRequest: any): Observable<any> {
    return this.httpClient.post<any>(`${this.baseURL}/signin`, signInRequest)
  }

  validateToken(token: any): Observable<boolean> {
    return this.httpClient.post<any>(`${this.baseURL}/validate-token`, token)
  }

  getUsername() {
    this.token = this.getToken()
    if (!this.token) {
      return null
    }

    const payload = JSON.parse(atob(this.token.split('.')[1]))
    return payload.sub
  }

  getUserRole() {
    this.token = this.getToken()
    if (!this.token) {
      return null
    }

    const payload = JSON.parse(atob(this.token.split('.')[1]))
    return payload.role
  }

  getUserId(): any {
    this.token = this.getToken()
    if (!this.token) {
      return null
    }

    const payload = JSON.parse(atob(this.token.split('.')[1]))
    return payload.userId
  }

  b64DecodeUnicode(str: string) {
    return decodeURIComponent(atob(str).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  }

  getFullname(): any {
    this.token = this.getToken()
    if (!this.token) {
      return null
    }

    // const payload = JSON.parse(atob(this.token.split('.')[1]))
    /**
     * sử dụng hàm b64DecodeUnicode() custom để decode token base64 thành chuỗi UTF-8
     * mà hàm atob() không làm được  */
    const payload = JSON.parse(this.b64DecodeUnicode(this.token.split('.')[1]))
    return payload.fullname
  }

  setToken(token: string) {
    this.token = token
    localStorage.setItem('token', token)
  }

  getToken() {
    return localStorage.getItem('token')
  }

  logout() {
    localStorage.removeItem('token')
  }

  isLoggedIn(): boolean {
    if (this.getToken()) {
      return true 
    }
    return false
  }
  
  sendFogotPasswordRequest(email: string):  Observable<any>{
    
    const body = { email: email, code:Math.floor(Date.now() * 1000).toString(36)};
    return this.httpClient.post(`${this.loginURL}/foget-password`,
    body
    )
  }

  resetPassword(email: string, password: string):  Observable<any> {
    const body = { email: email, password:password};
    return this.httpClient.put(`${this.loginURL}/reset-password`,
    body
    );
  }
}
