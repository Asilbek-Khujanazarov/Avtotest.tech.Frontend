import { Component, OnInit } from '@angular/core';
import { UserService, UserProfile } from '../../services/user.service';
import { FormsModule } from '@angular/forms';
import {  CommonModule} from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  imports: [FormsModule, CommonModule, ReactiveFormsModule, RouterLink]
})
export class MyProfileComponent implements OnInit {
  user: UserProfile | null = null;
  loading = true;
  error: string | null = null;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getMyProfile().subscribe({
      next: (data) => {
        this.user = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Ma\'lumotlarni yuklashda xatolik yuz berdi';
        this.loading = false;
      }
    });
  }
}