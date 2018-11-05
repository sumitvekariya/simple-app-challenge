import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../users/user.model';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  users = new BehaviorSubject<User[]>(this.getUsersFromLocalStorage());
  constructor() {
      this.users.subscribe(users => {
        console.log(users);
        localStorage.removeItem('users');
        localStorage.setItem('users', JSON.stringify(users));
      });
   }

  getUsers () {
    return this.users.getValue();
  }

  getUsersFromLocalStorage() {
    const users = JSON.parse(localStorage.getItem('users'));
    return users && users.length > 0 ? users : [];
  }
}
