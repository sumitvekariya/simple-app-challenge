import { Component, OnInit } from '@angular/core';
import { CommonService } from '../shared/common.service';
import { User } from './user.model';
import { AddUserDialogComponent } from './add-user-dialog/add-user-dialog.component';
import { MatDialog } from '@angular/material';
import { Post } from '../posts/post.model';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  usersList: User[];
  posts: Post[];
  constructor(public commonService: CommonService, public dialog: MatDialog) {
    this.commonService.users.subscribe(users => {
      this.usersList = users;
    });
  }

  ngOnInit() {
    this.posts = this.commonService.getPosts().slice();
  }

  updateUser(user) {
    console.log(user);
  }

  openAddUserDialog() {
    const dialogRef = this.dialog.open(AddUserDialogComponent, {
      width: '250px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const usersList = [...this.commonService.users.value];
        usersList.push(result.value);
        this.commonService.users.next(usersList);
      }
    });
  }

  editUser(key: string, index: number, text) {
    this.replaceMentions(key, index, text);

    this.commonService.posts.next(this.posts);
    this.usersList[index][key] = text;
    this.commonService.users.next(this.usersList);
  }

  removeUser(index: number) {
    this.usersList.splice(index, 1);
    this.commonService.users.next(this.usersList);
  }

  replaceMentions(key, index, text) {
    switch (key) {
      case 'name': {
      this.posts.forEach( p => {
        const replacableData = p.text.changingThisBreaksApplicationSecurity ? p.text.changingThisBreaksApplicationSecurity : p.text;
        p.text = replacableData.replace(
          ('<span class="ql-mention-denotation-char">@</span>' + this.usersList[index][key]),
          ('<span class="ql-mention-denotation-char">@</span>' + text));
      });
      this.commonService.posts.next(this.posts);
      break;
     }
      case 'number': {
        this.posts.forEach( p => {
          const replacableData = p.text.changingThisBreaksApplicationSecurity ? p.text.changingThisBreaksApplicationSecurity : p.text;
          p.text = replacableData.replace(
            ('<span class="ql-mention-denotation-char">#</span>' + this.usersList[index][key]),
            ('<span class="ql-mention-denotation-char">#</span>' + text));
        });
        this.commonService.posts.next(this.posts);
        break;
      }

    }

  }
}
