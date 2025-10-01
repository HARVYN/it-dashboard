import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth'
import { buildWhereClause, calculatePercentage } from '@/utils/dataUtils'
import { DashboardStats } from '@/types'

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'No autorizado' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const year = searchParams.get('year') ? parseInt(searchParams.get('year')!) : undefined
    const month = searchParams.get('month') ? parseInt(searchParams.get('month')!) : undefined
    const quarter = searchParams.get('quarter') ? parseInt(searchParams.get('quarter')!) : undefined

    const where = buildWhereClause({ year, month, quarter })

    // Obtener datos de mesa de ayuda
    const helpdeskData = await prisma.helpdeskCase.findMany({
      where,
      include: { technician: true }
    })

    // Obtener datos de endpoints
    const endpointData = await prisma.endpointProtection.findMany({
      where
    })

    // Obtener datos de seguridad de servidores
    const serverSecurityData = await prisma.serverSecurity.findMany({
      where,
      include: { server: true, control: true }
    })

    // Obtener datos de ciberseguridad
    const cyberSecurityData = await prisma.cyberSecurity.findMany({
      where
    })

    // Obtener datos de incidentes de tecnología
    const techIncidentData = await prisma.techIncident.findMany({
      where
    })

    // Calcular estadísticas de mesa de ayuda
    const totalCases = helpdeskData.reduce((sum, item) => sum + item.totalCases, 0)
    const totalSatisfaction = helpdeskData.reduce((sum, item) => sum + (item.satisfactionAverage * item.totalCases), 0)
    const averageSatisfaction = totalCases > 0 ? totalSatisfaction / totalCases : 0

    const casesByTechnician = helpdeskData.reduce((acc, item) => {
      const existing = acc.find(t => t.technicianName === item.technician.name)
      if (existing) {
        existing.totalCases += item.totalCases
      } else {
        acc.push({
          technicianName: item.technician.name,
          totalCases: item.totalCases
        })
      }
      return acc
    }, [] as Array<{ technicianName: string; totalCases: number }>)

    const timeDistribution = helpdeskData.reduce((acc, item) => {
      acc.lessThan4h += item.timeLessThan4h
      acc.from4to8h += item.time4to8h
      acc.from8to16h += item.time8to16h
      acc.moreThan16h += item.timeMoreThan16h
      return acc
    }, { lessThan4h: 0, from4to8h: 0, from8to16h: 0, moreThan16h: 0 })

    // Calcular estadísticas de endpoints
    const endpointStats = endpointData.reduce((acc, item) => {
      acc.totalComputers += item.computersNoIssues + item.computersWarning + item.computersCritical
      acc.totalMobileDevices += item.mobileDevicesProtected + item.mobileDevicesPending
      acc.computerStatus.noIssues += item.computersNoIssues
      acc.computerStatus.warning += item.computersWarning
      acc.computerStatus.critical += item.computersCritical
      acc.mobileStatus.protected += item.mobileDevicesProtected
      acc.mobileStatus.pending += item.mobileDevicesPending
      return acc
    }, {
      totalComputers: 0,
      totalMobileDevices: 0,
      computerStatus: { noIssues: 0, warning: 0, critical: 0 },
      mobileStatus: { protected: 0, pending: 0 }
    })

    const globalProtectionPercent = endpointData.length > 0 
      ? endpointData.reduce((sum, item) => sum + item.globalProtectionPercent, 0) / endpointData.length 
      : 0

    // Calcular estadísticas de seguridad de servidores
    const totalServers = await prisma.server.count({ where: { isActive: true } })
    const totalControls = await prisma.securityControl.count({ where: { isActive: true } })
    
    const serverCompliance = serverSecurityData.reduce((acc, item) => {
      const existing = acc.find(s => s.serverName === item.server.name)
      if (existing) {
        existing.compliancePercent = (existing.compliancePercent + item.compliancePercent) / 2
      } else {
        acc.push({
          serverName: item.server.name,
          compliancePercent: item.compliancePercent
        })
      }
      return acc
    }, [] as Array<{ serverName: string; compliancePercent: number }>)

    const controlCompliance = serverSecurityData.reduce((acc, item) => {
      const existing = acc.find(c => c.controlName === item.control.name)
      if (existing) {
        existing.compliancePercent = (existing.compliancePercent + item.compliancePercent) / 2
      } else {
        acc.push({
          controlName: item.control.name,
          compliancePercent: item.compliancePercent
        })
      }
      return acc
    }, [] as Array<{ controlName: string; compliancePercent: number }>)

    const overallCompliance = serverSecurityData.length > 0
      ? serverSecurityData.reduce((sum, item) => sum + item.compliancePercent, 0) / serverSecurityData.length
      : 0

    // Calcular estadísticas de ciberseguridad
    const cyberStats = cyberSecurityData.reduce((acc, item) => {
      acc.totalAttacks += item.attacksFirewall + item.attacksAntivirus + item.attacksMicrosoft365 + item.attacksMEDRSOC
      acc.totalBlocked += item.blockedFirewall + item.blockedAntivirus + item.blockedMicrosoft365 + item.blockedMEDRSOC
      acc.attacksByVector.firewall += item.attacksFirewall
      acc.attacksByVector.antivirus += item.attacksAntivirus
      acc.attacksByVector.microsoft365 += item.attacksMicrosoft365
      acc.attacksByVector.medrSoc += item.attacksMEDRSOC
      return acc
    }, {
      totalAttacks: 0,
      totalBlocked: 0,
      attacksByVector: { firewall: 0, antivirus: 0, microsoft365: 0, medrSoc: 0 }
    })

    const overallBlockPercent = cyberStats.totalAttacks > 0 
      ? calculatePercentage(cyberStats.totalBlocked, cyberStats.totalAttacks)
      : 0

    const blockPercentByVector = cyberSecurityData.length > 0 ? {
      firewall: cyberSecurityData.reduce((sum, item) => sum + item.firewallBlockPercent, 0) / cyberSecurityData.length,
      antivirus: cyberSecurityData.reduce((sum, item) => sum + item.antivirusBlockPercent, 0) / cyberSecurityData.length,
      microsoft365: cyberSecurityData.reduce((sum, item) => sum + item.microsoft365BlockPercent, 0) / cyberSecurityData.length,
      medrSoc: cyberSecurityData.reduce((sum, item) => sum + item.medrSocBlockPercent, 0) / cyberSecurityData.length,
    } : { firewall: 0, antivirus: 0, microsoft365: 0, medrSoc: 0 }

    // Calcular estadísticas de incidentes de tecnología
    const techIncidentStats = techIncidentData.reduce((acc, item) => {
      acc.totalUnavailabilityHours += item.unavailabilityHours
      acc.availableHoursLeft = item.availableHoursLeft // Tomar el último valor
      acc.slaCompliance = item.slaCompliance // Tomar el último valor
      acc.annualProjection = item.annualProjection // Tomar el último valor
      return acc
    }, {
      totalUnavailabilityHours: 0,
      availableHoursLeft: 0,
      slaCompliance: 0,
      annualProjection: 0
    })

    const stats: DashboardStats = {
      helpdesk: {
        totalCases,
        averageSatisfaction,
        casesByTechnician,
        timeDistribution
      },
      endpoints: {
        totalComputers: endpointStats.totalComputers,
        totalMobileDevices: endpointStats.totalMobileDevices,
        globalProtectionPercent,
        computerStatus: endpointStats.computerStatus,
        mobileStatus: endpointStats.mobileStatus
      },
      serverSecurity: {
        totalServers,
        totalControls,
        overallCompliance,
        serverCompliance,
        controlCompliance
      },
      cyberSecurity: {
        totalAttacks: cyberStats.totalAttacks,
        totalBlocked: cyberStats.totalBlocked,
        overallBlockPercent,
        attacksByVector: cyberStats.attacksByVector,
        blockPercentByVector
      },
      techIncidents: techIncidentStats
    }

    return NextResponse.json({
      success: true,
      data: stats
    })

  } catch (error) {
    console.error('Error al obtener estadísticas del dashboard:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

