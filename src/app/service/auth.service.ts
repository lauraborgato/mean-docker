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
    this.httpClient.post<{ token: string, expiresIn: number }>('http://localhost:3000/api/user/login', authData)
      .subscribe(response => {
        this.token = response.token;
        if (this.token) {
          const tokenduration = response.expiresIn;
          this.setAuthTimer(response.expiresIn);
          this.authStatusListener.next(true);
          this.isAuthenticated = true;
          const now = new Date();
          const expirationDate = new Date(now.getTime() + response.expiresIn * 1000);
          this.saveAuthData(this.token, expirationDate);
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

  logOut() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.crearAuthData();
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
      this.authStatusListener.next(true);
      this.setAuthTimer(expiresIn / 1000);
    }
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    if (!token || !expirationDate) {
      return;
    }
    return {
      token,
      expirationDate: new Date(expirationDate)
    };
  }

  private saveAuthData(token: string, expirationDate: Date) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
  }

  private crearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
  }

  private setAuthTimer(tokenduration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logOut();
    }, tokenduration * 1000);
  }
}
