import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../../service/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-singup',
  templateUrl: './singup.component.html',
  styleUrls: ['./singup.component.css']
})
export class SingupComponent implements OnInit, OnDestroy {
  isLoading = false;
  private authSubsc: Subscription;
  constructor(private service: AuthService) { }

  ngOnInit() {
    this.authSubsc = this.service.getAuthStatusListener().subscribe(isAuthenticate => {
      this.isLoading = false;
    });
  }

  onSingUp(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.service.createUser(form.value.email, form.value.password);
  }

  ngOnDestroy() {
    this.authSubsc.unsubscribe();
  }

}
