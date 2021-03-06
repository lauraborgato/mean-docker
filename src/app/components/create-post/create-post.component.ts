import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';

import { PostService } from '../../service/post.service';
import { Post } from '../../model/post.model';
import { mimeType } from './mime-type.validator';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent implements OnInit, OnDestroy {
  private mode = 'create';
  private postId: string;
  post: Post;
  form: FormGroup;
  imagePreview;
  isLoading = false;
  private authStatusSub: Subscription;

  constructor(private postService: PostService, public route: ActivatedRoute, private authService: AuthService) { }

  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(isAuthenticate => {
      this.isLoading = false;
    });
    this.initializeForm();
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.postService.getPost(this.postId)
          .subscribe(post => {
            this.post = {
              id: post._id,
              postContent: post.postContent,
              postTitle: post.postTitle,
              imagePath: post.imagePath,
              userId: post.userId
            };
            this.form.setValue({
              postTitle: this.post.postTitle,
              postContent: this.post.postContent,
              postImage: this.post.imagePath
            });
          });
      } else {
        this.mode = 'create';
        this.postId = null;
        this.post = null;
      }
    });
  }

  onSavePost() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      this.postService.addPost(null, this.form.value.postTitle, this.form.value.postContent, this.form.value.postImage);
    } else {
      this.postService.updatePost(this.postId, this.form.value.postTitle, this.form.value.postContent, this.form.value.postImage);
    }


    this.form.reset();
  }

  initializeForm() {
    this.form = new FormGroup({
      postTitle: new FormControl(null, { validators: [Validators.required, Validators.minLength(3)] }),
      postContent: new FormControl(null, { validators: [Validators.required] }),
      postImage: new FormControl(null, { validators: [Validators.required], asyncValidators: [mimeType] })
    });
  }

  onImagePick(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ postImage: file });
    this.form.get('postImage').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    }
    reader.readAsDataURL(file);
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
