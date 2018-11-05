import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-add-user-dialog',
  templateUrl: './add-user-dialog.component.html',
  styleUrls: ['./add-user-dialog.component.scss']
})
export class AddUserDialogComponent implements OnInit {

  public userForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    public dialog: MatDialogRef<AddUserDialogComponent>
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

}
