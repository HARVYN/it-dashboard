import { format, startOfMonth, endOfMonth, startOfQuarter, endOfQuarter, startOfYear, endOfYear } from 'date-fns'
import { es } from 'date-fns/locale'

export const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
]

export const QUARTERS = [
  { value: 1, label: 'Q1 (Ene-Mar)' },
  { value: 2, label: 'Q2 (Abr-Jun)' },
  { value: 3, label: 'Q3 (Jul-Sep)' },
  { value: 4, label: 'Q4 (Oct-Dic)' },
]

export function getCurrentYear(): number {
  return new Date().getFullYear()
}

export function getCurrentMonth(): number {
  return new Date().getMonth() + 1
}

export function getCurrentQuarter(): number {
  return Math.ceil(getCurrentMonth() / 3)
}

export function getYearsList(startYear?: number): number[] {
  const currentYear = getCurrentYear()
  const start = startYear || currentYear - 5
  const years = []
  
  for (let year = start; year <= currentYear; year++) {
    years.push(year)
  }
  
  return years.reverse()
}

export function getMonthName(month: number): string {
  return MONTHS[month - 1] || ''
}

export function getQuarterMonths(quarter: number): number[] {
  switch (quarter) {
    case 1: return [1, 2, 3]
    case 2: return [4, 5, 6]
    case 3: return [7, 8, 9]
    case 4: return [10, 11, 12]
    default: return []
  }
}

export function formatDate(date: Date, pattern: string = 'dd/MM/yyyy'): string {
  return format(date, pattern, { locale: es })
}

export function getDateRange(year: number, month?: number, quarter?: number) {
  if (month) {
    const date = new Date(year, month - 1, 1)
    return {
      start: startOfMonth(date),
      end: endOfMonth(date)
    }
  }
  
  if (quarter) {
    const date = new Date(year, (quarter - 1) * 3, 1)
    return {
      start: startOfQuarter(date),
      end: endOfQuarter(date)
    }
  }
  
  const date = new Date(year, 0, 1)
  return {
    start: startOfYear(date),
    end: endOfYear(date)
  }
}

export function getPreviousMonths(count: number = 6): Array<{ year: number; month: number; label: string }> {
  const months = []
  const currentDate = new Date()
  
  for (let i = 0; i < count; i++) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1)
    months.push({
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      label: `${getMonthName(date.getMonth() + 1)} ${date.getFullYear()}`
    })
  }
  
  return months
}

