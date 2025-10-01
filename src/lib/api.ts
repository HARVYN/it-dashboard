import { ApiResponse, LoginCredentials, User } from '@/types'

class ApiClient {
  private baseUrl: string
  private token: string | null = null

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || ''
    this.token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}/api${endpoint}`
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      })

      const data = await response.json()
      
      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Error en la solicitud'
        }
      }

      return data
    } catch (error) {
      return {
        success: false,
        error: 'Error de conexión'
      }
    }
  }

  setToken(token: string) {
    this.token = token
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token)
    }
  }

  removeToken() {
    this.token = null
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token')
    }
  }

  // Auth endpoints
  async login(credentials: LoginCredentials) {
    return this.request<{ user: User; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
  }

  async getCurrentUser() {
    return this.request<{ user: User }>('/auth/me')
  }

  // Technicians endpoints
  async getTechnicians() {
    return this.request('/technicians')
  }

  async createTechnician(data: { name: string; email?: string }) {
    return this.request('/technicians', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateTechnician(id: string, data: { name: string; email?: string; isActive: boolean }) {
    return this.request(`/technicians/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteTechnician(id: string) {
    return this.request(`/technicians/${id}`, {
      method: 'DELETE',
    })
  }

  // Servers endpoints
  async getServers() {
    return this.request('/servers')
  }

  async createServer(data: { name: string; description?: string }) {
    return this.request('/servers', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateServer(id: string, data: { name: string; description?: string; isActive: boolean }) {
    return this.request(`/servers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteServer(id: string) {
    return this.request(`/servers/${id}`, {
      method: 'DELETE',
    })
  }

  // Security Controls endpoints
  async getSecurityControls() {
    return this.request('/security-controls')
  }

  async createSecurityControl(data: { name: string; description?: string; category: string }) {
    return this.request('/security-controls', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateSecurityControl(id: string, data: { name: string; description?: string; category: string; isActive: boolean }) {
    return this.request(`/security-controls/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteSecurityControl(id: string) {
    return this.request(`/security-controls/${id}`, {
      method: 'DELETE',
    })
  }

  // Data endpoints
  async getHelpdeskData(params?: { year?: number; month?: number; quarter?: number; technicianId?: string }) {
    const searchParams = new URLSearchParams()
    if (params?.year) searchParams.append('year', params.year.toString())
    if (params?.month) searchParams.append('month', params.month.toString())
    if (params?.quarter) searchParams.append('quarter', params.quarter.toString())
    if (params?.technicianId) searchParams.append('technicianId', params.technicianId)
    
    return this.request(`/data/helpdesk?${searchParams}`)
  }

  async saveHelpdeskData(data: any) {
    return this.request('/data/helpdesk', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getEndpointData(params?: { year?: number; month?: number; quarter?: number }) {
    const searchParams = new URLSearchParams()
    if (params?.year) searchParams.append('year', params.year.toString())
    if (params?.month) searchParams.append('month', params.month.toString())
    if (params?.quarter) searchParams.append('quarter', params.quarter.toString())
    
    return this.request(`/data/endpoints?${searchParams}`)
  }

  async saveEndpointData(data: any) {
    return this.request('/data/endpoints', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getServerSecurityData(params?: { year?: number; month?: number; quarter?: number; serverId?: string }) {
    const searchParams = new URLSearchParams()
    if (params?.year) searchParams.append('year', params.year.toString())
    if (params?.month) searchParams.append('month', params.month.toString())
    if (params?.quarter) searchParams.append('quarter', params.quarter.toString())
    if (params?.serverId) searchParams.append('serverId', params.serverId)
    
    return this.request(`/data/server-security?${searchParams}`)
  }

  async saveServerSecurityData(data: any) {
    return this.request('/data/server-security', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getCyberSecurityData(params?: { year?: number; month?: number; quarter?: number }) {
    const searchParams = new URLSearchParams()
    if (params?.year) searchParams.append('year', params.year.toString())
    if (params?.month) searchParams.append('month', params.month.toString())
    if (params?.quarter) searchParams.append('quarter', params.quarter.toString())
    
    return this.request(`/data/cybersecurity?${searchParams}`)
  }

  async saveCyberSecurityData(data: any) {
    return this.request('/data/cybersecurity', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getTechIncidentData(params?: { year?: number; month?: number; quarter?: number }) {
    const searchParams = new URLSearchParams()
    if (params?.year) searchParams.append('year', params.year.toString())
    if (params?.month) searchParams.append('month', params.month.toString())
    if (params?.quarter) searchParams.append('quarter', params.quarter.toString())
    
    return this.request(`/data/tech-incidents?${searchParams}`)
  }

  async saveTechIncidentData(data: any) {
    return this.request('/data/tech-incidents', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // Dashboard endpoints
  async getDashboardStats(params?: { year?: number; month?: number; quarter?: number }) {
    const searchParams = new URLSearchParams()
    if (params?.year) searchParams.append('year', params.year.toString())
    if (params?.month) searchParams.append('month', params.month.toString())
    if (params?.quarter) searchParams.append('quarter', params.quarter.toString())
    
    return this.request(`/dashboard/stats?${searchParams}`)
  }
}

export const apiClient = new ApiClient()

