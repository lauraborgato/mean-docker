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

  constructor(private postService: PostService) { }

  ngOnInit() {
    this.postService.getPosts();

    this.postObservable = this.postService.getPostUpdatedListener()
      .subscribe((posts: Post[]) => {
        this.postlist = posts;
      });
  }

  ngOnDestroy(){
    this.postObservable.unsubscribe();
  }

}
