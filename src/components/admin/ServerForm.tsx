'use client'

import React, { useState } from 'react'
import { Server } from '@/types'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'

interface ServerFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: { name: string; description?: string; isActive?: boolean }) => Promise<void>
  server?: Server
  loading?: boolean
}

const ServerForm: React.FC<ServerFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  server,
  loading = false
}) => {
  const [formData, setFormData] = useState({
    name: server?.name || '',
    description: server?.description || '',
    isActive: server?.isActive ?? true
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    // Validación
    const newErrors: { [key: string]: string } = {}
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      await onSubmit({
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        isActive: formData.isActive
      })
      onClose()
      setFormData({ name: '', description: '', isActive: true })
    } catch (error) {
      console.error('Error al guardar servidor:', error)
    }
  }

  const handleClose = () => {
    onClose()
    setFormData({ name: '', description: '', isActive: true })
    setErrors({})
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={server ? 'Editar Servidor' : 'Nuevo Servidor'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nombre *"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          error={errors.name}
          placeholder="Nombre del servidor"
        />

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Descripción
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Descripción del servidor"
            rows={3}
            className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        {server && (
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
              Activo
            </label>
          </div>
        )}

        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            loading={loading}
          >
            {server ? 'Actualizar' : 'Crear'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default ServerForm

