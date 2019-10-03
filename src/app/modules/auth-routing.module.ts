import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from '../components/auth/login/login.component';
import { SingupComponent } from '../components/auth/singup/singup.component';


const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'singup', component: SingupComponent }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {}
