import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { CommonService } from 'src/app/shared/common.service';

@Component({
  selector: 'app-add-user-dialog',
  templateUrl: './add-user-dialog.component.html',
  styleUrls: ['./add-user-dialog.component.scss']
})
export class AddUserDialogComponent implements OnInit {

  public userForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    public dialog: MatDialogRef<AddUserDialogComponent>,
    public commonService: CommonService
    ) {
    this.userForm = this.fb.group({
      'id': new FormControl('', Validators.required),
      'username': new FormControl('', Validators.required),
      'name': new FormControl('', Validators.required),
      'number': new FormControl('', Validators.required),
      'role': new FormControl('', Validators.required),
      'createdAt': new Date()
    });
   }

  ngOnInit() {
  }


  addUser(user: FormGroup) {
    const usersList = [...this.commonService.users.value];
    usersList.push(user.value);
    this.commonService.users.next(usersList);
    this.dialog.close();
  }

}
