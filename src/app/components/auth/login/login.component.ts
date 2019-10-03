import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../../service/auth.service';
import { logging } from 'protractor';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  isLoading = false;
  private authSubs: Subscription;
  constructor(private service: AuthService) { }

  ngOnInit() {
    this.authSubs = this.service.getAuthStatusListener().subscribe(authStatus => {
      this.isLoading = false;
    });
  }

  onLogin(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.service.login(form.value.email, form.value.password);
  }

  ngOnDestroy() {
    this.authSubs.unsubscribe();
  }
}
