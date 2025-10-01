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
import { Shield, Zap, Target, TrendingUp, Plus, Download } from 'lucide-react'
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
  ComposedChart
} from 'recharts'

const CybersecurityPage: React.FC = () => {
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
        totalAttacks: 1247,
        blockedAttacks: 1112,
        blockingRate: 89.2,
        attacksByVector: [
          { vector: 'Firewall', attacks: 456, blocked: 432, rate: 94.7 },
          { vector: 'Antivirus', attacks: 298, blocked: 289, rate: 97.0 },
          { vector: 'Microsoft 365', attacks: 234, blocked: 201, rate: 85.9 },
          { vector: 'MEDR / SOC SaaS', attacks: 259, blocked: 190, rate: 73.4 }
        ],
        monthlyTrend: [
          { month: 'Ene', attacks: 1156, blocked: 1024, rate: 88.6 },
          { month: 'Feb', attacks: 1089, blocked: 978, rate: 89.8 },
          { month: 'Mar', attacks: 1234, blocked: 1098, rate: 89.0 },
          { month: 'Abr', attacks: 1178, blocked: 1067, rate: 90.6 },
          { month: 'May', attacks: 1298, blocked: 1156, rate: 89.1 },
          { month: 'Jun', attacks: 1247, blocked: 1112, rate: 89.2 }
        ],
        attackTypes: [
          { type: 'Malware', count: 387, percentage: 31 },
          { type: 'Phishing', count: 298, percentage: 24 },
          { type: 'Ransomware', count: 187, percentage: 15 },
          { type: 'DDoS', count: 156, percentage: 12 },
          { type: 'Otros', count: 219, percentage: 18 }
        ],
        effectiveness: [
          { component: 'Firewall', jan: 94.2, feb: 95.1, mar: 94.8, apr: 95.5, may: 94.9, jun: 94.7 },
          { component: 'Antivirus', jan: 96.8, feb: 97.2, mar: 96.9, apr: 97.1, may: 97.3, jun: 97.0 },
          { component: 'Microsoft 365', jan: 84.5, feb: 85.2, mar: 86.1, apr: 85.8, may: 86.3, jun: 85.9 },
          { component: 'MEDR/SOC', jan: 72.1, feb: 73.8, mar: 74.2, apr: 73.9, may: 74.1, jun: 73.4 }
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

  const COLORS = ['#EF4444', '#F59E0B', '#8B5CF6', '#3B82F6', '#10B981']

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
            <h1 className="text-3xl font-bold text-gray-900">Ciberseguridad</h1>
            <p className="mt-2 text-gray-600">
              Análisis de ataques cibernéticos y efectividad de bloqueo
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
            title="Total de Ataques"
            value={data.totalAttacks.toLocaleString()}
            subtitle="Detectados este período"
            trend={{ value: 8, label: 'vs mes anterior', direction: 'up' }}
            icon={Target}
            color="red"
          />
          
          <MetricCard
            title="Ataques Bloqueados"
            value={data.blockedAttacks.toLocaleString()}
            subtitle={`${data.blockingRate}% efectividad`}
            trend={{ value: 2, label: 'vs mes anterior', direction: 'up' }}
            icon={Shield}
            color="green"
          />
          
          <MetricCard
            title="Tasa de Bloqueo"
            value={`${data.blockingRate}%`}
            subtitle="Efectividad global"
            trend={{ value: -1, label: 'vs mes anterior', direction: 'down' }}
            icon={TrendingUp}
            color="blue"
          />
          
          <MetricCard
            title="Vector Más Efectivo"
            value="Antivirus"
            subtitle="97.0% de bloqueo"
            icon={Zap}
            color="purple"
          />
        </div>

        {/* Gráficos principales */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartContainer
            title="Ataques por Vector de Seguridad"
            subtitle="Cantidad de ataques y tasa de bloqueo"
          >
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data.attacksByVector}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="vector" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Bar yAxisId="left" dataKey="attacks" fill="#EF4444" name="Ataques" />
                <Bar yAxisId="left" dataKey="blocked" fill="#10B981" name="Bloqueados" />
                <Line yAxisId="right" type="monotone" dataKey="rate" stroke="#3B82F6" strokeWidth={3} name="% Bloqueo" />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartContainer>

          <ChartContainer
            title="Tipos de Ataques"
            subtitle="Distribución por categoría"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.attackTypes}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ type, percentage }) => `${type}: ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {data.attackTypes.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        {/* Tendencia mensual */}
        <ChartContainer
          title="Tendencia Mensual de Ataques y Bloqueos"
          subtitle="Evolución de ataques detectados y bloqueados"
        >
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data.monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" domain={[85, 95]} />
              <Tooltip />
              <Bar yAxisId="left" dataKey="attacks" fill="#EF4444" name="Ataques" />
              <Bar yAxisId="left" dataKey="blocked" fill="#10B981" name="Bloqueados" />
              <Line yAxisId="right" type="monotone" dataKey="rate" stroke="#3B82F6" strokeWidth={3} name="% Efectividad" />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* Tablas detalladas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Efectividad por Componente</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.attacksByVector.map((vector: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">{vector.vector}</div>
                      <div className="text-sm text-gray-500">
                        {vector.blocked} de {vector.attacks} bloqueados
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">{vector.rate}%</div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        vector.rate >= 95 
                          ? 'bg-green-100 text-green-800'
                          : vector.rate >= 85
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {vector.rate >= 95 ? 'Excelente' : vector.rate >= 85 ? 'Bueno' : 'Mejorar'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Tipos de Ataques Detectados</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.attackTypes.map((attack: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      ></div>
                      <span className="font-medium text-gray-900">{attack.type}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">{attack.count}</div>
                      <div className="text-sm text-gray-500">{attack.percentage}%</div>
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
        title="Cargar Datos de Ciberseguridad"
        size="lg"
      >
        <DataUploadForm
          dataType="cybersecurity"
          onSubmit={handleDataUpload}
        />
      </Modal>
    </Layout>
  )
}

export default CybersecurityPage

