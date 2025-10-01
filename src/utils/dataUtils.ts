import { DashboardFilters } from '@/types'

export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0
  return Math.round((value / total) * 100 * 100) / 100 // Redondear a 2 decimales
}

export function formatNumber(value: number, decimals: number = 0): string {
  return new Intl.NumberFormat('es-ES', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value)
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }).format(value)
}

export function formatPercentage(value: number, decimals: number = 1): string {
  return `${formatNumber(value, decimals)}%`
}

export function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'compliant':
    case 'sin inconvenientes':
    case 'protegido':
      return 'text-green-600 bg-green-100'
    case 'warning':
    case 'advertencia':
    case 'pendiente':
      return 'text-yellow-600 bg-yellow-100'
    case 'critical':
    case 'crítico':
      return 'text-red-600 bg-red-100'
    default:
      return 'text-gray-600 bg-gray-100'
  }
}

export function getStatusLabel(status: string): string {
  switch (status.toLowerCase()) {
    case 'compliant': return 'Cumple'
    case 'warning': return 'Advertencia'
    case 'critical': return 'Crítico'
    default: return status
  }
}

export function buildWhereClause(filters: DashboardFilters) {
  const where: any = {}
  
  if (filters.year) {
    where.year = filters.year
  }
  
  if (filters.month) {
    where.month = filters.month
  } else if (filters.quarter) {
    const quarterMonths = getQuarterMonths(filters.quarter)
    where.month = { in: quarterMonths }
  }
  
  return where
}

function getQuarterMonths(quarter: number): number[] {
  switch (quarter) {
    case 1: return [1, 2, 3]
    case 2: return [4, 5, 6]
    case 3: return [7, 8, 9]
    case 4: return [10, 11, 12]
    default: return []
  }
}

export function aggregateDataByPeriod<T extends { year: number; month: number }>(
  data: T[],
  groupBy: 'month' | 'quarter' | 'year'
): Array<T & { period: string }> {
  const grouped = new Map<string, T[]>()
  
  data.forEach(item => {
    let key: string
    
    switch (groupBy) {
      case 'month':
        key = `${item.year}-${item.month.toString().padStart(2, '0')}`
        break
      case 'quarter':
        const quarter = Math.ceil(item.month / 3)
        key = `${item.year}-Q${quarter}`
        break
      case 'year':
        key = item.year.toString()
        break
    }
    
    if (!grouped.has(key)) {
      grouped.set(key, [])
    }
    grouped.get(key)!.push(item)
  })
  
  return Array.from(grouped.entries()).map(([period, items]) => {
    // Agregar los datos del período
    const aggregated = items.reduce((acc, item) => {
      Object.keys(item).forEach(key => {
        if (typeof item[key as keyof T] === 'number' && key !== 'year' && key !== 'month') {
          acc[key as keyof T] = (acc[key as keyof T] as number || 0) + (item[key as keyof T] as number)
        }
      })
      return acc
    }, { ...items[0] })
    
    return {
      ...aggregated,
      period
    }
  })
}

export function calculateTrend(current: number, previous: number): {
  value: number
  percentage: number
  direction: 'up' | 'down' | 'stable'
} {
  const difference = current - previous
  const percentage = previous === 0 ? 0 : (difference / previous) * 100
  
  let direction: 'up' | 'down' | 'stable'
  if (Math.abs(percentage) < 1) {
    direction = 'stable'
  } else if (percentage > 0) {
    direction = 'up'
  } else {
    direction = 'down'
  }
  
  return {
    value: difference,
    percentage: Math.abs(percentage),
    direction
  }
}

export function exportToCSV(data: any[], filename: string) {
  if (data.length === 0) return
  
  const headers = Object.keys(data[0])
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header]
        // Escapar comillas y envolver en comillas si contiene comas
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`
        }
        return value
      }).join(',')
    )
  ].join('\n')
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `${filename}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

