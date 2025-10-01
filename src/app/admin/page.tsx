'use client'

import React, { useState, useEffect } from 'react'
import Layout from '@/components/layout/Layout'
import { Card, CardHeader, CardContent } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { apiClient } from '@/lib/api'
import { Users, Server, Activity, Settings, Plus, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const AdminPage: React.FC = () => {
  const [stats, setStats] = useState({
    technicians: 0,
    servers: 0,
    controls: 0,
    loading: true
  })

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const [techniciansRes, serversRes, controlsRes] = await Promise.all([
        apiClient.getTechnicians(),
        apiClient.getServers(),
        apiClient.getSecurityControls()
      ])

      setStats({
        technicians: techniciansRes.success ? techniciansRes.data?.length || 0 : 0,
        servers: serversRes.success ? serversRes.data?.length || 0 : 0,
        controls: controlsRes.success ? controlsRes.data?.length || 0 : 0,
        loading: false
      })
    } catch (error) {
      console.error('Error al cargar estadísticas:', error)
      setStats(prev => ({ ...prev, loading: false }))
    }
  }

  const adminSections = [
    {
      title: 'Técnicos',
      description: 'Gestiona los técnicos de mesa de ayuda',
      icon: Users,
      href: '/admin/technicians',
      count: stats.technicians,
      color: 'blue'
    },
    {
      title: 'Servidores',
      description: 'Administra los servidores de la infraestructura',
      icon: Server,
      href: '/admin/servers',
      count: stats.servers,
      color: 'green'
    },
    {
      title: 'Controles de Seguridad',
      description: 'Configura los controles de seguridad',
      icon: Activity,
      href: '/admin/controls',
      count: stats.controls,
      color: 'purple'
    }
  ]

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return {
          icon: 'text-blue-600',
          bg: 'bg-blue-100',
          border: 'border-blue-200',
          hover: 'hover:border-blue-300'
        }
      case 'green':
        return {
          icon: 'text-green-600',
          bg: 'bg-green-100',
          border: 'border-green-200',
          hover: 'hover:border-green-300'
        }
      case 'purple':
        return {
          icon: 'text-purple-600',
          bg: 'bg-purple-100',
          border: 'border-purple-200',
          hover: 'hover:border-purple-300'
        }
      default:
        return {
          icon: 'text-gray-600',
          bg: 'bg-gray-100',
          border: 'border-gray-200',
          hover: 'hover:border-gray-300'
        }
    }
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
          <p className="mt-2 text-gray-600">
            Gestiona la configuración del sistema y los datos maestros
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {adminSections.map((section) => {
            const colors = getColorClasses(section.color)
            return (
              <Card key={section.title} className={`transition-colors ${colors.border} ${colors.hover}`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`flex-shrink-0 p-3 rounded-lg ${colors.bg}`}>
                        <section.icon className={`h-6 w-6 ${colors.icon}`} />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">{section.title}</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {stats.loading ? '-' : section.count}
                        </p>
                      </div>
                    </div>
                    <Link href={section.href}>
                      <Button variant="ghost" size="sm">
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Settings className="h-5 w-5 text-blue-600" />
                <h2 className="text-xl font-semibold">Configuración Rápida</h2>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                Configura los elementos básicos del sistema antes de comenzar a cargar datos.
              </p>
              
              <div className="space-y-3">
                {adminSections.map((section) => (
                  <Link key={section.href} href={section.href}>
                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center space-x-3">
                        <section.icon className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900">{section.title}</p>
                          <p className="text-sm text-gray-500">{section.description}</p>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-gray-400" />
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Plus className="h-5 w-5 text-green-600" />
                <h2 className="text-xl font-semibold">Acciones Rápidas</h2>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                Accede rápidamente a las funciones más utilizadas.
              </p>
              
              <div className="space-y-3">
                <Link href="/admin/technicians">
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="h-4 w-4 mr-2" />
                    Agregar Técnico
                  </Button>
                </Link>
                
                <Link href="/admin/servers">
                  <Button variant="outline" className="w-full justify-start">
                    <Server className="h-4 w-4 mr-2" />
                    Agregar Servidor
                  </Button>
                </Link>
                
                <Link href="/admin/controls">
                  <Button variant="outline" className="w-full justify-start">
                    <Activity className="h-4 w-4 mr-2" />
                    Agregar Control
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Getting Started */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Primeros Pasos</h2>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              <p className="text-gray-600 mb-4">
                Para comenzar a usar el dashboard, sigue estos pasos:
              </p>
              
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
                <li>Configura los <strong>técnicos</strong> que trabajarán en mesa de ayuda</li>
                <li>Registra los <strong>servidores</strong> de tu infraestructura</li>
                <li>Define los <strong>controles de seguridad</strong> que quieres monitorear</li>
                <li>Comienza a cargar datos mensuales desde las secciones del dashboard</li>
                <li>Utiliza los filtros para analizar tendencias históricas</li>
              </ol>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Tip:</strong> El sistema ya incluye datos de ejemplo para que puedas 
                  explorar las funcionalidades. Puedes modificar o eliminar estos datos según tus necesidades.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}

export default AdminPage

