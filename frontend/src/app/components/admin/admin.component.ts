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
  template: `
    <div class="admin">
      <header class="header">
        <div class="header-left">
          <h1>Admin Panel</h1>
        </div>
        <div class="header-right">
          <button class="btn-outline" (click)="goBack()">Back to Dashboard</button>
          <button class="btn-logout" (click)="logout()">Logout</button>
        </div>
      </header>

      <div class="content">
        <!-- Tabs -->
        <div class="tabs">
          <button [class.active]="activeTab === 'users'" (click)="activeTab = 'users'; loadUsers(1)">
            Users
          </button>
          <button [class.active]="activeTab === 'prompts'" (click)="activeTab = 'prompts'; loadPrompts(1)">
            All Prompts
          </button>
        </div>

        <!-- Users Tab -->
        <div class="card" *ngIf="activeTab === 'users'">
          <h2>All Users</h2>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let user of users">
                <td>{{ user.id }}</td>
                <td>{{ user.name }}</td>
                <td>{{ user.email }}</td>
                <td>{{ user.phone }}</td>
                <td><span class="role-badge" [class.admin]="user.role === 'admin'">{{ user.role }}</span></td>
                <td>{{ user.created_at | date: 'shortDate' }}</td>
                <td>
                  <button class="btn-sm" (click)="filterByUser(user.id)">View Prompts</button>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="pagination" *ngIf="usersTotalPages > 1">
            <button (click)="loadUsers(usersPage - 1)" [disabled]="usersPage <= 1">Prev</button>
            <span>Page {{ usersPage }} of {{ usersTotalPages }}</span>
            <button (click)="loadUsers(usersPage + 1)" [disabled]="usersPage >= usersTotalPages">Next</button>
          </div>
        </div>

        <!-- Prompts Tab -->
        <div class="card" *ngIf="activeTab === 'prompts'">
          <div class="prompts-header">
            <h2>All Prompts</h2>
            <div class="filter-group" *ngIf="filterUserId">
              <span class="filter-badge">Filtered by User #{{ filterUserId }}</span>
              <button class="btn-sm" (click)="clearFilter()">Clear Filter</button>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>User</th>
                <th>Category</th>
                <th>Prompt</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let p of prompts">
                <td>{{ p.id }}</td>
                <td>{{ p.user_name }}</td>
                <td>{{ p.category }} › {{ p.sub_category }}</td>
                <td class="truncate">{{ p.prompt }}</td>
                <td>{{ p.created_at | date: 'short' }}</td>
              </tr>
            </tbody>
          </table>
          <div *ngIf="prompts.length === 0" class="empty-state">No prompts found.</div>
          <div class="pagination" *ngIf="promptsTotalPages > 1">
            <button (click)="loadPrompts(promptsPage - 1)" [disabled]="promptsPage <= 1">Prev</button>
            <span>Page {{ promptsPage }} of {{ promptsTotalPages }}</span>
            <button (click)="loadPrompts(promptsPage + 1)" [disabled]="promptsPage >= promptsTotalPages">Next</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .admin { min-height: 100vh; background: #0f172a; color: #f1f5f9; }
      .header {
        display: flex; justify-content: space-between; align-items: center;
        padding: 16px 32px; background: #1e293b; border-bottom: 1px solid #334155;
      }
      .header h1 { margin: 0; font-size: 20px; color: #f59e0b; }
      .header-right { display: flex; gap: 12px; }
      .btn-outline {
        background: transparent; color: #3b82f6; border: 1px solid #3b82f6;
        padding: 6px 16px; border-radius: 6px; cursor: pointer; font-size: 13px;
      }
      .btn-logout {
        background: transparent; color: #f87171; border: 1px solid #f87171;
        padding: 6px 16px; border-radius: 6px; cursor: pointer; font-size: 13px;
      }
      .content { max-width: 1100px; margin: 0 auto; padding: 24px 16px; }
      .tabs { display: flex; gap: 8px; margin-bottom: 20px; }
      .tabs button {
        background: #1e293b; color: #94a3b8; border: 1px solid #334155;
        padding: 10px 24px; border-radius: 8px; cursor: pointer; font-size: 14px;
      }
      .tabs button.active { background: #3b82f6; color: white; border-color: #3b82f6; }
      .card {
        background: #1e293b; border: 1px solid #334155; border-radius: 12px;
        padding: 24px; overflow-x: auto;
      }
      .card h2 { margin: 0 0 16px; font-size: 18px; }
      table { width: 100%; border-collapse: collapse; }
      th {
        text-align: left; padding: 10px 12px; background: #0f172a;
        color: #94a3b8; font-size: 13px; border-bottom: 1px solid #334155;
      }
      td {
        padding: 10px 12px; border-bottom: 1px solid #1e293b;
        font-size: 14px; color: #cbd5e1;
      }
      tr:hover td { background: #0f172a33; }
      .truncate { max-width: 300px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .role-badge {
        background: #1e3a5f; color: #93c5fd; padding: 2px 8px;
        border-radius: 4px; font-size: 12px;
      }
      .role-badge.admin { background: #713f12; color: #fcd34d; }
      .btn-sm {
        background: #334155; color: #f1f5f9; border: none;
        padding: 4px 12px; border-radius: 4px; cursor: pointer; font-size: 12px;
      }
      .prompts-header { display: flex; justify-content: space-between; align-items: center; }
      .filter-group { display: flex; align-items: center; gap: 8px; }
      .filter-badge { background: #713f12; color: #fcd34d; padding: 4px 10px; border-radius: 4px; font-size: 12px; }
      .empty-state { color: #64748b; text-align: center; padding: 24px; }
      .pagination {
        display: flex; justify-content: center; align-items: center;
        gap: 12px; margin-top: 16px;
      }
      .pagination button {
        background: #334155; color: #f1f5f9; border: none;
        padding: 6px 14px; border-radius: 6px; cursor: pointer;
      }
      .pagination button:disabled { opacity: 0.4; cursor: not-allowed; }
      .pagination span { color: #94a3b8; font-size: 13px; }
    `,
  ],
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
