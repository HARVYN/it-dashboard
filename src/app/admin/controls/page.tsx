'use client'

import React, { useState, useEffect } from 'react'
import Layout from '@/components/layout/Layout'
import { Card, CardHeader, CardContent } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import SecurityControlForm from '@/components/admin/SecurityControlForm'
import { apiClient } from '@/lib/api'
import { SecurityControl } from '@/types'
import { Plus, Edit, Trash2, Activity } from 'lucide-react'

const SecurityControlsPage: React.FC = () => {
  const [controls, setControls] = useState<SecurityControl[]>([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [editingControl, setEditingControl] = useState<SecurityControl | undefined>()
  const [formLoading, setFormLoading] = useState(false)

  useEffect(() => {
    loadControls()
  }, [])

  const loadControls = async () => {
    try {
      const response = await apiClient.getSecurityControls()
      if (response.success && response.data) {
        setControls(response.data)
      }
    } catch (error) {
      console.error('Error al cargar controles de seguridad:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (data: { name: string; description?: string; category: string }) => {
    setFormLoading(true)
    try {
      const response = await apiClient.createSecurityControl(data)
      if (response.success) {
        await loadControls()
        setFormOpen(false)
      }
    } catch (error) {
      console.error('Error al crear control de seguridad:', error)
    } finally {
      setFormLoading(false)
    }
  }

  const handleUpdate = async (data: { name: string; description?: string; category: string; isActive: boolean }) => {
    if (!editingControl) return
    
    setFormLoading(true)
    try {
      const response = await apiClient.updateSecurityControl(editingControl.id, data)
      if (response.success) {
        await loadControls()
        setEditingControl(undefined)
      }
    } catch (error) {
      console.error('Error al actualizar control de seguridad:', error)
    } finally {
      setFormLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este control de seguridad?')) return
    
    try {
      const response = await apiClient.deleteSecurityControl(id)
      if (response.success) {
        await loadControls()
      }
    } catch (error) {
      console.error('Error al eliminar control de seguridad:', error)
    }
  }

  const openEditForm = (control: SecurityControl) => {
    setEditingControl(control)
  }

  const closeForm = () => {
    setFormOpen(false)
    setEditingControl(undefined)
  }

  const groupedControls = controls.reduce((acc, control) => {
    if (!acc[control.category]) {
      acc[control.category] = []
    }
    acc[control.category].push(control)
    return acc
  }, {} as Record<string, SecurityControl[]>)

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
            <h1 className="text-3xl font-bold text-gray-900">Controles de Seguridad</h1>
            <p className="mt-2 text-gray-600">
              Administra los controles de seguridad de la infraestructura
            </p>
          </div>
          <Button
            onClick={() => setFormOpen(true)}
            className="flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Nuevo Control</span>
          </Button>
        </div>

        {controls.length === 0 ? (
          <Card>
            <CardContent>
              <div className="text-center py-8">
                <Activity className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No hay controles de seguridad</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Comienza agregando un nuevo control de seguridad.
                </p>
                <div className="mt-6">
                  <Button onClick={() => setFormOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nuevo Control
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedControls).map(([category, categoryControls]) => (
              <Card key={category}>
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Activity className="h-5 w-5 text-blue-600" />
                    <h2 className="text-xl font-semibold">{category}</h2>
                    <span className="text-sm text-gray-500">({categoryControls.length})</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Nombre
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Descripción
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Estado
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Fecha de Creación
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Acciones
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {categoryControls.map((control) => (
                          <tr key={control.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {control.name}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-500 max-w-xs truncate">
                                {control.description || '-'}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                control.isActive
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {control.isActive ? 'Activo' : 'Inactivo'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(control.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex justify-end space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => openEditForm(control)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDelete(control.id)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <SecurityControlForm
        isOpen={formOpen || !!editingControl}
        onClose={closeForm}
        onSubmit={editingControl ? handleUpdate : handleCreate}
        control={editingControl}
        loading={formLoading}
      />
    </Layout>
  )
}

export default SecurityControlsPage

