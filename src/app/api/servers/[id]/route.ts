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
    const { name, description, isActive } = body

    const server = await prisma.server.update({
      where: { id: params.id },
      data: {
        name,
        description: description || null,
        isActive
      }
    })

    return NextResponse.json({
      success: true,
      data: server,
      message: 'Servidor actualizado exitosamente'
    })

  } catch (error) {
    console.error('Error al actualizar servidor:', error)
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

    await prisma.server.delete({
      where: { id: params.id }
    })

    return NextResponse.json({
      success: true,
      message: 'Servidor eliminado exitosamente'
    })

  } catch (error) {
    console.error('Error al eliminar servidor:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

