'use client'

import React, { useState, useEffect } from 'react'
import Layout from '@/components/layout/Layout'
import { Card, CardHeader, CardContent } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import TechnicianForm from '@/components/admin/TechnicianForm'
import { apiClient } from '@/lib/api'
import { Technician } from '@/types'
import { Plus, Edit, Trash2, Users } from 'lucide-react'

const TechniciansPage: React.FC = () => {
  const [technicians, setTechnicians] = useState<Technician[]>([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [editingTechnician, setEditingTechnician] = useState<Technician | undefined>()
  const [formLoading, setFormLoading] = useState(false)

  useEffect(() => {
    loadTechnicians()
  }, [])

  const loadTechnicians = async () => {
    try {
      const response = await apiClient.getTechnicians()
      if (response.success && response.data) {
        setTechnicians(response.data)
      }
    } catch (error) {
      console.error('Error al cargar técnicos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (data: { name: string; email?: string }) => {
    setFormLoading(true)
    try {
      const response = await apiClient.createTechnician(data)
      if (response.success) {
        await loadTechnicians()
        setFormOpen(false)
      }
    } catch (error) {
      console.error('Error al crear técnico:', error)
    } finally {
      setFormLoading(false)
    }
  }

  const handleUpdate = async (data: { name: string; email?: string; isActive: boolean }) => {
    if (!editingTechnician) return
    
    setFormLoading(true)
    try {
      const response = await apiClient.updateTechnician(editingTechnician.id, data)
      if (response.success) {
        await loadTechnicians()
        setEditingTechnician(undefined)
      }
    } catch (error) {
      console.error('Error al actualizar técnico:', error)
    } finally {
      setFormLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este técnico?')) return
    
    try {
      const response = await apiClient.deleteTechnician(id)
      if (response.success) {
        await loadTechnicians()
      }
    } catch (error) {
      console.error('Error al eliminar técnico:', error)
    }
  }

  const openEditForm = (technician: Technician) => {
    setEditingTechnician(technician)
  }

  const closeForm = () => {
    setFormOpen(false)
    setEditingTechnician(undefined)
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
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Técnicos</h1>
            <p className="mt-2 text-gray-600">
              Administra los técnicos de mesa de ayuda
            </p>
          </div>
          <Button
            onClick={() => setFormOpen(true)}
            className="flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Nuevo Técnico</span>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-600" />
              <h2 className="text-xl font-semibold">Técnicos Registrados</h2>
            </div>
          </CardHeader>
          <CardContent>
            {technicians.length === 0 ? (
              <div className="text-center py-8">
                <Users className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No hay técnicos</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Comienza agregando un nuevo técnico.
                </p>
                <div className="mt-6">
                  <Button onClick={() => setFormOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nuevo Técnico
                  </Button>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nombre
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
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
                    {technicians.map((technician) => (
                      <tr key={technician.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {technician.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {technician.email || '-'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            technician.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {technician.isActive ? 'Activo' : 'Inactivo'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(technician.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditForm(technician)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(technician.id)}
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
            )}
          </CardContent>
        </Card>
      </div>

      <TechnicianForm
        isOpen={formOpen || !!editingTechnician}
        onClose={closeForm}
        onSubmit={editingTechnician ? handleUpdate : handleCreate}
        technician={editingTechnician}
        loading={formLoading}
      />
    </Layout>
  )
}

export default TechniciansPage

