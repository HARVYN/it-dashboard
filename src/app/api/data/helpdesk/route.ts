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
    const technicianId = searchParams.get('technicianId') || undefined

    const where = buildWhereClause({ year, month, quarter })
    if (technicianId) {
      where.technicianId = technicianId
    }

    const helpdeskData = await prisma.helpdeskCase.findMany({
      where,
      include: {
        technician: true
      },
      orderBy: [
        { year: 'desc' },
        { month: 'desc' },
        { technician: { name: 'asc' } }
      ]
    })

    return NextResponse.json({
      success: true,
      data: helpdeskData
    })

  } catch (error) {
    console.error('Error al obtener datos de mesa de ayuda:', error)
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
      technicianId,
      totalCases,
      casesGLPI,
      casesOtherSources,
      satisfactionAverage,
      timeLessThan4h,
      time4to8h,
      time8to16h,
      timeMoreThan16h
    } = body

    if (!year || !month || !technicianId) {
      return NextResponse.json(
        { success: false, error: 'Año, mes y técnico son requeridos' },
        { status: 400 }
      )
    }

    const helpdeskCase = await prisma.helpdeskCase.upsert({
      where: {
        year_month_technicianId: {
          year,
          month,
          technicianId
        }
      },
      update: {
        totalCases: totalCases || 0,
        casesGLPI: casesGLPI || 0,
        casesOtherSources: casesOtherSources || 0,
        satisfactionAverage: satisfactionAverage || 0,
        timeLessThan4h: timeLessThan4h || 0,
        time4to8h: time4to8h || 0,
        time8to16h: time8to16h || 0,
        timeMoreThan16h: timeMoreThan16h || 0,
      },
      create: {
        year,
        month,
        technicianId,
        totalCases: totalCases || 0,
        casesGLPI: casesGLPI || 0,
        casesOtherSources: casesOtherSources || 0,
        satisfactionAverage: satisfactionAverage || 0,
        timeLessThan4h: timeLessThan4h || 0,
        time4to8h: time4to8h || 0,
        time8to16h: time8to16h || 0,
        timeMoreThan16h: timeMoreThan16h || 0,
      },
      include: {
        technician: true
      }
    })

    return NextResponse.json({
      success: true,
      data: helpdeskCase,
      message: 'Datos de mesa de ayuda guardados exitosamente'
    })

  } catch (error) {
    console.error('Error al guardar datos de mesa de ayuda:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

