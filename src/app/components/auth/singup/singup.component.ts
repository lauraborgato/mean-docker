import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../../service/auth.service';

@Component({
  selector: 'app-singup',
  templateUrl: './singup.component.html',
  styleUrls: ['./singup.component.css']
})
export class SingupComponent implements OnInit {
  isLoading = false;
  constructor(private service: AuthService) { }

  ngOnInit() {
  }

  onSingUp(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.service.createUser(form.value.email, form.value.password);
  }

}
