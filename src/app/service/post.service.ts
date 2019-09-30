import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Post } from '../model/post.model';


@Injectable({ providedIn: 'root' })
export class PostService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private httpClient: HttpClient, private router: Router) { }

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
        newPost.id = response.id;
        this.posts.push(newPost);
        this.postsUpdated.next(this.posts.slice());
        this.router.navigate(['/']);
      });
  }

  deletePost(id: string) {
    this.httpClient.delete<{ message: string }>(`http://localhost:3000/api/posts/${id}`)
      .subscribe((response) => {
        this.posts = this.posts.filter(post => post.id !== id);
        this.postsUpdated.next(this.posts.slice());
      });
  }

  getPostUpdatedListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    return this.httpClient.get<{ _id: string, postTitle: string, postContent: string }>(`http://localhost:3000/api/posts/${id}`);
  }

  updatePost(post: Post) {
    this.httpClient.put<{ message: string }>(`http://localhost:3000/api/posts/${post.id}`, post)
      .subscribe((response) => {
        const updatedPosts = this.posts.slice();
        const oldPostIndex = updatedPosts.findIndex(p => p.id === post.id);
        updatedPosts[oldPostIndex] = post;
        this.posts = updatedPosts;
        this.postsUpdated.next(this.posts.slice());
        this.router.navigate(['/']);
      });
  }

}
