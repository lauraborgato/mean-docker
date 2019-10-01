import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-singup',
  templateUrl: './singup.component.html',
  styleUrls: ['./singup.component.css']
})
export class SingupComponent implements OnInit {
  isLoading = false;
  constructor() { }

  ngOnInit() {
  }

  onSingUp(form: NgForm) {

  }

}
