/**
 * API client for communicating with the backend.
 */
import axios from 'axios'
import { User, SOW, SOWCreate, SOWUpdate, UserCreate, UserUpdate, ApprovalComment } from './types'

// Get API base URL from environment or default to localhost
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Handle response errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, clear auth
      localStorage.removeItem('auth_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Authentication API
export const authAPI = {
  login: async (email: string, password: string): Promise<{ access_token: string; user: User }> => {
    const response = await apiClient.post('/api/auth/login', { email, password })
    return response.data
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get('/api/auth/me')
    return response.data
  },

  logout: () => {
    localStorage.removeItem('auth_token')
  },
}

// Users API
export const usersAPI = {
  create: async (userData: UserCreate): Promise<User> => {
    const response = await apiClient.post('/api/users', userData)
    return response.data
  },

  getAll: async (): Promise<User[]> => {
    const response = await apiClient.get('/api/users')
    return response.data
  },

  getById: async (userId: string): Promise<User> => {
    const response = await apiClient.get(`/api/users/${userId}`)
    return response.data
  },

  update: async (userId: string, userData: UserUpdate): Promise<User> => {
    const response = await apiClient.put(`/api/users/${userId}`, userData)
    return response.data
  },

  delete: async (userId: string): Promise<void> => {
    await apiClient.delete(`/api/users/${userId}`)
  },
}

// SOWs API
export const sowsAPI = {
  create: async (sowData: SOWCreate): Promise<SOW> => {
    const response = await apiClient.post('/api/sows', sowData)
    return response.data
  },

  getAll: async (status?: string): Promise<SOW[]> => {
    const params = status ? { status } : {}
    const response = await apiClient.get('/api/sows', { params })
    return response.data
  },

  getById: async (sowId: string): Promise<SOW> => {
    const response = await apiClient.get(`/api/sows/${sowId}`)
    return response.data
  },

  update: async (sowId: string, sowData: SOWUpdate): Promise<SOW> => {
    const response = await apiClient.put(`/api/sows/${sowId}`, sowData)
    return response.data
  },

  delete: async (sowId: string): Promise<void> => {
    await apiClient.delete(`/api/sows/${sowId}`)
  },

  addComment: async (sowId: string, comment: ApprovalComment): Promise<SOW> => {
    const response = await apiClient.post(`/api/sows/${sowId}/comments`, comment)
    return response.data
  },
}

// Health check
export const healthAPI = {
  check: async (): Promise<{ status: string; database: string }> => {
    const response = await apiClient.get('/health')
    return response.data
  },
}

export default apiClient
