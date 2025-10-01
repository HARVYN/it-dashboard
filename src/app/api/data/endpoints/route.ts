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

    const endpointData = await prisma.endpointProtection.findMany({
      where,
      orderBy: [
        { year: 'desc' },
        { month: 'desc' }
      ]
    })

    return NextResponse.json({
      success: true,
      data: endpointData
    })

  } catch (error) {
    console.error('Error al obtener datos de endpoints:', error)
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
      computersNoIssues,
      computersWarning,
      computersCritical,
      mobileDevicesProtected,
      mobileDevicesPending,
      globalProtectionPercent
    } = body

    if (!year || !month) {
      return NextResponse.json(
        { success: false, error: 'Año y mes son requeridos' },
        { status: 400 }
      )
    }

    const endpointProtection = await prisma.endpointProtection.upsert({
      where: {
        year_month: { year, month }
      },
      update: {
        computersNoIssues: computersNoIssues || 0,
        computersWarning: computersWarning || 0,
        computersCritical: computersCritical || 0,
        mobileDevicesProtected: mobileDevicesProtected || 0,
        mobileDevicesPending: mobileDevicesPending || 0,
        globalProtectionPercent: globalProtectionPercent || 0,
      },
      create: {
        year,
        month,
        computersNoIssues: computersNoIssues || 0,
        computersWarning: computersWarning || 0,
        computersCritical: computersCritical || 0,
        mobileDevicesProtected: mobileDevicesProtected || 0,
        mobileDevicesPending: mobileDevicesPending || 0,
        globalProtectionPercent: globalProtectionPercent || 0,
      }
    })

    return NextResponse.json({
      success: true,
      data: endpointProtection,
      message: 'Datos de protección de endpoints guardados exitosamente'
    })

  } catch (error) {
    console.error('Error al guardar datos de endpoints:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

