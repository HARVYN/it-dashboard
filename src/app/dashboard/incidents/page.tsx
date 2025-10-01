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
import { AlertTriangle, Clock, Target, TrendingDown, Plus, Download } from 'lucide-react'
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
  AreaChart,
  Area
} from 'recharts'

const IncidentsPage: React.FC = () => {
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
        currentDowntime: 4.2, // horas
        totalYearlyHours: 8760, // horas en un año
        usedHours: 28.5, // horas usadas en el año
        remainingHours: 59.5, // horas restantes permitidas (SLA 99%)
        slaCompliance: 98.7,
        monthlyIncidents: [
          { month: 'Ene', downtime: 3.2, incidents: 2, sla: 99.1 },
          { month: 'Feb', downtime: 2.8, incidents: 1, sla: 99.2 },
          { month: 'Mar', downtime: 5.1, incidents: 3, sla: 98.8 },
          { month: 'Abr', downtime: 1.9, incidents: 1, sla: 99.3 },
          { month: 'May', downtime: 6.8, incidents: 4, sla: 98.5 },
          { month: 'Jun', downtime: 4.2, incidents: 2, sla: 98.7 }
        ],
        incidentsByType: [
          { type: 'Hardware', count: 5, avgDowntime: 3.2 },
          { type: 'Software', count: 8, avgDowntime: 2.1 },
          { type: 'Red', count: 3, avgDowntime: 4.8 },
          { type: 'Seguridad', count: 2, avgDowntime: 1.5 },
          { type: 'Otros', count: 4, avgDowntime: 2.8 }
        ],
        yearlyProjection: [
          { month: 'Ene', actual: 3.2, projected: 3.2, limit: 7.3 },
          { month: 'Feb', actual: 6.0, projected: 6.0, limit: 14.6 },
          { month: 'Mar', actual: 11.1, projected: 11.1, limit: 21.9 },
          { month: 'Abr', actual: 13.0, projected: 13.0, limit: 29.2 },
          { month: 'May', actual: 19.8, projected: 19.8, limit: 36.5 },
          { month: 'Jun', actual: 24.0, projected: 24.0, limit: 43.8 },
          { month: 'Jul', actual: null, projected: 28.2, limit: 51.1 },
          { month: 'Ago', actual: null, projected: 32.4, limit: 58.4 },
          { month: 'Sep', actual: null, projected: 36.6, limit: 65.7 },
          { month: 'Oct', actual: null, projected: 40.8, limit: 73.0 },
          { month: 'Nov', actual: null, projected: 45.0, limit: 80.3 },
          { month: 'Dic', actual: null, projected: 49.2, limit: 87.6 }
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
    setUploadModalOpen(false)
    await loadData()
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

  const slaStatus = data.slaCompliance >= 99 ? 'excellent' : data.slaCompliance >= 98 ? 'good' : 'critical'

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Incidentes de Tecnología</h1>
            <p className="mt-2 text-gray-600">
              Seguimiento de indisponibilidad y cumplimiento de SLA
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
            title="Indisponibilidad Actual"
            value={`${data.currentDowntime}h`}
            subtitle="Este mes"
            trend={{ value: -15, label: 'vs mes anterior', direction: 'down' }}
            icon={Clock}
            color="red"
          />
          
          <MetricCard
            title="Horas Usadas (Año)"
            value={`${data.usedHours}h`}
            subtitle={`de ${data.remainingHours + data.usedHours}h permitidas`}
            icon={AlertTriangle}
            color="orange"
          />
          
          <MetricCard
            title="Cumplimiento SLA"
            value={`${data.slaCompliance}%`}
            subtitle="Objetivo: 99%"
            trend={{ value: -0.2, label: 'vs mes anterior', direction: 'down' }}
            icon={Target}
            color={slaStatus === 'excellent' ? 'green' : slaStatus === 'good' ? 'yellow' : 'red'}
          />
          
          <MetricCard
            title="Proyección Anual"
            value="49.2h"
            subtitle="Estimado fin de año"
            icon={TrendingDown}
            color="blue"
          />
        </div>

        {/* Gráficos principales */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartContainer
            title="Tendencia Mensual de Incidentes"
            subtitle="Horas de indisponibilidad y número de incidentes"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.monthlyIncidents}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Bar yAxisId="left" dataKey="downtime" fill="#EF4444" name="Horas de Caída" />
                <Line yAxisId="right" type="monotone" dataKey="incidents" stroke="#3B82F6" strokeWidth={2} name="Incidentes" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>

          <ChartContainer
            title="Incidentes por Tipo"
            subtitle="Cantidad y tiempo promedio de resolución"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.incidentsByType} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="type" type="category" width={80} />
                <Tooltip />
                <Bar dataKey="count" fill="#3B82F6" name="Cantidad" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        {/* Proyección anual */}
        <ChartContainer
          title="Proyección Anual de Indisponibilidad"
          subtitle="Horas acumuladas vs límite de SLA (99% = 87.6h/año)"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.yearlyProjection}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="limit" 
                stackId="1" 
                stroke="#E5E7EB" 
                fill="#E5E7EB" 
                name="Límite SLA"
              />
              <Area 
                type="monotone" 
                dataKey="actual" 
                stackId="2" 
                stroke="#EF4444" 
                fill="#EF4444" 
                fillOpacity={0.8}
                name="Horas Reales"
              />
              <Line 
                type="monotone" 
                dataKey="projected" 
                stroke="#F59E0B" 
                strokeWidth={3}
                strokeDasharray="5 5"
                name="Proyección"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* Tablas detalladas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Resumen de SLA</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Objetivo SLA</span>
                  <span className="text-lg font-bold">99.0%</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">SLA Actual</span>
                  <span className={`text-lg font-bold ${
                    data.slaCompliance >= 99 ? 'text-green-600' : 
                    data.slaCompliance >= 98 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {data.slaCompliance}%
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Horas Permitidas/Año</span>
                  <span className="text-lg font-bold">87.6h</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Horas Usadas</span>
                  <span className="text-lg font-bold text-red-600">{data.usedHours}h</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Horas Restantes</span>
                  <span className="text-lg font-bold text-green-600">{data.remainingHours}h</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Análisis por Tipo de Incidente</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.incidentsByType.map((incident: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">{incident.type}</div>
                      <div className="text-sm text-gray-500">
                        {incident.count} incidentes
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">{incident.avgDowntime}h</div>
                      <div className="text-sm text-gray-500">promedio</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Modal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        title="Cargar Datos de Incidentes"
        size="lg"
      >
        <DataUploadForm
          dataType="incidents"
          onSubmit={handleDataUpload}
        />
      </Modal>
    </Layout>
  )
}

export default IncidentsPage

