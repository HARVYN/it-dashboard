import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'No autorizado' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { name, description, category, isActive } = body

    const control = await prisma.securityControl.update({
      where: { id: params.id },
      data: {
        name,
        description: description || null,
        category,
        isActive
      }
    })

    return NextResponse.json({
      success: true,
      data: control,
      message: 'Control de seguridad actualizado exitosamente'
    })

  } catch (error) {
    console.error('Error al actualizar control de seguridad:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'No autorizado' },
        { status: 401 }
      )
    }

    await prisma.securityControl.delete({
      where: { id: params.id }
    })

    return NextResponse.json({
      success: true,
      message: 'Control de seguridad eliminado exitosamente'
    })

  } catch (error) {
    console.error('Error al eliminar control de seguridad:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

