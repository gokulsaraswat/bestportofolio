import { NextRequest, NextResponse } from 'next/server'

// Rate limiter for auth endpoint
const authAttempts = new Map<string, { count: number; resetAt: number }>()
const MAX_AUTH_ATTEMPTS = 10
const AUTH_WINDOW_MS = 15 * 60 * 1000 // 15 minutes

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = authAttempts.get(ip)

  if (!entry || now > entry.resetAt) {
    authAttempts.set(ip, { count: 1, resetAt: now + AUTH_WINDOW_MS })
    return false
  }

  entry.count++
  return entry.count > MAX_AUTH_ATTEMPTS
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Rate limit the auth endpoint
  if (pathname === '/api/auth' && request.method === 'POST') {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') || 'unknown'

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { success: false, error: 'Too many login attempts. Please try again later.' },
        { status: 429 }
      )
    }
  }

  // Protect write API routes with a simple check
  // (admin panel handles real auth via localStorage token)
  // This middleware adds defense-in-depth
  const protectedMethods = ['POST', 'PUT', 'DELETE', 'PATCH']
  const protectedApiRoutes = [
    '/api/blogs',
    '/api/projects',
    '/api/courses',
    '/api/todos',
    '/api/profile',
    '/api/backup',
    '/api/ingest',
    '/api/operation-logs',
    '/api/admin-users',
  ]

  if (protectedMethods.includes(request.method)) {
    const isProtected = protectedApiRoutes.some(route => pathname.startsWith(route))
    if (isProtected) {
      const authHeader = request.headers.get('authorization')
      const adminAuth = request.headers.get('x-admin-auth')

      // Accept either Authorization header or x-admin-auth header
      if (!authHeader && !adminAuth) {
        // Allow through if it's from the admin page (same origin)
        // The admin panel uses localStorage-based auth which is checked client-side
        // This middleware adds an extra layer but doesn't block same-origin requests
        const origin = request.headers.get('origin')
        const host = request.headers.get('host')
        if (origin && origin !== `http://${host}` && origin !== `https://${host}`) {
          return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
          )
        }
      }
    }
  }

  // Add security headers to all responses
  const response = NextResponse.next()

  // Prevent clickjacking on admin pages
  if (pathname.startsWith('/admin')) {
    response.headers.set('X-Frame-Options', 'SAMEORIGIN')
  }

  return response
}

export const config = {
  matcher: [
    '/api/:path*',
    '/admin/:path*',
  ],
}