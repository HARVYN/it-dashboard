'use client'

import React from 'react'
import Layout from '@/components/layout/Layout'
import { Card, CardHeader, CardContent } from '@/components/ui/Card'
import { BarChart3, Users, Server, Shield, AlertTriangle, Monitor } from 'lucide-react'

const DashboardPage: React.FC = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard IT</h1>
          <p className="mt-2 text-gray-600">
            Vista general de las métricas de tecnología y seguridad
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Mesa de Ayuda</p>
                  <p className="text-2xl font-bold text-gray-900">156 casos</p>
                  <p className="text-sm text-green-600">+12% vs mes anterior</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Monitor className="h-8 w-8 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Endpoints</p>
                  <p className="text-2xl font-bold text-gray-900">92.5%</p>
                  <p className="text-sm text-green-600">Protección global</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Shield className="h-8 w-8 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Ciberseguridad</p>
                  <p className="text-2xl font-bold text-gray-900">89.2%</p>
                  <p className="text-sm text-green-600">Bloqueo efectivo</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Server className="h-8 w-8 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Servidores</p>
                  <p className="text-2xl font-bold text-gray-900">87.3%</p>
                  <p className="text-sm text-yellow-600">Cumplimiento</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Incidentes</p>
                  <p className="text-2xl font-bold text-gray-900">4.2h</p>
                  <p className="text-sm text-red-600">Indisponibilidad</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <BarChart3 className="h-8 w-8 text-indigo-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">SLA</p>
                  <p className="text-2xl font-bold text-gray-900">98.7%</p>
                  <p className="text-sm text-green-600">Cumplimiento</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Welcome Message */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Bienvenido al Dashboard IT</h2>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              <p className="text-gray-600 mb-4">
                Este dashboard te permite gestionar y monitorear todas las métricas importantes 
                de tu infraestructura de IT de manera centralizada.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Funcionalidades principales:</h3>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• Gestión de casos de mesa de ayuda</li>
                    <li>• Monitoreo de protección de endpoints</li>
                    <li>• Control de seguridad de servidores</li>
                    <li>• Análisis de ciberseguridad</li>
                    <li>• Seguimiento de incidentes</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Características:</h3>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• Análisis mensual e histórico</li>
                    <li>• Filtros por año, trimestre y mes</li>
                    <li>• Exportación de reportes</li>
                    <li>• Panel de administración</li>
                    <li>• Carga de datos incremental</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}

export default DashboardPage

