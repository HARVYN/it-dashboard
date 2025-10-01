import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'No autorizado' },
        { status: 401 }
      )
    }

    const controls = await prisma.securityControl.findMany({
      orderBy: { name: 'asc' }
    })

    return NextResponse.json({
      success: true,
      data: controls
    })

  } catch (error) {
    console.error('Error al obtener controles de seguridad:', error)
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
    const { name, description, category } = body

    if (!name || !category) {
      return NextResponse.json(
        { success: false, error: 'El nombre y categoría son requeridos' },
        { status: 400 }
      )
    }

    const control = await prisma.securityControl.create({
      data: {
        name,
        description: description || null,
        category
      }
    })

    return NextResponse.json({
      success: true,
      data: control,
      message: 'Control de seguridad creado exitosamente'
    })

  } catch (error) {
    console.error('Error al crear control de seguridad:', error)
    
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json(
        { success: false, error: 'Ya existe un control con ese nombre' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

