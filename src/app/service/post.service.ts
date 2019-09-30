import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Post } from '../model/post.model';
import { HttpClient } from '@angular/common/http';


@Injectable({ providedIn: 'root' })
export class PostService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private httpClient: HttpClient) { }

  getPosts() {
    this.httpClient.get<{ messages: string, posts: any }>('http://localhost:3000/api/posts')
      .pipe(map(postData => {
        return postData.posts.map(post => {
          return {
            postTitle: post.postTitle,
            postContent: post.postContent,
            id: post._id
          };
        });
      }))
      .subscribe((mapPost) => {
        this.posts = mapPost;
        this.postsUpdated.next(this.posts.slice());
      });
  }

  addPost(newPost: Post) {
    this.httpClient.post<{ message: string, id: string }>('http://localhost:3000/api/posts', newPost)
      .subscribe((response) => {
        console.log(response.message);
        newPost.id = response.id;
        this.posts.push(newPost);
        this.postsUpdated.next(this.posts.slice());
      });
  }

  deletePost(id: string) {
    this.httpClient.delete<{ message: string }>(`http://localhost:3000/api/posts/${id}`)
    .subscribe((response) => {
      console.log(response.message);
      this.posts = this.posts.filter(post => post.id !== id);
      this.postsUpdated.next(this.posts.slice());
    });
  }

  getPostUpdatedListener() {
    return this.postsUpdated.asObservable();
  }

}
