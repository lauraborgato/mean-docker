import { Component, OnInit, OnDestroy } from '@angular/core';
import { PageEvent } from '@angular/material';
import { Subscription } from 'rxjs';

import { PostService } from '../../service/post.service';

import { Post } from '../../model/post.model';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  postlist: Post[] = [];
  postObservable: Subscription;
  isLoading = true;
  totalPost = 10;
  postPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  postAmountArray = [1, 2];
  userAuth = false;
  userId: string;
  private userAuthenticationListener: Subscription;

  constructor(private postService: PostService, private authService: AuthService) { }

  ngOnInit() {
    this.isLoading = true;

    this.postService.getPosts(this.postPerPage, this.currentPage);
    this.userId = this.authService.getUserId();

    this.postObservable = this.postService.getPostUpdatedListener()
      .subscribe((postData: { posts: Post[], amountPost: number }) => {
        this.isLoading = false;
        this.postlist = postData.posts;
        console.log(postData);
        this.totalPost = postData.amountPost;
      });

    this.userAuthenticationListener = this.authService.getAuthStatusListener()
      .subscribe(isAuthenticate => {
        this.userAuth = isAuthenticate;
        this.userId = this.authService.getUserId();
      });
    this.userAuth = this.authService.getIsAuth();
  }

  ngOnDestroy() {
    this.postObservable.unsubscribe();
    this.userAuthenticationListener.unsubscribe();
  }
  onDelete(id: string) {
    this.isLoading = true;
    this.setLoadingSkeleton();
    this.postService.deletePost(id)
      .subscribe(() => {
        this.postService.getPosts(this.postPerPage, this.currentPage);
      });
  }

  onChangePage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postPerPage = pageData.pageSize;
    this.setLoadingSkeleton();
    this.postService.getPosts(this.postPerPage, this.currentPage);
  }

  setLoadingSkeleton() {
    this.postAmountArray = [];
    for (let i = 0; i < this.postPerPage; i++) {
      this.postAmountArray.push(i);
    }
  }
}
