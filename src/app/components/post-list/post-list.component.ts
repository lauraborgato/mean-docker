import { Component, OnInit, OnDestroy } from '@angular/core';
import { PageEvent } from '@angular/material';
import { Subscription } from 'rxjs';

import { PostService } from '../../service/post.service';

import { Post } from '../../model/post.model';

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

  constructor(private postService: PostService) { }

  ngOnInit() {
    this.isLoading = true;

    this.postService.getPosts(this.postPerPage, this.currentPage);

    this.postObservable = this.postService.getPostUpdatedListener()
      .subscribe((postData: { posts: Post[], amountPost: number }) => {
        this.isLoading = false;
        this.postlist = postData.posts;
        console.log(postData);
        this.totalPost = postData.amountPost;
      });
  }

  ngOnDestroy() {
    this.postObservable.unsubscribe();
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
