import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { pickFields } from '@/lib/pick-fields'
import { Prisma } from '@prisma/client'
import { requireRole } from '@/lib/require-admin'

export async function GET() {
  try {
    const profile = await db.profile.findFirst()

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(profile)
  } catch (error) {
    console.error('Get profile error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  const denied = await requireRole(request, 'admin')
  if (denied) return denied

  try {
    const data = pickFields(await request.json(), Prisma.ProfileScalarFieldEnum)

    const existing = await db.profile.findFirst()

    if (!existing) {
      const profile = await db.profile.create({ data })
      return NextResponse.json(profile, { status: 201 })
    }

    const profile = await db.profile.update({
      where: { id: existing.id },
      data,
    })

    return NextResponse.json(profile)
  } catch (error) {
    console.error('Update profile error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}