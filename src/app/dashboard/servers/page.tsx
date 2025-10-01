'use client'

import React, { useState, useEffect } from 'react'
import Layout from '@/components/layout/Layout'
import DateFilter from '@/components/dashboard/DateFilter'
import MetricCard from '@/components/dashboard/MetricCard'
import ChartContainer from '@/components/dashboard/ChartContainer'
import DataUploadForm from '@/components/admin/DataUploadForm'
import { Card, CardHeader, CardContent } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import { Server, Shield, CheckCircle, AlertTriangle, Plus, Download } from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts'

const ServersPage: React.FC = () => {
  const [year, setYear] = useState(new Date().getFullYear())
  const [month, setMonth] = useState<number | undefined>()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<any>(null)
  const [uploadModalOpen, setUploadModalOpen] = useState(false)

  useEffect(() => {
    loadData()
  }, [year, month])

  const loadData = async () => {
    setLoading(true)
    try {
      // Simular datos para demostración
      const mockData = {
        totalServers: 24,
        complianceRate: 87.3,
        criticalIssues: 3,
        serversStatus: [
          { name: 'Servidor Web 1', compliance: 95, status: 'ok' },
          { name: 'Servidor Web 2', compliance: 92, status: 'ok' },
          { name: 'Servidor DB 1', compliance: 88, status: 'warning' },
          { name: 'Servidor DB 2', compliance: 85, status: 'warning' },
          { name: 'Servidor App 1', compliance: 78, status: 'critical' },
          { name: 'Servidor App 2', compliance: 91, status: 'ok' }
        ],
        controlsStatus: [
          { control: 'Patch Management', compliance: 92, trend: 'up' },
          { control: 'Antivirus', compliance: 98, trend: 'up' },
          { control: 'Firewall', compliance: 89, trend: 'down' },
          { control: 'Backup', compliance: 85, trend: 'neutral' },
          { control: 'Monitoring', compliance: 94, trend: 'up' },
          { control: 'Access Control', compliance: 87, trend: 'down' }
        ],
        monthlyTrend: [
          { month: 'Ene', compliance: 84.2, issues: 5 },
          { month: 'Feb', compliance: 85.1, issues: 4 },
          { month: 'Mar', compliance: 86.8, issues: 4 },
          { month: 'Abr', compliance: 85.9, issues: 6 },
          { month: 'May', compliance: 88.1, issues: 3 },
          { month: 'Jun', compliance: 87.3, issues: 3 }
        ],
        radarData: [
          { subject: 'Patch Mgmt', A: 92, fullMark: 100 },
          { subject: 'Antivirus', A: 98, fullMark: 100 },
          { subject: 'Firewall', A: 89, fullMark: 100 },
          { subject: 'Backup', A: 85, fullMark: 100 },
          { subject: 'Monitoring', A: 94, fullMark: 100 },
          { subject: 'Access Ctrl', A: 87, fullMark: 100 }
        ]
      }
      setData(mockData)
    } catch (error) {
      console.error('Error al cargar datos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDataUpload = async (uploadData: any) => {
    console.log('Datos cargados:', uploadData)
    // Aquí se implementaría la lógica para guardar los datos
    setUploadModalOpen(false)
    await loadData() // Recargar datos
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Seguridad de Servidores</h1>
            <p className="mt-2 text-gray-600">
              Estado de implementación de controles de seguridad
            </p>
          </div>
          <div className="flex space-x-3">
            <Button onClick={() => setUploadModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Cargar Datos
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>

        <DateFilter
          year={year}
          month={month}
          onYearChange={setYear}
          onMonthChange={setMonth}
          showMonth={true}
        />

        {/* Métricas principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total de Servidores"
            value={data.totalServers}
            subtitle="En monitoreo"
            icon={Server}
            color="blue"
          />
          
          <MetricCard
            title="Cumplimiento Global"
            value={`${data.complianceRate}%`}
            subtitle="Controles implementados"
            trend={{ value: 2, label: 'vs mes anterior', direction: 'up' }}
            icon={Shield}
            color="green"
          />
          
          <MetricCard
            title="Servidores OK"
            value={data.serversStatus.filter((s: any) => s.status === 'ok').length}
            subtitle="Sin problemas críticos"
            icon={CheckCircle}
            color="green"
          />
          
          <MetricCard
            title="Problemas Críticos"
            value={data.criticalIssues}
            subtitle="Requieren atención"
            trend={{ value: -25, label: 'vs mes anterior', direction: 'down' }}
            icon={AlertTriangle}
            color="red"
          />
        </div>

        {/* Gráficos principales */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartContainer
            title="Estado por Servidor"
            subtitle="Porcentaje de cumplimiento por servidor"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.serversStatus} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 100]} />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip formatter={(value) => [`${value}%`, 'Cumplimiento']} />
                <Bar 
                  dataKey="compliance" 
                  fill={(entry: any) => {
                    if (entry.compliance >= 90) return '#10B981'
                    if (entry.compliance >= 80) return '#F59E0B'
                    return '#EF4444'
                  }}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>

          <ChartContainer
            title="Cumplimiento por Control"
            subtitle="Estado de cada control de seguridad"
          >
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={data.radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar
                  name="Cumplimiento"
                  dataKey="A"
                  stroke="#3B82F6"
                  fill="#3B82F6"
                  fillOpacity={0.3}
                />
              </RadarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        {/* Tendencia mensual */}
        <ChartContainer
          title="Tendencia Mensual de Cumplimiento"
          subtitle="Evolución del cumplimiento y problemas detectados"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" domain={[80, 100]} />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="compliance" 
                stroke="#10B981" 
                strokeWidth={3}
                name="Cumplimiento (%)"
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="issues" 
                stroke="#EF4444" 
                strokeWidth={2}
                name="Problemas"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* Tabla detallada */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Estado Detallado por Control</h3>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Control de Seguridad
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cumplimiento
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tendencia
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.controlsStatus.map((control: any, index: number) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{control.control}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{control.compliance}%</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm ${
                          control.trend === 'up' ? 'text-green-600' :
                          control.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          {control.trend === 'up' ? '↗' : control.trend === 'down' ? '↘' : '→'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          control.compliance >= 95 
                            ? 'bg-green-100 text-green-800'
                            : control.compliance >= 85
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {control.compliance >= 95 ? 'Excelente' : control.compliance >= 85 ? 'Bueno' : 'Crítico'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Modal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        title="Cargar Datos de Servidores"
        size="lg"
      >
        <DataUploadForm
          dataType="servers"
          onSubmit={handleDataUpload}
        />
      </Modal>
    </Layout>
  )
}

export default ServersPage

