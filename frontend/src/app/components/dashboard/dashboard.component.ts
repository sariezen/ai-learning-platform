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
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
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
