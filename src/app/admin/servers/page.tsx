'use client'

import React, { useState, useEffect } from 'react'
import Layout from '@/components/layout/Layout'
import { Card, CardHeader, CardContent } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import ServerForm from '@/components/admin/ServerForm'
import { apiClient } from '@/lib/api'
import { Server } from '@/types'
import { Plus, Edit, Trash2, Server as ServerIcon } from 'lucide-react'

const ServersPage: React.FC = () => {
  const [servers, setServers] = useState<Server[]>([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [editingServer, setEditingServer] = useState<Server | undefined>()
  const [formLoading, setFormLoading] = useState(false)

  useEffect(() => {
    loadServers()
  }, [])

  const loadServers = async () => {
    try {
      const response = await apiClient.getServers()
      if (response.success && response.data) {
        setServers(response.data)
      }
    } catch (error) {
      console.error('Error al cargar servidores:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (data: { name: string; description?: string }) => {
    setFormLoading(true)
    try {
      const response = await apiClient.createServer(data)
      if (response.success) {
        await loadServers()
        setFormOpen(false)
      }
    } catch (error) {
      console.error('Error al crear servidor:', error)
    } finally {
      setFormLoading(false)
    }
  }

  const handleUpdate = async (data: { name: string; description?: string; isActive: boolean }) => {
    if (!editingServer) return
    
    setFormLoading(true)
    try {
      const response = await apiClient.updateServer(editingServer.id, data)
      if (response.success) {
        await loadServers()
        setEditingServer(undefined)
      }
    } catch (error) {
      console.error('Error al actualizar servidor:', error)
    } finally {
      setFormLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este servidor?')) return
    
    try {
      const response = await apiClient.deleteServer(id)
      if (response.success) {
        await loadServers()
      }
    } catch (error) {
      console.error('Error al eliminar servidor:', error)
    }
  }

  const openEditForm = (server: Server) => {
    setEditingServer(server)
  }

  const closeForm = () => {
    setFormOpen(false)
    setEditingServer(undefined)
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
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Servidores</h1>
            <p className="mt-2 text-gray-600">
              Administra los servidores de la infraestructura
            </p>
          </div>
          <Button
            onClick={() => setFormOpen(true)}
            className="flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Nuevo Servidor</span>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <ServerIcon className="h-5 w-5 text-blue-600" />
              <h2 className="text-xl font-semibold">Servidores Registrados</h2>
            </div>
          </CardHeader>
          <CardContent>
            {servers.length === 0 ? (
              <div className="text-center py-8">
                <ServerIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No hay servidores</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Comienza agregando un nuevo servidor.
                </p>
                <div className="mt-6">
                  <Button onClick={() => setFormOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nuevo Servidor
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
                    {servers.map((server) => (
                      <tr key={server.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {server.name}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-500 max-w-xs truncate">
                            {server.description || '-'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            server.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {server.isActive ? 'Activo' : 'Inactivo'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(server.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditForm(server)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(server.id)}
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

      <ServerForm
        isOpen={formOpen || !!editingServer}
        onClose={closeForm}
        onSubmit={editingServer ? handleUpdate : handleCreate}
        server={editingServer}
        loading={formLoading}
      />
    </Layout>
  )
}

export default ServersPage

