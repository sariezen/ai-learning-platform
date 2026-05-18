import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  Category,
  SubCategory,
  PromptRequest,
  PromptResponse,
  PaginatedResponse,
  AdminPrompt,
  User,
} from '../models/interfaces';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/categories`);
  }

  getSubCategories(categoryId: number): Observable<SubCategory[]> {
    return this.http.get<SubCategory[]>(
      `${this.apiUrl}/categories/${categoryId}/sub-categories`
    );
  }

  submitPrompt(data: PromptRequest): Observable<PromptResponse> {
    return this.http.post<PromptResponse>(`${this.apiUrl}/prompts`, data);
  }

  getMyHistory(
    page: number = 1,
    limit: number = 10
  ): Observable<PaginatedResponse<PromptResponse>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    return this.http.get<PaginatedResponse<PromptResponse>>(
      `${this.apiUrl}/prompts/history`,
      { params }
    );
  }

  getAllUsers(
    page: number = 1,
    limit: number = 10
  ): Observable<PaginatedResponse<User>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    return this.http.get<PaginatedResponse<User>>(
      `${this.apiUrl}/admin/users`,
      { params }
    );
  }

  getAllPrompts(
    page: number = 1,
    limit: number = 10,
    userId?: number
  ): Observable<PaginatedResponse<AdminPrompt>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    if (userId) {
      params = params.set('user_id', userId.toString());
    }
    return this.http.get<PaginatedResponse<AdminPrompt>>(
      `${this.apiUrl}/admin/prompts`,
      { params }
    );
  }
}
