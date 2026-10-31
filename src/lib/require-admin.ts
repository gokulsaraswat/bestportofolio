/**
 * Server-side admin guard for route handlers.
 *
 * Before this existed, admin auth was a `loggedIn: true` flag in localStorage
 * and the middleware waved through any same-origin request — so every write
 * endpoint was reachable with a bare curl. Every mutating route must now call
 * requireAdmin() as its first statement.
 *
 * Usage:
 *   const denied = await requireAdmin(request)
 *   if (denied) return denied
 */
import { NextRequest, NextResponse } from 'next/server'
import { SESSION_COOKIE, verifySessionToken, type SessionPayload } from '@/lib/session'

export async function getAdminSession(request: NextRequest): Promise<SessionPayload | null> {
  return verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value)
}

/**
 * Returns a 401/403 response when the caller is not a usable admin session,
 * otherwise null.
 *
 * An account still flagged mustChangePassword is authenticated but not yet
 * trusted: it is signed in with a known-compromised credential and may only
 * call /api/auth/password. Blocking it here means the UI's change-password
 * screen cannot be skipped by calling the API directly.
 */
export async function requireAdmin(request: NextRequest): Promise<NextResponse | null> {
  const session = await getAdminSession(request)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized. Admin sign-in required.' }, { status: 401 })
  }
  if (session.mustChangePassword) {
    return NextResponse.json(
      { error: 'Password change required before performing this action.' },
      { status: 403 }
    )
  }
  return null
}

/** Same as requireAdmin, but also requires the "admin" role (not "editor"). */
export async function requireRole(request: NextRequest, role: string): Promise<NextResponse | null> {
  const denied = await requireAdmin(request)
  if (denied) return denied
  const session = await getAdminSession(request)
  if (session?.role !== role) {
    return NextResponse.json({ error: `Forbidden. Requires ${role} role.` }, { status: 403 })
  }
  return null
}
