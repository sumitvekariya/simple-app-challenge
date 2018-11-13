import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../users/user.model';
import { Post } from '../posts/post.model';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  users = new BehaviorSubject<User[]>(this.getUsersFromLocalStorage());
  posts = new BehaviorSubject<Post[]>(this.getPostsFromLocalStorage());
  constructor(
    private sanitizer: DomSanitizer
  ) {
      this.users.subscribe(users => {
        console.log(users);
        localStorage.removeItem('users');
        localStorage.setItem('users', JSON.stringify(users));
      });

      this.posts.subscribe( posts => {
        console.log(posts);
        localStorage.removeItem('posts');
        localStorage.setItem('posts', JSON.stringify(posts));
      });
   }

  getUsers(): User[] {
    return this.users.value;
  }

  getUserById(id: number): User {
    return this.users.getValue().find( u => u.id === id);
  }

  getUsersFromLocalStorage() {
    const users = localStorage.getItem('users') ? JSON.parse(localStorage.getItem('users')) : [];
    return users && users.length > 0 ? users : [];
  }

  getPostsFromLocalStorage() {
    const posts = localStorage.getItem('posts') ? JSON.parse(localStorage.getItem('posts')) : [];
    posts.forEach(p => {
      if (p.text && p.text.changingThisBreaksApplicationSecurity) {
        p.text = p.text.changingThisBreaksApplicationSecurity;
      }
      p.text = this.sanitizer.bypassSecurityTrustHtml(p.text);
    });
    return posts && posts.length > 0 ? posts : [];
  }

  getPosts(): Post[] {
    return this.posts.getValue();
  }
}
