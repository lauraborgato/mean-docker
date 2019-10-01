import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  private authListener: Subscription;
  userAuth = false;
  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authListener = this.authService.getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userAuth = isAuthenticated;
      });
  }

  ngOnDestroy(){
    this.authListener.unsubscribe();
  }

}
