import { PostService } from '../../service/post.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

import { Post } from '../../model/post.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  postlist: Post[] = [];
  postObservable: Subscription;
  isLoading = true;

  constructor(private postService: PostService) { }

  ngOnInit() {
    this.isLoading = true;

    this.postService.getPosts();

    this.postObservable = this.postService.getPostUpdatedListener()
      .subscribe((posts: Post[]) => {
        this.isLoading = false;
        this.postlist = posts;
      });
  }

  ngOnDestroy() {
    this.postObservable.unsubscribe();
  }
  onDelete(id: string) {
    this.postService.deletePost(id);
  }

}
