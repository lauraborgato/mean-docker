import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthData } from '../model/auth.model';
import { formArrayNameProvider } from '@angular/forms/src/directives/reactive_directives/form_group_name';


@Injectable({ providedIn: 'root' })
export class AuthService {

  private token: string;
  private authStatusListener = new Subject<boolean>();
  private isAuthenticated = false;

  constructor(private httpClient: HttpClient, private router: Router) { }

  createUser(email: string, password: string) {
    const authData: AuthData = {
      email,
      password
    }
    this.httpClient.post('http://localhost:3000/api/user/singup', authData)
      .subscribe(response => {
        console.log(response);
      });
  }

  login(email: string, password: string) {
    const authData: AuthData = {
      email,
      password
    };
    this.httpClient.post<{ token: string }>('http://localhost:3000/api/user/login', authData)
      .subscribe(response => {
        this.token = response.token;
        if (this.token) {
          this.authStatusListener.next(true);
          this.isAuthenticated = true;
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
}
