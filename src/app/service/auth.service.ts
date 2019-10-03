import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { AuthData } from '../model/auth.model';


@Injectable({ providedIn: 'root' })
export class AuthService {

  private token: string;
  private tokenTimer: NodeJS.Timer;
  private authStatusListener = new Subject<boolean>();
  private isAuthenticated = false;
  private userId: string;

  constructor(private httpClient: HttpClient, private router: Router) { }

  createUser(email: string, password: string) {
    const authData: AuthData = {
      email,
      password
    };
    this.httpClient.post('http://localhost:3000/api/user/singup', authData)
      .subscribe(response => {
        console.log(response);
        this.router.navigate(['/']);
      });
  }

  login(email: string, password: string) {
    const authData: AuthData = {
      email,
      password
    };
    this.httpClient.post<{ token: string, expiresIn: number, userId: string }>('http://localhost:3000/api/user/login', authData)
      .subscribe(response => {
        this.token = response.token;
        if (this.token) {
          this.setAuthTimer(response.expiresIn);
          this.authStatusListener.next(true);
          this.userId = response.userId;
          this.isAuthenticated = true;
          const now = new Date();
          const expirationDate = new Date(now.getTime() + response.expiresIn * 1000);
          this.saveAuthData(this.token, expirationDate, response.userId);
          this.router.navigate(['/']);
        }
        console.log(response);
      });
  }

  getToken() {
    return this.token;
  }

  getAuthStatusListener() {
    return this.authStatusListener;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getUserId() {
    return this.userId;
  }

  logOut() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.crearAuthData();
    this.userId = null;
    this.router.navigate(['/']);
  }

  autoAuthUser() {
    const information = this.getAuthData();
    if (!information) {
      return;
    }
    const now = new Date();
    const expiresIn = information.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = information.token;
      this.isAuthenticated = true;
      this.userId = information.userId;
      this.authStatusListener.next(true);
      this.setAuthTimer(expiresIn / 1000);
    }
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    if (!token || !expirationDate || !userId) {
      return;
    }
    return {
      token,
      expirationDate: new Date(expirationDate),
      userId
    };
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
  }

  private crearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }

  private setAuthTimer(tokenduration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logOut();
    }, tokenduration * 1000);
  }
}
