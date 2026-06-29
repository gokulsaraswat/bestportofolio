import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

if (!process.env.USERNAME || !process.env.PASSWORD) {
  throw new Error('USERNAME or PASSWORD environment variables are not set')
}

export async function POST(request: NextRequest) {
  try {
    // Ensure at least one admin user exists
    const adminCount = await db.adminUser.count()
    if (adminCount === 0) {
      await db.adminUser.create({
        data: { username: process.env.USERNAME!, password: process.env.PASSWORD!, totpSecret: '', totpEnabled: false },
      })
    }

    const body = await request.json()
    const { username, password } = body

    if (!username || !password) {
      return NextResponse.json({ success: false, error: 'Username and password are required' }, { status: 400 })
    }

    const user = await db.adminUser.findUnique({ where: { username } })

    if (!user || user.password !== password) {
      return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 })
    }

    return NextResponse.json({ success: true, username: user.username, role: user.role || 'admin' })
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}