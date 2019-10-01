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
            id: post._id,
            imagePath: post.imagePath
          };
        });
      }))
      .subscribe((mapPost) => {
        this.posts = mapPost;
        this.postsUpdated.next(this.posts.slice());
      });
  }

  addPost(id: string, postTitle: string, postContent: string, postImage: File) {
    const postData = new FormData();
    postData.append('postTitle', postTitle);
    postData.append('postContent', postContent);
    postData.append('postImage', postImage, postTitle);
    this.httpClient.post<{ message: string, post: Post }>('http://localhost:3000/api/posts', postData)
      .subscribe((response) => {
        const newPost: Post = { ...response.post };
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
    return this.httpClient.get<{ _id: string, postTitle: string, postContent: string, imagePath: string }>
      (`http://localhost:3000/api/posts/${id}`);
  }

  updatePost(id: string, postTitle: string, postContent: string, postImage: File | string) {
    let postData: Post | FormData;
    if (typeof (postImage) === 'object') {
      postData = new FormData();
      postData.append('id', id);
      postData.append('postTitle', postTitle);
      postData.append('postContent', postContent);
      postData.append('postImage', postImage, postTitle);
    } else {
      postData = {
        id,
        postTitle,
        postContent,
        imagePath: postImage
      };
    }
    this.httpClient.put<{ message: string, post: Post}>(`http://localhost:3000/api/posts/${id}`, postData)
      .subscribe((response) => {
        const updatedPosts = this.posts.slice();
        const oldPostIndex = updatedPosts.findIndex(p => p.id === id);
        const post: Post = {
          id: response.post.id,
          postTitle: response.post.postTitle,
          postContent: response.post.postContent,
          imagePath: response.post.imagePath
        };
        updatedPosts[oldPostIndex] = post;
        this.posts = updatedPosts;
        this.postsUpdated.next(this.posts.slice());
        this.router.navigate(['/']);
      });
  }

}
