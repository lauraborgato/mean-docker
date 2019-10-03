import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Post } from '../model/post.model';
import { environment } from '../../environments/environment';


@Injectable({ providedIn: 'root' })
export class PostService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{ posts: Post[], amountPost: number }>();

  constructor(private httpClient: HttpClient, private router: Router) { }

  getPosts(postPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postPerPage}&page=${currentPage}`;
    this.httpClient.get<{ messages: string, posts: any, amountPost: number }>(`${environment.apiUrl}posts${queryParams}`)
      .pipe(map(postData => {
        return {
          posts: postData.posts.map(post => {
            return {
              postTitle: post.postTitle,
              postContent: post.postContent,
              id: post._id,
              imagePath: post.imagePath,
              userId: post.userId
            };
          }),
          amountPost: postData.amountPost
        };
      }))
      .subscribe((mapPost) => {
        this.posts = mapPost.posts;
        this.postsUpdated.next({ posts: this.posts.slice(), amountPost: mapPost.amountPost });
      });
  }

  addPost(id: string, postTitle: string, postContent: string, postImage: File) {
    const postData = new FormData();
    postData.append('postTitle', postTitle);
    postData.append('postContent', postContent);
    postData.append('postImage', postImage, postTitle);
    this.httpClient.post<{ message: string, post: Post }>(`${environment.apiUrl}posts`, postData)
      .subscribe(() => {
        this.router.navigate(['/']);
      });
  }

  deletePost(id: string) {
    return this.httpClient.delete<{ message: string }>(`${environment.apiUrl}posts/${id}`);
  }

  getPostUpdatedListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    return this.httpClient.get<{ _id: string, postTitle: string, postContent: string, imagePath: string, userId: string }>
      (`${environment.apiUrl}posts/${id}`);
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
        imagePath: postImage,
        userId: null
      };
    }
    this.httpClient.put<{ message: string, post: Post }>(`${environment.apiUrl}posts/${id}`, postData)
      .subscribe(() => {
        this.router.navigate(['/']);
      });
  }

}
