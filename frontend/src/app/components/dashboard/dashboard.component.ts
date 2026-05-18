import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';
import {
  Category,
  SubCategory,
  PromptResponse,
} from '../../models/interfaces';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="dashboard">
      <!-- Header -->
      <header class="header">
        <div class="header-left">
          <h1>AI Learning Platform</h1>
        </div>
        <div class="header-right">
          <span class="user-name">{{ userName }}</span>
          <button class="btn-outline" *ngIf="isAdmin" (click)="goAdmin()">Admin Panel</button>
          <button class="btn-logout" (click)="logout()">Logout</button>
        </div>
      </header>

      <div class="content">
        <!-- Learning Form -->
        <div class="card learn-card">
          <h2>Start Learning</h2>
          <p class="card-subtitle">Select a topic and ask anything</p>

          <div class="form-row">
            <div class="form-group">
              <label>Category</label>
              <select [(ngModel)]="selectedCategoryId" (change)="onCategoryChange()">
                <option [ngValue]="0">-- Select Category --</option>
                <option *ngFor="let cat of categories" [ngValue]="cat.id">
                  {{ cat.name }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label>Sub-Category</label>
              <select [(ngModel)]="selectedSubCategoryId" [disabled]="!subCategories.length">
                <option [ngValue]="0">-- Select Sub-Category --</option>
                <option *ngFor="let sub of subCategories" [ngValue]="sub.id">
                  {{ sub.name }}
                </option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label>Your Prompt</label>
            <textarea
              [(ngModel)]="promptText"
              rows="3"
              placeholder="e.g., Teach me about black holes"
            ></textarea>
          </div>

          <button
            class="btn-primary"
            (click)="submitPrompt()"
            [disabled]="submitting || !selectedCategoryId || !selectedSubCategoryId || !promptText.trim()"
          >
            {{ submitting ? 'Generating lesson...' : 'Get Lesson' }}
          </button>

          <div class="error-msg" *ngIf="error">{{ error }}</div>
        </div>

        <!-- AI Response -->
        <div class="card response-card" *ngIf="lastResponse">
          <h3>AI Lesson</h3>
          <div class="response-meta">
            <span>{{ lastResponse.category }}</span>
            <span class="separator">›</span>
            <span>{{ lastResponse.sub_category }}</span>
          </div>
          <div class="prompt-text">
            <strong>You asked:</strong> {{ lastResponse.prompt }}
          </div>
          <div class="response-text">{{ lastResponse.response }}</div>
        </div>

        <!-- History -->
        <div class="card history-card">
          <h2>Learning History</h2>
          <div *ngIf="history.length === 0" class="empty-state">
            No lessons yet. Start learning above!
          </div>
          <div class="history-list">
            <div class="history-item" *ngFor="let item of history" (click)="viewLesson(item)">
              <div class="history-meta">
                <span class="badge">{{ item.category }} › {{ item.sub_category }}</span>
                <span class="date">{{ item.created_at | date: 'short' }}</span>
              </div>
              <p class="history-prompt">{{ item.prompt }}</p>
            </div>
          </div>
          <!-- Pagination -->
          <div class="pagination" *ngIf="totalPages > 1">
            <button (click)="loadHistory(currentPage - 1)" [disabled]="currentPage <= 1">Prev</button>
            <span>Page {{ currentPage }} of {{ totalPages }}</span>
            <button (click)="loadHistory(currentPage + 1)" [disabled]="currentPage >= totalPages">Next</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .dashboard { min-height: 100vh; background: #0f172a; color: #f1f5f9; }
      .header {
        display: flex; justify-content: space-between; align-items: center;
        padding: 16px 32px; background: #1e293b; border-bottom: 1px solid #334155;
      }
      .header h1 { margin: 0; font-size: 20px; color: #3b82f6; }
      .header-right { display: flex; align-items: center; gap: 12px; }
      .user-name { color: #94a3b8; font-size: 14px; }
      .btn-logout {
        background: transparent; color: #f87171; border: 1px solid #f87171;
        padding: 6px 16px; border-radius: 6px; cursor: pointer; font-size: 13px;
      }
      .btn-outline {
        background: transparent; color: #3b82f6; border: 1px solid #3b82f6;
        padding: 6px 16px; border-radius: 6px; cursor: pointer; font-size: 13px;
      }
      .content { max-width: 900px; margin: 0 auto; padding: 24px 16px; }
      .card {
        background: #1e293b; border: 1px solid #334155; border-radius: 12px;
        padding: 24px; margin-bottom: 20px;
      }
      .card h2 { margin: 0 0 4px; font-size: 20px; }
      .card h3 { margin: 0 0 12px; font-size: 18px; color: #3b82f6; }
      .card-subtitle { color: #94a3b8; margin: 0 0 20px; font-size: 14px; }
      .form-row { display: flex; gap: 16px; }
      .form-row .form-group { flex: 1; }
      .form-group { margin-bottom: 16px; }
      label { display: block; color: #cbd5e1; margin-bottom: 6px; font-size: 14px; }
      select, textarea, input {
        width: 100%; padding: 10px 14px; background: #0f172a;
        border: 1px solid #334155; border-radius: 8px; color: #f1f5f9;
        font-size: 14px; box-sizing: border-box;
      }
      select:focus, textarea:focus { outline: none; border-color: #3b82f6; }
      textarea { resize: vertical; font-family: inherit; }
      .btn-primary {
        width: 100%; padding: 12px; background: #3b82f6; color: white;
        border: none; border-radius: 8px; font-size: 16px; cursor: pointer;
      }
      .btn-primary:hover { background: #2563eb; }
      .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
      .error-msg {
        background: #7f1d1d; color: #fca5a5; padding: 10px 14px;
        border-radius: 8px; margin-top: 12px; font-size: 14px;
      }
      .response-meta { color: #94a3b8; font-size: 13px; margin-bottom: 8px; }
      .separator { margin: 0 6px; }
      .prompt-text { color: #cbd5e1; margin-bottom: 12px; font-size: 14px; }
      .response-text {
        white-space: pre-wrap; line-height: 1.7; font-size: 15px;
        color: #e2e8f0; background: #0f172a; padding: 16px;
        border-radius: 8px; border: 1px solid #334155;
      }
      .empty-state { color: #64748b; text-align: center; padding: 24px; }
      .history-list { display: flex; flex-direction: column; gap: 8px; }
      .history-item {
        padding: 12px 16px; background: #0f172a; border: 1px solid #334155;
        border-radius: 8px; cursor: pointer; transition: border-color 0.2s;
      }
      .history-item:hover { border-color: #3b82f6; }
      .history-meta { display: flex; justify-content: space-between; margin-bottom: 4px; }
      .badge {
        background: #1e3a5f; color: #93c5fd; padding: 2px 8px;
        border-radius: 4px; font-size: 12px;
      }
      .date { color: #64748b; font-size: 12px; }
      .history-prompt { color: #cbd5e1; margin: 0; font-size: 14px; }
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
      @media (max-width: 600px) {
        .form-row { flex-direction: column; gap: 0; }
        .header { padding: 12px 16px; flex-wrap: wrap; gap: 8px; }
      }
    `,
  ],
})
export class DashboardComponent implements OnInit {
  userName = '';
  isAdmin = false;
  categories: Category[] = [];
  subCategories: SubCategory[] = [];
  selectedCategoryId = 0;
  selectedSubCategoryId = 0;
  promptText = '';
  submitting = false;
  error = '';
  lastResponse: PromptResponse | null = null;
  history: PromptResponse[] = [];
  currentPage = 1;
  totalPages = 1;

  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    this.userName = user?.name || '';
    this.isAdmin = user?.role === 'admin';
    this.loadCategories();
    this.loadHistory(1);
  }

  loadCategories(): void {
    this.apiService.getCategories().subscribe({
      next: (cats) => (this.categories = cats),
      error: () => (this.error = 'Failed to load categories.'),
    });
  }

  onCategoryChange(): void {
    this.subCategories = [];
    this.selectedSubCategoryId = 0;
    if (this.selectedCategoryId) {
      this.apiService.getSubCategories(this.selectedCategoryId).subscribe({
        next: (subs) => (this.subCategories = subs),
      });
    }
  }

  submitPrompt(): void {
    this.error = '';
    this.submitting = true;
    this.apiService
      .submitPrompt({
        category_id: this.selectedCategoryId,
        sub_category_id: this.selectedSubCategoryId,
        prompt: this.promptText,
      })
      .subscribe({
        next: (res) => {
          this.submitting = false;
          this.lastResponse = res;
          this.promptText = '';
          this.loadHistory(1);
        },
        error: (err) => {
          this.submitting = false;
          this.error = err.error?.error || 'Failed to get AI response.';
        },
      });
  }

  loadHistory(page: number): void {
    this.currentPage = page;
    this.apiService.getMyHistory(page, 5).subscribe({
      next: (res) => {
        this.history = res.data;
        this.totalPages = res.pagination.totalPages;
      },
    });
  }

  viewLesson(item: PromptResponse): void {
    this.lastResponse = item;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  goAdmin(): void {
    this.router.navigate(['/admin']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
