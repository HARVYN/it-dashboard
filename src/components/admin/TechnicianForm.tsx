'use client'

import React, { useState } from 'react'
import { Technician } from '@/types'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'

interface TechnicianFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: { name: string; email?: string; isActive?: boolean }) => Promise<void>
  technician?: Technician
  loading?: boolean
}

const TechnicianForm: React.FC<TechnicianFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  technician,
  loading = false
}) => {
  const [formData, setFormData] = useState({
    name: technician?.name || '',
    email: technician?.email || '',
    isActive: technician?.isActive ?? true
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
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      await onSubmit({
        name: formData.name.trim(),
        email: formData.email.trim() || undefined,
        isActive: formData.isActive
      })
      onClose()
      setFormData({ name: '', email: '', isActive: true })
    } catch (error) {
      console.error('Error al guardar técnico:', error)
    }
  }

  const handleClose = () => {
    onClose()
    setFormData({ name: '', email: '', isActive: true })
    setErrors({})
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={technician ? 'Editar Técnico' : 'Nuevo Técnico'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nombre *"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          error={errors.name}
          placeholder="Nombre del técnico"
        />

        <Input
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          error={errors.email}
          placeholder="email@empresa.com"
        />

        {technician && (
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
            {technician ? 'Actualizar' : 'Crear'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default TechnicianForm

