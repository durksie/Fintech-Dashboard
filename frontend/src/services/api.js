const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Simple fetch-based API service to avoid axios polyfill issues
export const apiService = {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    // Add token to requests
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        throw new Error(data.message || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  },

  get(endpoint) {
    return this.request(endpoint);
  },

  post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: data,
    });
  },

  put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: data,
    });
  },

  delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  },
};

export const authAPI = {
  login: (credentials) => apiService.post('/users/login', credentials),
  register: (userData) => apiService.post('/users/register', userData),
  getProfile: () => apiService.get('/users/profile'),
};

export const accountsAPI = {
  getAccounts: () => apiService.get('/accounts'),
  createAccount: (accountData) => apiService.post('/accounts/create', accountData),
};

export const transactionsAPI = {
  getTransactions: (accountId, limit = 10) => apiService.get(`/transactions/${accountId}?limit=${limit}`),
  deposit: (depositData) => apiService.post('/transactions/deposit', depositData),
  getAnalytics: () => apiService.get('/transactions/analytics'),
};