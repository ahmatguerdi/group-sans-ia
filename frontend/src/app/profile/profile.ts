import { Component, OnInit } from '@angular/core';
import { User } from '../user.model';
import { UserService } from '../user.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-user-profile',
  imports: [NgIf,ReactiveFormsModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class UserProfileComponent implements OnInit {
  user: User | null = null;
  profileForm: FormGroup;
  isEditing = false;

  constructor(
    private userService: UserService,
    private fb: FormBuilder
  ) {
    this.profileForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    this.loadUser();
  }

  loadUser(): void {
    this.userService.getUser().subscribe(user => {
      this.user = user;
      this.profileForm.patchValue(user);
    });
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (this.isEditing && this.user) {
      this.profileForm.patchValue(this.user);
    }
  }

  saveProfile(): void {
    if (this.profileForm.valid) {
      const updatedUser: User = {
        ...this.user!,
        ...this.profileForm.value
      };

      this.userService.updateUser(updatedUser).subscribe(user => {
        this.user = user;
        this.isEditing = false;
      });
    }
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.profileForm.patchValue(this.user!);
  }
}