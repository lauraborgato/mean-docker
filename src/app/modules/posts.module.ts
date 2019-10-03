import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { CreatePostComponent } from '../components/create-post/create-post.component';
import { PostListComponent } from '../components/post-list/post-list.component';
import { AngularMaterialModule } from './angular-material.module';

@NgModule({
  declarations: [CreatePostComponent, PostListComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    RouterModule
  ]
})
export class PostsModule {}
