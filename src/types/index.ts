// Tipos para autenticación
export interface User {
  id: string
  email: string
  name: string
  role: string
}

export interface LoginCredentials {
  email: string
  password: string
}

// Tipos para técnicos
export interface Technician {
  id: string
  name: string
  email?: string
  isActive: boolean
}

// Tipos para servidores
export interface Server {
  id: string
  name: string
  description?: string
  isActive: boolean
}

// Tipos para controles de seguridad
export interface SecurityControl {
  id: string
  name: string
  description?: string
  category: string
  isActive: boolean
}

// Tipos para datos mensuales
export interface HelpdeskData {
  id?: string
  year: number
  month: number
  technicianId: string
  totalCases: number
  casesGLPI: number
  casesOtherSources: number
  satisfactionAverage: number
  timeLessThan4h: number
  time4to8h: number
  time8to16h: number
  timeMoreThan16h: number
}

export interface EndpointProtectionData {
  id?: string
  year: number
  month: number
  computersNoIssues: number
  computersWarning: number
  computersCritical: number
  mobileDevicesProtected: number
  mobileDevicesPending: number
  globalProtectionPercent: number
}

export interface ServerSecurityData {
  id?: string
  year: number
  month: number
  serverId: string
  controlId: string
  status: 'compliant' | 'warning' | 'critical'
  compliancePercent: number
  notes?: string
}

export interface CyberSecurityData {
  id?: string
  year: number
  month: number
  attacksFirewall: number
  attacksAntivirus: number
  attacksMicrosoft365: number
  attacksMEDRSOC: number
  blockedFirewall: number
  blockedAntivirus: number
  blockedMicrosoft365: number
  blockedMEDRSOC: number
  firewallBlockPercent: number
  antivirusBlockPercent: number
  microsoft365BlockPercent: number
  medrSocBlockPercent: number
}

export interface TechIncidentData {
  id?: string
  year: number
  month: number
  unavailabilityHours: number
  availableHoursLeft: number
  slaCompliance: number
  annualProjection: number
  description?: string
}

// Tipos para filtros del dashboard
export interface DashboardFilters {
  year?: number
  quarter?: number
  month?: number
  technicianId?: string
  serverId?: string
}

// Tipos para respuestas de API
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Tipos para estadísticas del dashboard
export interface DashboardStats {
  helpdesk: {
    totalCases: number
    averageSatisfaction: number
    casesByTechnician: Array<{
      technicianName: string
      totalCases: number
    }>
    timeDistribution: {
      lessThan4h: number
      from4to8h: number
      from8to16h: number
      moreThan16h: number
    }
  }
  endpoints: {
    totalComputers: number
    totalMobileDevices: number
    globalProtectionPercent: number
    computerStatus: {
      noIssues: number
      warning: number
      critical: number
    }
    mobileStatus: {
      protected: number
      pending: number
    }
  }
  serverSecurity: {
    totalServers: number
    totalControls: number
    overallCompliance: number
    serverCompliance: Array<{
      serverName: string
      compliancePercent: number
    }>
    controlCompliance: Array<{
      controlName: string
      compliancePercent: number
    }>
  }
  cyberSecurity: {
    totalAttacks: number
    totalBlocked: number
    overallBlockPercent: number
    attacksByVector: {
      firewall: number
      antivirus: number
      microsoft365: number
      medrSoc: number
    }
    blockPercentByVector: {
      firewall: number
      antivirus: number
      microsoft365: number
      medrSoc: number
    }
  }
  techIncidents: {
    totalUnavailabilityHours: number
    availableHoursLeft: number
    slaCompliance: number
    annualProjection: number
  }
}

