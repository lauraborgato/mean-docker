import { PostService } from '../../service/post.service';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Post } from '../../model/post.model';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent implements OnInit {

  constructor(private postService: PostService) { }

  ngOnInit() {
  }

  onAddPost(newPost: NgForm) {
    if (newPost.invalid) {
      return;
    }
    const post: Post = {
      id: null,
      postTitle: newPost.value.postTitle,
      postContent: newPost.value.postContent
    };

    this.postService.addPost(post);

    newPost.resetForm();
  }
}
