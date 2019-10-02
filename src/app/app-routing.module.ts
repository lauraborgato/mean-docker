import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostListComponent } from './components/post-list/post-list.component';
import { CreatePostComponent } from './components/create-post/create-post.component';
import { LoginComponent } from './components/auth/login/login.component';
import { SingupComponent } from './components/auth/singup/singup.component';
import { AuthGuard } from './guard/auth.gurad';


const routes: Routes = [
  { path: '', component: PostListComponent },
  { path: 'create', component: CreatePostComponent, canActivate: [AuthGuard] },
  { path: 'edit/:postId', component: CreatePostComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'singup', component: SingupComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {

}
