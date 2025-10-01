import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth'
import { buildWhereClause } from '@/utils/dataUtils'

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

    const cyberSecurityData = await prisma.cyberSecurity.findMany({
      where,
      orderBy: [
        { year: 'desc' },
        { month: 'desc' }
      ]
    })

    return NextResponse.json({
      success: true,
      data: cyberSecurityData
    })

  } catch (error) {
    console.error('Error al obtener datos de ciberseguridad:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'No autorizado' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      year,
      month,
      attacksFirewall,
      attacksAntivirus,
      attacksMicrosoft365,
      attacksMEDRSOC,
      blockedFirewall,
      blockedAntivirus,
      blockedMicrosoft365,
      blockedMEDRSOC,
      firewallBlockPercent,
      antivirusBlockPercent,
      microsoft365BlockPercent,
      medrSocBlockPercent
    } = body

    if (!year || !month) {
      return NextResponse.json(
        { success: false, error: 'Año y mes son requeridos' },
        { status: 400 }
      )
    }

    const cyberSecurity = await prisma.cyberSecurity.upsert({
      where: {
        year_month: { year, month }
      },
      update: {
        attacksFirewall: attacksFirewall || 0,
        attacksAntivirus: attacksAntivirus || 0,
        attacksMicrosoft365: attacksMicrosoft365 || 0,
        attacksMEDRSOC: attacksMEDRSOC || 0,
        blockedFirewall: blockedFirewall || 0,
        blockedAntivirus: blockedAntivirus || 0,
        blockedMicrosoft365: blockedMicrosoft365 || 0,
        blockedMEDRSOC: blockedMEDRSOC || 0,
        firewallBlockPercent: firewallBlockPercent || 0,
        antivirusBlockPercent: antivirusBlockPercent || 0,
        microsoft365BlockPercent: microsoft365BlockPercent || 0,
        medrSocBlockPercent: medrSocBlockPercent || 0,
      },
      create: {
        year,
        month,
        attacksFirewall: attacksFirewall || 0,
        attacksAntivirus: attacksAntivirus || 0,
        attacksMicrosoft365: attacksMicrosoft365 || 0,
        attacksMEDRSOC: attacksMEDRSOC || 0,
        blockedFirewall: blockedFirewall || 0,
        blockedAntivirus: blockedAntivirus || 0,
        blockedMicrosoft365: blockedMicrosoft365 || 0,
        blockedMEDRSOC: blockedMEDRSOC || 0,
        firewallBlockPercent: firewallBlockPercent || 0,
        antivirusBlockPercent: antivirusBlockPercent || 0,
        microsoft365BlockPercent: microsoft365BlockPercent || 0,
        medrSocBlockPercent: medrSocBlockPercent || 0,
      }
    })

    return NextResponse.json({
      success: true,
      data: cyberSecurity,
      message: 'Datos de ciberseguridad guardados exitosamente'
    })

  } catch (error) {
    console.error('Error al guardar datos de ciberseguridad:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

