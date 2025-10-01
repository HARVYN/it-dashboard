'use client'

import React, { useState, useEffect } from 'react'
import Layout from '@/components/layout/Layout'
import DateFilter from '@/components/dashboard/DateFilter'
import MetricCard from '@/components/dashboard/MetricCard'
import ChartContainer from '@/components/dashboard/ChartContainer'
import { Card, CardHeader, CardContent } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { apiClient } from '@/lib/api'
import { Users, Clock, Star, TrendingUp, Plus, Download } from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts'

const HelpdeskPage: React.FC = () => {
  const [year, setYear] = useState(new Date().getFullYear())
  const [month, setMonth] = useState<number | undefined>()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    loadData()
  }, [year, month])

  const loadData = async () => {
    setLoading(true)
    try {
      // Simular datos para demostración
      const mockData = {
        totalCases: 156,
        averageSatisfaction: 4.2,
        technicians: [
          { name: 'Técnico 1', cases: 45, satisfaction: 4.5 },
          { name: 'Técnico 2', cases: 38, satisfaction: 4.1 },
          { name: 'Técnico 3', cases: 42, satisfaction: 4.3 },
          { name: 'Técnico 4', cases: 31, satisfaction: 3.9 }
        ],
        responseTime: [
          { range: '< 4h', count: 89, percentage: 57 },
          { range: '4-8h', count: 35, percentage: 22 },
          { range: '8-16h', count: 23, percentage: 15 },
          { range: '> 16h', count: 9, percentage: 6 }
        ],
        monthlyTrend: [
          { month: 'Ene', cases: 142, satisfaction: 4.1 },
          { month: 'Feb', cases: 138, satisfaction: 4.0 },
          { month: 'Mar', cases: 151, satisfaction: 4.2 },
          { month: 'Abr', cases: 145, satisfaction: 4.1 },
          { month: 'May', cases: 159, satisfaction: 4.3 },
          { month: 'Jun', cases: 156, satisfaction: 4.2 }
        ]
      }
      setData(mockData)
    } catch (error) {
      console.error('Error al cargar datos:', error)
    } finally {
      setLoading(false)
    }
  }

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444']

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
            <h1 className="text-3xl font-bold text-gray-900">Mesa de Ayuda</h1>
            <p className="mt-2 text-gray-600">
              Gestión de casos y análisis de rendimiento de técnicos
            </p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline">
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
            title="Total de Casos"
            value={data.totalCases}
            subtitle="Este período"
            trend={{ value: 12, label: 'vs mes anterior', direction: 'up' }}
            icon={Users}
            color="blue"
          />
          
          <MetricCard
            title="Satisfacción Promedio"
            value={`${data.averageSatisfaction}/5`}
            subtitle="Encuesta de satisfacción"
            trend={{ value: 5, label: 'vs mes anterior', direction: 'up' }}
            icon={Star}
            color="green"
          />
          
          <MetricCard
            title="Tiempo Promedio"
            value="6.2h"
            subtitle="Tiempo de resolución"
            trend={{ value: -8, label: 'vs mes anterior', direction: 'down' }}
            icon={Clock}
            color="orange"
          />
          
          <MetricCard
            title="Casos Resueltos"
            value="94.2%"
            subtitle="Tasa de resolución"
            trend={{ value: 2, label: 'vs mes anterior', direction: 'up' }}
            icon={TrendingUp}
            color="purple"
          />
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartContainer
            title="Casos por Técnico"
            subtitle="Distribución de carga de trabajo"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.technicians}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="cases" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>

          <ChartContainer
            title="Distribución de Tiempos de Atención"
            subtitle="Porcentaje por rango de tiempo"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.responseTime}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ range, percentage }) => `${range}: ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {data.responseTime.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartContainer
            title="Tendencia Mensual de Casos"
            subtitle="Evolución de casos a lo largo del tiempo"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="cases" stroke="#3B82F6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>

          <ChartContainer
            title="Satisfacción por Técnico"
            subtitle="Calificación promedio de encuestas"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.technicians}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 5]} />
                <Tooltip />
                <Bar dataKey="satisfaction" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        {/* Tabla detallada */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Detalle por Técnico</h3>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Técnico
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Casos Asignados
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Satisfacción
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rendimiento
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.technicians.map((tech: any, index: number) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{tech.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{tech.cases}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 mr-1" />
                          <span className="text-sm text-gray-900">{tech.satisfaction}/5</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          tech.satisfaction >= 4.2 
                            ? 'bg-green-100 text-green-800'
                            : tech.satisfaction >= 4.0
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {tech.satisfaction >= 4.2 ? 'Excelente' : tech.satisfaction >= 4.0 ? 'Bueno' : 'Mejorar'}
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
    </Layout>
  )
}

export default HelpdeskPage

