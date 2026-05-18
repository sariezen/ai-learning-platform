import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <h2>Login</h2>
        <p class="subtitle">Welcome back to AI Learning Platform</p>

        <div class="error-msg" *ngIf="error">{{ error }}</div>

        <div class="form-group">
          <label for="email">Email</label>
          <input
            id="email"
            type="email"
            [(ngModel)]="email"
            placeholder="your@email.com"
          />
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input
            id="password"
            type="password"
            [(ngModel)]="password"
            placeholder="Your password"
          />
        </div>

        <button class="btn-primary" (click)="onLogin()" [disabled]="loading">
          {{ loading ? 'Logging in...' : 'Login' }}
        </button>

        <p class="switch-auth">
          Don't have an account? <a routerLink="/register">Register</a>
        </p>
      </div>
    </div>
  `,
  styles: [
    `
      .auth-container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      }
      .auth-card {
        background: #1e293b;
        border: 1px solid #334155;
        border-radius: 12px;
        padding: 40px;
        width: 400px;
        max-width: 90vw;
      }
      h2 {
        color: #f1f5f9;
        margin: 0 0 4px;
        font-size: 28px;
      }
      .subtitle {
        color: #94a3b8;
        margin: 0 0 24px;
        font-size: 14px;
      }
      .form-group {
        margin-bottom: 16px;
      }
      label {
        display: block;
        color: #cbd5e1;
        margin-bottom: 6px;
        font-size: 14px;
      }
      input {
        width: 100%;
        padding: 10px 14px;
        background: #0f172a;
        border: 1px solid #334155;
        border-radius: 8px;
        color: #f1f5f9;
        font-size: 14px;
        box-sizing: border-box;
      }
      input:focus {
        outline: none;
        border-color: #3b82f6;
      }
      .btn-primary {
        width: 100%;
        padding: 12px;
        background: #3b82f6;
        color: white;
        border: none;
        border-radius: 8px;
        font-size: 16px;
        cursor: pointer;
        margin-top: 8px;
      }
      .btn-primary:hover {
        background: #2563eb;
      }
      .btn-primary:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
      .switch-auth {
        text-align: center;
        color: #94a3b8;
        margin-top: 16px;
        font-size: 14px;
      }
      .switch-auth a {
        color: #3b82f6;
        text-decoration: none;
      }
      .error-msg {
        background: #7f1d1d;
        color: #fca5a5;
        padding: 10px 14px;
        border-radius: 8px;
        margin-bottom: 16px;
        font-size: 14px;
      }
    `,
  ],
})
export class LoginComponent {
  email = '';
  password = '';
  loading = false;
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin(): void {
    this.error = '';
    this.loading = true;
    this.authService.login(this.email, this.password).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.user.role === 'admin') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/dashboard']);
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.error || 'Login failed. Please try again.';
      },
    });
  }
}
