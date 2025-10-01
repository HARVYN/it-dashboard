'use client'

import React, { useState } from 'react'
import { Card, CardHeader, CardContent } from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import { Upload, FileText, Calendar } from 'lucide-react'

interface DataUploadFormProps {
  dataType: 'helpdesk' | 'endpoints' | 'servers' | 'cybersecurity' | 'incidents'
  onSubmit: (data: any) => Promise<void>
}

const DataUploadForm: React.FC<DataUploadFormProps> = ({ dataType, onSubmit }) => {
  const [formData, setFormData] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    data: {}
  })
  const [loading, setLoading] = useState(false)

  const months = [
    { value: 1, label: 'Enero' },
    { value: 2, label: 'Febrero' },
    { value: 3, label: 'Marzo' },
    { value: 4, label: 'Abril' },
    { value: 5, label: 'Mayo' },
    { value: 6, label: 'Junio' },
    { value: 7, label: 'Julio' },
    { value: 8, label: 'Agosto' },
    { value: 9, label: 'Septiembre' },
    { value: 10, label: 'Octubre' },
    { value: 11, label: 'Noviembre' },
    { value: 12, label: 'Diciembre' }
  ]

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 5 }, (_, i) => ({
    value: currentYear - i,
    label: (currentYear - i).toString()
  }))

  const getFormFields = () => {
    switch (dataType) {
      case 'helpdesk':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Total de Casos"
              type="number"
              value={formData.data.totalCases || ''}
              onChange={(e) => setFormData({
                ...formData,
                data: { ...formData.data, totalCases: parseInt(e.target.value) || 0 }
              })}
              placeholder="156"
            />
            <Input
              label="Satisfacción Promedio (1-5)"
              type="number"
              step="0.1"
              min="1"
              max="5"
              value={formData.data.averageSatisfaction || ''}
              onChange={(e) => setFormData({
                ...formData,
                data: { ...formData.data, averageSatisfaction: parseFloat(e.target.value) || 0 }
              })}
              placeholder="4.2"
            />
            <Input
              label="Casos < 4h"
              type="number"
              value={formData.data.cases4h || ''}
              onChange={(e) => setFormData({
                ...formData,
                data: { ...formData.data, cases4h: parseInt(e.target.value) || 0 }
              })}
              placeholder="89"
            />
            <Input
              label="Casos 4-8h"
              type="number"
              value={formData.data.cases8h || ''}
              onChange={(e) => setFormData({
                ...formData,
                data: { ...formData.data, cases8h: parseInt(e.target.value) || 0 }
              })}
              placeholder="35"
            />
            <Input
              label="Casos 8-16h"
              type="number"
              value={formData.data.cases16h || ''}
              onChange={(e) => setFormData({
                ...formData,
                data: { ...formData.data, cases16h: parseInt(e.target.value) || 0 }
              })}
              placeholder="23"
            />
            <Input
              label="Casos > 16h"
              type="number"
              value={formData.data.casesOver16h || ''}
              onChange={(e) => setFormData({
                ...formData,
                data: { ...formData.data, casesOver16h: parseInt(e.target.value) || 0 }
              })}
              placeholder="9"
            />
          </div>
        )
      
      case 'endpoints':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Total de Dispositivos"
              type="number"
              value={formData.data.totalDevices || ''}
              onChange={(e) => setFormData({
                ...formData,
                data: { ...formData.data, totalDevices: parseInt(e.target.value) || 0 }
              })}
              placeholder="450"
            />
            <Input
              label="Dispositivos Protegidos"
              type="number"
              value={formData.data.protectedDevices || ''}
              onChange={(e) => setFormData({
                ...formData,
                data: { ...formData.data, protectedDevices: parseInt(e.target.value) || 0 }
              })}
              placeholder="416"
            />
            <Input
              label="Computadores Sin Problemas"
              type="number"
              value={formData.data.computersOk || ''}
              onChange={(e) => setFormData({
                ...formData,
                data: { ...formData.data, computersOk: parseInt(e.target.value) || 0 }
              })}
              placeholder="285"
            />
            <Input
              label="Computadores con Advertencia"
              type="number"
              value={formData.data.computersWarning || ''}
              onChange={(e) => setFormData({
                ...formData,
                data: { ...formData.data, computersWarning: parseInt(e.target.value) || 0 }
              })}
              placeholder="25"
            />
            <Input
              label="Computadores Críticos"
              type="number"
              value={formData.data.computersCritical || ''}
              onChange={(e) => setFormData({
                ...formData,
                data: { ...formData.data, computersCritical: parseInt(e.target.value) || 0 }
              })}
              placeholder="10"
            />
            <Input
              label="Móviles Protegidos"
              type="number"
              value={formData.data.mobileProtected || ''}
              onChange={(e) => setFormData({
                ...formData,
                data: { ...formData.data, mobileProtected: parseInt(e.target.value) || 0 }
              })}
              placeholder="120"
            />
          </div>
        )

      default:
        return (
          <div className="text-center py-8">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-500">
              Formulario de carga para {dataType} en desarrollo
            </p>
          </div>
        )
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      await onSubmit(formData)
      // Reset form
      setFormData({
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        data: {}
      })
    } catch (error) {
      console.error('Error al cargar datos:', error)
    } finally {
      setLoading(false)
    }
  }

  const getTitle = () => {
    switch (dataType) {
      case 'helpdesk': return 'Mesa de Ayuda'
      case 'endpoints': return 'Protección de Endpoints'
      case 'servers': return 'Seguridad de Servidores'
      case 'cybersecurity': return 'Ciberseguridad'
      case 'incidents': return 'Incidentes de Tecnología'
      default: return 'Carga de Datos'
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Upload className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold">Cargar Datos - {getTitle()}</h3>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Selección de período */}
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <Calendar className="h-5 w-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Período:</span>
            
            <Select
              value={formData.year.toString()}
              onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
              options={years.map(y => ({ value: y.value.toString(), label: y.label }))}
            />
            
            <Select
              value={formData.month.toString()}
              onChange={(e) => setFormData({ ...formData, month: parseInt(e.target.value) })}
              options={months.map(m => ({ value: m.value.toString(), label: m.label }))}
            />
          </div>

          {/* Campos específicos del tipo de datos */}
          {getFormFields()}

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setFormData({
                year: new Date().getFullYear(),
                month: new Date().getMonth() + 1,
                data: {}
              })}
            >
              Limpiar
            </Button>
            <Button
              type="submit"
              loading={loading}
            >
              Cargar Datos
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default DataUploadForm

