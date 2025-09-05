const API_BASE_URL = '/api';

class ApiService {
  private token: string | null = localStorage.getItem('token');

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  removeToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  // Auth endpoints
  async login(username: string, password: string) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    
    if (response.token) {
      this.setToken(response.token);
    }
    
    return response;
  }

  async register(username: string, password: string, role = 'operator') {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, password, role }),
    });
    
    if (response.token) {
      this.setToken(response.token);
    }
    
  }

  // Train endpoints
  async getTrains() {
    return this.request('/trains');
  }

  async getTrain(id: string) {
    return this.request(`/trains/${id}`);
  }

  async updateTrain(id: string, updates: any) {
    return this.request(`/trains/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async makeDecision(trainId: string, action: string, reason?: string) {
    return this.request('/trains/decision', {
      method: 'POST',
      body: JSON.stringify({ trainId, action, reason }),
    });
  }

  // AI endpoints
  async getRecommendations() {
    return this.request('/ai/recommendations');
  }

  async runSimulation(scenario: string) {
    return this.request('/ai/simulate', {
      method: 'POST',
      body: JSON.stringify({ scenario }),
    });
  }

  async getKPIs() {
    return this.request('/ai/kpis');
  }
}

export const apiService = new ApiService();