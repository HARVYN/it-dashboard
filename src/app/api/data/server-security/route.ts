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
    const serverId = searchParams.get('serverId') || undefined

    const where = buildWhereClause({ year, month, quarter })
    if (serverId) {
      where.serverId = serverId
    }

    const serverSecurityData = await prisma.serverSecurity.findMany({
      where,
      include: {
        server: true,
        control: true
      },
      orderBy: [
        { year: 'desc' },
        { month: 'desc' },
        { server: { name: 'asc' } },
        { control: { name: 'asc' } }
      ]
    })

    return NextResponse.json({
      success: true,
      data: serverSecurityData
    })

  } catch (error) {
    console.error('Error al obtener datos de seguridad de servidores:', error)
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
      serverId,
      controlId,
      status,
      compliancePercent,
      notes
    } = body

    if (!year || !month || !serverId || !controlId) {
      return NextResponse.json(
        { success: false, error: 'Año, mes, servidor y control son requeridos' },
        { status: 400 }
      )
    }

    const serverSecurity = await prisma.serverSecurity.upsert({
      where: {
        year_month_serverId_controlId: {
          year,
          month,
          serverId,
          controlId
        }
      },
      update: {
        status: status || 'warning',
        compliancePercent: compliancePercent || 0,
        notes: notes || null,
      },
      create: {
        year,
        month,
        serverId,
        controlId,
        status: status || 'warning',
        compliancePercent: compliancePercent || 0,
        notes: notes || null,
      },
      include: {
        server: true,
        control: true
      }
    })

    return NextResponse.json({
      success: true,
      data: serverSecurity,
      message: 'Datos de seguridad de servidor guardados exitosamente'
    })

  } catch (error) {
    console.error('Error al guardar datos de seguridad de servidor:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

