export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: 'user' | 'admin';
  created_at?: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

export interface Category {
  id: number;
  name: string;
  sub_categories?: SubCategory[];
}

export interface SubCategory {
  id: number;
  name: string;
  category_id: number;
}

export interface PromptRequest {
  category_id: number;
  sub_category_id: number;
  prompt: string;
}

export interface PromptResponse {
  id: number;
  prompt: string;
  response: string;
  category: string;
  sub_category: string;
  created_at: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AdminPrompt extends PromptResponse {
  user_name: string;
  user_email: string;
}
