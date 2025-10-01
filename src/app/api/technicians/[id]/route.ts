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
    const { name, email, isActive } = body

    const technician = await prisma.technician.update({
      where: { id: params.id },
      data: {
        name,
        email: email || null,
        isActive
      }
    })

    return NextResponse.json({
      success: true,
      data: technician,
      message: 'Técnico actualizado exitosamente'
    })

  } catch (error) {
    console.error('Error al actualizar técnico:', error)
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

    await prisma.technician.delete({
      where: { id: params.id }
    })

    return NextResponse.json({
      success: true,
      message: 'Técnico eliminado exitosamente'
    })

  } catch (error) {
    console.error('Error al eliminar técnico:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

