import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';
import { User, AdminPrompt } from '../../models/interfaces';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
})
export class AdminComponent implements OnInit {
  activeTab: 'users' | 'prompts' = 'users';
  users: User[] = [];
  prompts: AdminPrompt[] = [];
  usersPage = 1;
  usersTotalPages = 1;
  promptsPage = 1;
  promptsTotalPages = 1;
  filterUserId: number | undefined;

  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUsers(1);
  }

  loadUsers(page: number): void {
    this.usersPage = page;
    this.apiService.getAllUsers(page, 10).subscribe({
      next: (res) => {
        this.users = res.data;
        this.usersTotalPages = res.pagination.totalPages;
      },
    });
  }

  loadPrompts(page: number): void {
    this.promptsPage = page;
    this.apiService.getAllPrompts(page, 10, this.filterUserId).subscribe({
      next: (res) => {
        this.prompts = res.data;
        this.promptsTotalPages = res.pagination.totalPages;
      },
    });
  }

  filterByUser(userId: number): void {
    this.filterUserId = userId;
    this.activeTab = 'prompts';
    this.loadPrompts(1);
  }

  clearFilter(): void {
    this.filterUserId = undefined;
    this.loadPrompts(1);
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
