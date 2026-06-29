import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const users = await db.adminUser.findMany({
      select: { id: true, username: true, role: true, permissions: true, totpEnabled: true, createdAt: true, updatedAt: true },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(users)
  } catch (error) {
    console.error('Get users error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    if (!body.username || !body.password) {
      return NextResponse.json({ error: 'Username and password required' }, { status: 400 })
    }
    const existing = await db.adminUser.findUnique({ where: { username: body.username } })
    if (existing) {
      return NextResponse.json({ error: 'Username already exists' }, { status: 409 })
    }
    const user = await db.adminUser.create({
      data: {
        username: body.username,
        password: body.password,
        role: body.role || 'viewer',
        permissions: body.permissions ? JSON.stringify(body.permissions) : '{}',
      },
    })
    return NextResponse.json({ id: user.id, username: user.username, role: user.role, permissions: user.permissions }, { status: 201 })
  } catch (error) {
    console.error('Create user error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const existing = await db.adminUser.findUnique({ where: { id: body.id } })
    if (!existing) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Build update data
    const updateData: Record<string, unknown> = {}

    if (body.role !== undefined) {
      updateData.role = body.role
    }

    if (body.permissions !== undefined) {
      updateData.permissions = JSON.stringify(body.permissions)
    }

    if (body.password !== undefined && body.password.trim()) {
      updateData.password = body.password
    }

    const user = await db.adminUser.update({
      where: { id: body.id },
      data: updateData,
      select: { id: true, username: true, role: true, permissions: true, totpEnabled: true, createdAt: true, updatedAt: true },
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error('Update user error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })
    const adminCount = await db.adminUser.count({ where: { role: 'admin' } })
    const user = await db.adminUser.findUnique({ where: { id } })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })
    if (user.role === 'admin' && adminCount <= 1) {
      return NextResponse.json({ error: 'Cannot delete the last admin user' }, { status: 400 })
    }
    await db.adminUser.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete user error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}