const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

class ApiClient {
  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth_token');
  }

  setToken(token: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  clearToken() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    if (!res.ok) {
      let errorMessage = `HTTP error ${res.status}`;
      try {
        const errorData = await res.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        // use default status message
      }
      throw new Error(Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage);
    }

    return res.json();
  }

  // Auth endpoints
  async login(credentials: { email: string; password: string }) {
    const res = await this.request<{ user: any; accessToken: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    this.setToken(res.accessToken);
    return res;
  }

  async register(data: any) {
    const res = await this.request<{ user: any; accessToken: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    this.setToken(res.accessToken);
    return res;
  }

  async getMe() {
    return this.request<any>('/auth/me');
  }

  async logout() {
    this.clearToken();
  }

  // Reports
  async getReports(params: Record<string, any> = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, String(val));
      }
    });
    return this.request<{ data: any[]; meta: any }>(`/reports?${query.toString()}`);
  }

  async getReport(id: number) {
    return this.request<any>(`/reports/${id}`);
  }

  async createReport(data: any) {
    return this.request<any>('/reports', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateReport(id: number, data: any) {
    return this.request<any>(`/reports/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async submitReport(id: number) {
    return this.request<any>(`/reports/${id}/submit`, {
      method: 'POST',
    });
  }

  // Manager Reviews
  async approveReport(id: number, comment?: string) {
    return this.request<any>(`/reviews/${id}/approve`, {
      method: 'POST',
      body: JSON.stringify({ comment }),
    });
  }

  async requestCorrection(id: number, comment: string) {
    return this.request<any>(`/reviews/${id}/request-correction`, {
      method: 'POST',
      body: JSON.stringify({ comment }),
    });
  }

  async getReportVersions(id: number) {
    return this.request<any[]>(`/reviews/${id}/versions`);
  }

  // Dashboard & Visual Insights
  async getDashboardSummary(weekStart?: string) {
    const q = weekStart ? `?weekStart=${encodeURIComponent(weekStart)}` : '';
    return this.request<any>(`/dashboard/summary${q}`);
  }

  async getTaskTrends() {
    return this.request<any[]>('/dashboard/task-trends');
  }

  async getMemberStatus(weekStart?: string) {
    const q = weekStart ? `?weekStart=${encodeURIComponent(weekStart)}` : '';
    return this.request<any[]>(`/dashboard/member-status${q}`);
  }

  async getWorkload(weekStart?: string) {
    const q = weekStart ? `?weekStart=${encodeURIComponent(weekStart)}` : '';
    return this.request<any[]>(`/dashboard/workload${q}`);
  }

  async getTimeDistribution(weekStart?: string) {
    const q = weekStart ? `?weekStart=${encodeURIComponent(weekStart)}` : '';
    return this.request<any[]>(`/dashboard/time-distribution${q}`);
  }

  async getRecentActivity() {
    return this.request<any[]>('/dashboard/activity');
  }

  async getSideBySide(section: 'blockers' | 'achievements', weekStart?: string) {
    const q = `?section=${section}${weekStart ? `&weekStart=${encodeURIComponent(weekStart)}` : ''}`;
    return this.request<any[]>(`/dashboard/side-by-side${q}`);
  }

  // Projects
  async getProjects() {
    return this.request<any[]>('/projects');
  }

  async createProject(data: any) {
    return this.request<any>('/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateProject(id: number, data: any) {
    return this.request<any>(`/projects/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteProject(id: number) {
    return this.request<any>(`/projects/${id}`, {
      method: 'DELETE',
    });
  }

  // Users
  async getUsers() {
    return this.request<any[]>('/users');
  }

  async getUser(id: number) {
    return this.request<any>(`/users/${id}`);
  }

  async updateUser(id: number, data: any) {
    return this.request<any>(`/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteUser(id: number) {
    return this.request<any>(`/users/${id}`, {
      method: 'DELETE',
    });
  }

  // AI Assistant
  async chatWithAi(message: string, weekStart?: string) {
    return this.request<{ reply: string; category?: string }>(`/ai/chat`, {
      method: 'POST',
      body: JSON.stringify({ message, weekStart }),
    });
  }
}

export const api = new ApiClient();
