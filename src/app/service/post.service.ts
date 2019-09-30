import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Post } from '../model/post.model';
import { HttpClient } from '@angular/common/http';


@Injectable({ providedIn: 'root' })
export class PostService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private httpClient: HttpClient) { }

  getPosts() {
    this.httpClient.get<{ messages: string, posts: Post[] }>('http://localhost:3000/api/posts')
      .subscribe((postData) => {
        this.posts = postData.posts;
        this.postsUpdated.next(this.posts.slice());
      });
  }

  addPost(newPost: Post) {
    this.httpClient.post<{ message: string }>('http://localhost:3000/api/posts', newPost)
      .subscribe((response) => {
        console.log(response.message);
        this.posts.push(newPost);
        this.postsUpdated.next(this.posts.slice());
      });
  }

  getPostUpdatedListener() {
    return this.postsUpdated.asObservable();
  }

}
