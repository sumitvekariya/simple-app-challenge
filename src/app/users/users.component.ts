import { Component, OnInit } from '@angular/core';
import { CommonService } from '../shared/common.service';
import { User } from './user.model';
import { AddUserDialogComponent } from './add-user-dialog/add-user-dialog.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  usersList: User[];
  constructor(public commonService: CommonService, public dialog: MatDialog) {
    this.commonService.users.subscribe(users => {
      this.usersList = users;
    });
  }

  ngOnInit() {}

  addUser() {
    // console.log(this.userForm.value);
    // const usersList = [...this.commonService.users.value];
    // usersList.push(this.userForm.value);
    // this.commonService.users.next(usersList);
    // this.userForm.reset();
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
        localStorage.setItem('users', JSON.stringify(usersList));
      }
    });
  }

  editUser(key: string, index: number, text: string) {
    console.log(key, index, text);
    this.usersList[index][key] = text;
    this.commonService.users.next(this.usersList);
  }

  removeUser(index: number) {
    this.usersList.splice(index, 1);
    this.commonService.users.next(this.usersList);
  }
}
