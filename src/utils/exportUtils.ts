import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export const exportToPDF = async (elementId: string, filename: string = 'dashboard-report.pdf') => {
  try {
    const element = document.getElementById(elementId)
    if (!element) {
      throw new Error('Elemento no encontrado')
    }

    // Configurar opciones para html2canvas
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    })

    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF('p', 'mm', 'a4')
    
    const imgWidth = 210 // A4 width in mm
    const pageHeight = 295 // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    let heightLeft = imgHeight

    let position = 0

    // Agregar primera página
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight

    // Agregar páginas adicionales si es necesario
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }

    // Descargar el PDF
    pdf.save(filename)
    
    return { success: true }
  } catch (error) {
    console.error('Error al exportar PDF:', error)
    return { success: false, error: error.message }
  }
}

export const generateReportData = (data: any, reportType: string) => {
  const currentDate = new Date().toLocaleDateString('es-ES')
  
  const reportHeader = {
    title: getReportTitle(reportType),
    subtitle: `Reporte generado el ${currentDate}`,
    period: data.period || 'Período actual'
  }

  return {
    header: reportHeader,
    data: data,
    timestamp: new Date().toISOString()
  }
}

const getReportTitle = (reportType: string): string => {
  switch (reportType) {
    case 'helpdesk':
      return 'Reporte de Mesa de Ayuda'
    case 'endpoints':
      return 'Reporte de Protección de Endpoints'
    case 'servers':
      return 'Reporte de Seguridad de Servidores'
    case 'cybersecurity':
      return 'Reporte de Ciberseguridad'
    case 'incidents':
      return 'Reporte de Incidentes de Tecnología'
    default:
      return 'Reporte del Dashboard IT'
  }
}

export const exportToCSV = (data: any[], filename: string = 'data-export.csv') => {
  try {
    if (!data || data.length === 0) {
      throw new Error('No hay datos para exportar')
    }

    // Obtener headers de las claves del primer objeto
    const headers = Object.keys(data[0])
    
    // Crear contenido CSV
    const csvContent = [
      headers.join(','), // Header row
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

    // Crear y descargar archivo
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', filename)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }

    return { success: true }
  } catch (error) {
    console.error('Error al exportar CSV:', error)
    return { success: false, error: error.message }
  }
}

