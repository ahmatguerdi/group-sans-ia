import { Injectable } from '@angular/core';
import { User } from './user.model';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private currentUser: User = {
    id: 1,
    name: '',
    email: ''
  };

  getUser(): Observable<User> {
    return of(this.currentUser);
  }

  updateUser(updatedUser: User): Observable<User> {
    this.currentUser = { ...this.currentUser, ...updatedUser };
    return of(this.currentUser);
  }
}