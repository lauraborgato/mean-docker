import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { PostService } from '../../service/post.service';
import { Post } from '../../model/post.model';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent implements OnInit {
  private mode = 'create';
  private postId: string;
  post: Post;
  constructor(private postService: PostService, public route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.postService.getPost(this.postId).subscribe(post => {
          this.post = { id: post._id, postContent: post.postContent, postTitle: post.postTitle};
        });
      } else {
        this.mode = 'create';
        this.postId = null;
        this.post = null;
      }
    });
  }

  onSavePost(newPost: NgForm) {
    if (newPost.invalid) {
      return;
    }
    if (this.mode === 'create') {
      const post: Post = {
        id: null,
        postTitle: newPost.value.postTitle,
        postContent: newPost.value.postContent
      };

      this.postService.addPost(post);
    } else {
      console.log('edition');
      const post: Post = {
        id: this.postId,
        postTitle: newPost.value.postTitle,
        postContent: newPost.value.postContent
      };
      this.postService.updatePost(post);
    }


    newPost.resetForm();
  }
}
