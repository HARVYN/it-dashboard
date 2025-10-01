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

    const techIncidentData = await prisma.techIncident.findMany({
      where,
      orderBy: [
        { year: 'desc' },
        { month: 'desc' }
      ]
    })

    return NextResponse.json({
      success: true,
      data: techIncidentData
    })

  } catch (error) {
    console.error('Error al obtener datos de incidentes de tecnología:', error)
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
      unavailabilityHours,
      availableHoursLeft,
      slaCompliance,
      annualProjection,
      description
    } = body

    if (!year || !month) {
      return NextResponse.json(
        { success: false, error: 'Año y mes son requeridos' },
        { status: 400 }
      )
    }

    const techIncident = await prisma.techIncident.upsert({
      where: {
        year_month: { year, month }
      },
      update: {
        unavailabilityHours: unavailabilityHours || 0,
        availableHoursLeft: availableHoursLeft || 0,
        slaCompliance: slaCompliance || 0,
        annualProjection: annualProjection || 0,
        description: description || null,
      },
      create: {
        year,
        month,
        unavailabilityHours: unavailabilityHours || 0,
        availableHoursLeft: availableHoursLeft || 0,
        slaCompliance: slaCompliance || 0,
        annualProjection: annualProjection || 0,
        description: description || null,
      }
    })

    return NextResponse.json({
      success: true,
      data: techIncident,
      message: 'Datos de incidentes de tecnología guardados exitosamente'
    })

  } catch (error) {
    console.error('Error al guardar datos de incidentes de tecnología:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

