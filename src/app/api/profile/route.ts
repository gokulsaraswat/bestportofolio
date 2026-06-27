import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

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
  try {
    const body = await request.json()

    const existing = await db.profile.findFirst()

    if (!existing) {
      const profile = await db.profile.create({ data: body })
      return NextResponse.json(profile, { status: 201 })
    }

    const profile = await db.profile.update({
      where: { id: existing.id },
      data: body,
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