'use client'

import React, { useState, useEffect } from 'react'
import Layout from '@/components/layout/Layout'
import DateFilter from '@/components/dashboard/DateFilter'
import MetricCard from '@/components/dashboard/MetricCard'
import ChartContainer from '@/components/dashboard/ChartContainer'
import { Card, CardHeader, CardContent } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { Monitor, Smartphone, Shield, AlertTriangle, Plus, Download } from 'lucide-react'
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
  Line,
  Area,
  AreaChart
} from 'recharts'

const EndpointsPage: React.FC = () => {
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
        totalDevices: 450,
        protectedDevices: 416,
        protectionRate: 92.4,
        computers: {
          total: 320,
          noIssues: 285,
          warning: 25,
          critical: 10
        },
        mobileDevices: {
          total: 130,
          protected: 120,
          pending: 10
        },
        monthlyTrend: [
          { month: 'Ene', computers: 88.5, mobile: 89.2, global: 88.8 },
          { month: 'Feb', computers: 89.1, mobile: 90.1, global: 89.6 },
          { month: 'Mar', computers: 90.2, mobile: 91.5, global: 90.8 },
          { month: 'Abr', computers: 91.0, mobile: 92.0, global: 91.5 },
          { month: 'May', computers: 91.8, mobile: 92.8, global: 92.3 },
          { month: 'Jun', computers: 89.1, mobile: 92.3, global: 90.7 }
        ],
        deviceTypes: [
          { type: 'Windows', count: 180, protected: 165 },
          { type: 'macOS', count: 85, protected: 82 },
          { type: 'Linux', count: 55, protected: 48 },
          { type: 'iOS', count: 75, protected: 72 },
          { type: 'Android', count: 55, protected: 49 }
        ]
      }
      setData(mockData)
    } catch (error) {
      console.error('Error al cargar datos:', error)
    } finally {
      setLoading(false)
    }
  }

  const COLORS = ['#10B981', '#F59E0B', '#EF4444']
  const DEVICE_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#F97316']

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    )
  }

  const computerStatusData = [
    { status: 'Sin inconvenientes', count: data.computers.noIssues, color: '#10B981' },
    { status: 'Advertencia', count: data.computers.warning, color: '#F59E0B' },
    { status: 'Crítico', count: data.computers.critical, color: '#EF4444' }
  ]

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Protección de Endpoints</h1>
            <p className="mt-2 text-gray-600">
              Estado de protección de computadores y dispositivos móviles
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
            title="Total de Dispositivos"
            value={data.totalDevices}
            subtitle="En la red"
            icon={Monitor}
            color="blue"
          />
          
          <MetricCard
            title="Dispositivos Protegidos"
            value={data.protectedDevices}
            subtitle={`${data.protectionRate}% del total`}
            trend={{ value: 3, label: 'vs mes anterior', direction: 'up' }}
            icon={Shield}
            color="green"
          />
          
          <MetricCard
            title="Computadores"
            value={`${Math.round((data.computers.noIssues / data.computers.total) * 100)}%`}
            subtitle="Sin inconvenientes"
            trend={{ value: -2, label: 'vs mes anterior', direction: 'down' }}
            icon={Monitor}
            color="orange"
          />
          
          <MetricCard
            title="Dispositivos Móviles"
            value={`${Math.round((data.mobileDevices.protected / data.mobileDevices.total) * 100)}%`}
            subtitle="Protegidos"
            trend={{ value: 5, label: 'vs mes anterior', direction: 'up' }}
            icon={Smartphone}
            color="purple"
          />
        </div>

        {/* Gráficos principales */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartContainer
            title="Estado de Computadores"
            subtitle="Distribución por estado de seguridad"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={computerStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ status, count }) => `${status}: ${count}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {computerStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>

          <ChartContainer
            title="Protección por Tipo de Dispositivo"
            subtitle="Dispositivos protegidos vs total"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.deviceTypes}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#E5E7EB" name="Total" />
                <Bar dataKey="protected" fill="#10B981" name="Protegidos" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        {/* Tendencia mensual */}
        <ChartContainer
          title="Tendencia de Protección Mensual"
          subtitle="Evolución del porcentaje de protección por tipo de dispositivo"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis domain={[80, 100]} />
              <Tooltip formatter={(value) => [`${value}%`, '']} />
              <Area type="monotone" dataKey="computers" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} name="Computadores" />
              <Area type="monotone" dataKey="mobile" stackId="2" stroke="#10B981" fill="#10B981" fillOpacity={0.6} name="Móviles" />
              <Line type="monotone" dataKey="global" stroke="#F59E0B" strokeWidth={3} name="Global" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* Tablas detalladas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Estado de Computadores</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {computerStatusData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className="font-medium text-gray-900">{item.status}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">{item.count}</div>
                      <div className="text-sm text-gray-500">
                        {Math.round((item.count / data.computers.total) * 100)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Dispositivos Móviles</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 rounded-full bg-green-500"></div>
                    <span className="font-medium text-gray-900">Protegidos</span>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">{data.mobileDevices.protected}</div>
                    <div className="text-sm text-gray-500">
                      {Math.round((data.mobileDevices.protected / data.mobileDevices.total) * 100)}%
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 rounded-full bg-red-500"></div>
                    <span className="font-medium text-gray-900">Pendientes</span>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">{data.mobileDevices.pending}</div>
                    <div className="text-sm text-gray-500">
                      {Math.round((data.mobileDevices.pending / data.mobileDevices.total) * 100)}%
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  )
}

export default EndpointsPage

