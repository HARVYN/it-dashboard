'use client'

import React from 'react'
import Select from '@/components/ui/Select'
import { Calendar } from 'lucide-react'

interface DateFilterProps {
  year: number
  quarter?: number
  month?: number
  onYearChange: (year: number) => void
  onQuarterChange?: (quarter: number | undefined) => void
  onMonthChange?: (month: number | undefined) => void
  showQuarter?: boolean
  showMonth?: boolean
}

const DateFilter: React.FC<DateFilterProps> = ({
  year,
  quarter,
  month,
  onYearChange,
  onQuarterChange,
  onMonthChange,
  showQuarter = false,
  showMonth = false
}) => {
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i)
  
  const quarters = [
    { value: 1, label: 'Q1 (Ene-Mar)' },
    { value: 2, label: 'Q2 (Abr-Jun)' },
    { value: 3, label: 'Q3 (Jul-Sep)' },
    { value: 4, label: 'Q4 (Oct-Dic)' }
  ]

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

  return (
    <div className="flex items-center space-x-4 p-4 bg-white rounded-lg border border-gray-200">
      <div className="flex items-center space-x-2">
        <Calendar className="h-5 w-5 text-gray-500" />
        <span className="text-sm font-medium text-gray-700">Filtros:</span>
      </div>

      <Select
        value={year.toString()}
        onChange={(e) => onYearChange(parseInt(e.target.value))}
        options={years.map(y => ({ value: y.toString(), label: y.toString() }))}
        placeholder="Año"
      />

      {showQuarter && onQuarterChange && (
        <Select
          value={quarter?.toString() || ''}
          onChange={(e) => onQuarterChange(e.target.value ? parseInt(e.target.value) : undefined)}
          options={quarters.map(q => ({ value: q.value.toString(), label: q.label }))}
          placeholder="Todos los trimestres"
        />
      )}

      {showMonth && onMonthChange && (
        <Select
          value={month?.toString() || ''}
          onChange={(e) => onMonthChange(e.target.value ? parseInt(e.target.value) : undefined)}
          options={months.map(m => ({ value: m.value.toString(), label: m.label }))}
          placeholder="Todos los meses"
        />
      )}
    </div>
  )
}

export default DateFilter

