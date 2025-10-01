'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { 
  BarChart3, 
  Settings, 
  Users, 
  Server, 
  Shield, 
  HelpCircle,
  Monitor,
  AlertTriangle,
  Activity
} from 'lucide-react'

interface SidebarItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  description?: string
}

const navigation: SidebarItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: BarChart3,
    description: 'Vista general de métricas'
  },
  {
    name: 'Mesa de Ayuda',
    href: '/dashboard/helpdesk',
    icon: HelpCircle,
    description: 'Gestión de casos y técnicos'
  },
  {
    name: 'Endpoints',
    href: '/dashboard/endpoints',
    icon: Monitor,
    description: 'Protección de dispositivos'
  },
  {
    name: 'Servidores',
    href: '/dashboard/servers',
    icon: Server,
    description: 'Seguridad de servidores'
  },
  {
    name: 'Ciberseguridad',
    href: '/dashboard/cybersecurity',
    icon: Shield,
    description: 'Ataques y bloqueos'
  },
  {
    name: 'Incidentes',
    href: '/dashboard/incidents',
    icon: AlertTriangle,
    description: 'Incidentes de tecnología'
  },
]

const adminNavigation: SidebarItem[] = [
  {
    name: 'Administración',
    href: '/admin',
    icon: Settings,
    description: 'Configuración del sistema'
  },
  {
    name: 'Técnicos',
    href: '/admin/technicians',
    icon: Users,
    description: 'Gestión de técnicos'
  },
  {
    name: 'Servidores',
    href: '/admin/servers',
    icon: Server,
    description: 'Gestión de servidores'
  },
  {
    name: 'Controles',
    href: '/admin/controls',
    icon: Activity,
    description: 'Controles de seguridad'
  },
]

const Sidebar: React.FC = () => {
  const pathname = usePathname()

  return (
    <div className="flex flex-col w-64 bg-gray-50 border-r border-gray-200">
      <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
        <nav className="mt-5 flex-1 px-2 space-y-8">
          {/* Dashboard Navigation */}
          <div>
            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Dashboard
            </h3>
            <div className="mt-2 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors',
                      isActive
                        ? 'bg-blue-100 text-blue-900'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    )}
                  >
                    <item.icon
                      className={cn(
                        'mr-3 flex-shrink-0 h-5 w-5',
                        isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                      )}
                    />
                    <div className="flex-1">
                      <div>{item.name}</div>
                      {item.description && (
                        <div className="text-xs text-gray-500 mt-0.5">
                          {item.description}
                        </div>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Admin Navigation */}
          <div>
            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Administración
            </h3>
            <div className="mt-2 space-y-1">
              {adminNavigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors',
                      isActive
                        ? 'bg-blue-100 text-blue-900'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    )}
                  >
                    <item.icon
                      className={cn(
                        'mr-3 flex-shrink-0 h-5 w-5',
                        isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                      )}
                    />
                    <div className="flex-1">
                      <div>{item.name}</div>
                      {item.description && (
                        <div className="text-xs text-gray-500 mt-0.5">
                          {item.description}
                        </div>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </nav>
      </div>
    </div>
  )
}

export default Sidebar

