'use client'

import React, { useState } from 'react'
import { SecurityControl } from '@/types'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'

interface SecurityControlFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: { name: string; description?: string; category: string; isActive?: boolean }) => Promise<void>
  control?: SecurityControl
  loading?: boolean
}

const CATEGORIES = [
  { value: 'Endpoint Protection', label: 'Protección de Endpoints' },
  { value: 'Network Security', label: 'Seguridad de Red' },
  { value: 'Patch Management', label: 'Gestión de Parches' },
  { value: 'Data Protection', label: 'Protección de Datos' },
  { value: 'Monitoring', label: 'Monitoreo' },
  { value: 'Access Control', label: 'Control de Acceso' },
  { value: 'Backup & Recovery', label: 'Respaldo y Recuperación' },
  { value: 'Compliance', label: 'Cumplimiento' },
]

const SecurityControlForm: React.FC<SecurityControlFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  control,
  loading = false
}) => {
  const [formData, setFormData] = useState({
    name: control?.name || '',
    description: control?.description || '',
    category: control?.category || '',
    isActive: control?.isActive ?? true
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
    if (!formData.category) {
      newErrors.category = 'La categoría es requerida'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      await onSubmit({
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        category: formData.category,
        isActive: formData.isActive
      })
      onClose()
      setFormData({ name: '', description: '', category: '', isActive: true })
    } catch (error) {
      console.error('Error al guardar control de seguridad:', error)
    }
  }

  const handleClose = () => {
    onClose()
    setFormData({ name: '', description: '', category: '', isActive: true })
    setErrors({})
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={control ? 'Editar Control de Seguridad' : 'Nuevo Control de Seguridad'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nombre *"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          error={errors.name}
          placeholder="Nombre del control"
        />

        <Select
          label="Categoría *"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          options={CATEGORIES}
          placeholder="Selecciona una categoría"
          error={errors.category}
        />

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Descripción
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Descripción del control de seguridad"
            rows={3}
            className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        {control && (
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
            {control ? 'Actualizar' : 'Crear'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default SecurityControlForm

