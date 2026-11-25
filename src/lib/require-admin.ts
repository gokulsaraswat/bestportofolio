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
import { hasPermission, type AdminSection } from '@/lib/permissions'

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

/**
 * Section-level guard: a usable session (requireAdmin rules) whose role may
 * use `section` per ROLE_PERMISSIONS in `@/lib/permissions` (the same map the
 * admin nav uses). Returns 401 without a session, 403 for mustChangePassword
 * or a role that lacks the section (unknown roles have no sections), else null.
 *
 * Use it on every write and every sensitive read (inbox, comment moderation,
 * todos, blog ideas). `viewer` only has `dashboard`, so it never passes a write.
 *
 * Usage:
 *   const denied = await requirePermission(request, 'blogs')
 *   if (denied) return denied
 *
 * Sign-in methods (password today, OAuth later) only need to put the AdminUser
 * `role` into the session payload; this check reads nothing else.
 */
export async function requirePermission(
  request: NextRequest,
  section: AdminSection
): Promise<NextResponse | null> {
  const denied = await requireAdmin(request)
  if (denied) return denied
  const session = await getAdminSession(request)
  if (!hasPermission(session?.role, section)) {
    return NextResponse.json(
      { error: `Forbidden. Your role cannot access ${section}.` },
      { status: 403 }
    )
  }
  return null
}

/** Same as requireAdmin, but also requires the exact role (used with 'admin' for admin-only routes). */
export async function requireRole(request: NextRequest, role: string): Promise<NextResponse | null> {
  const denied = await requireAdmin(request)
  if (denied) return denied
  const session = await getAdminSession(request)
  if (session?.role !== role) {
    return NextResponse.json({ error: `Forbidden. Requires ${role} role.` }, { status: 403 })
  }
  return null
}
