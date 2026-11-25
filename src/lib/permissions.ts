/**
 * Role -> admin section map. Single source of truth for BOTH sides:
 *   - client: `components/admin/admin-layout.tsx` filters the admin nav with it;
 *   - server: `requirePermission(request, section)` in `lib/require-admin.ts`
 *     enforces it on every content/inbox/todo write and sensitive read.
 *
 * Plain data, no `next/server` import, so client components can import it.
 *
 * Rules:
 *   - A role may use a section only if the section is in its list.
 *   - Unknown roles get nothing (no nav section, every gated call refused).
 *   - `viewer` only has `dashboard`, which is read-only: no API write accepts it.
 *   - Content reads that are public anyway (blogs, projects, courses, snippets,
 *     including drafts for any signed-in session) are not gated per section.
 */

export const ADMIN_SECTIONS = [
  'dashboard',
  'blogs',
  'blog-ideas',
  'projects',
  'courses',
  'snippets',
  'logs',
  'messages',
  'comments',
  'todos',
  'rag-bot',
  'backup',
  'settings',
  'users',
] as const

export type AdminSection = (typeof ADMIN_SECTIONS)[number]

export type AdminRole = 'admin' | 'blog_editor' | 'project_editor' | 'course_editor' | 'viewer'

export const ROLE_PERMISSIONS: Record<AdminRole, readonly AdminSection[]> = {
  admin: ADMIN_SECTIONS,
  blog_editor: ['dashboard', 'blogs', 'blog-ideas', 'todos'],
  project_editor: ['dashboard', 'projects', 'todos'],
  course_editor: ['dashboard', 'courses', 'todos'],
  viewer: ['dashboard'],
}

/** True when `role` may use `section`. Unknown or missing roles return false. */
export function hasPermission(role: string | null | undefined, section: AdminSection): boolean {
  if (!role || !Object.prototype.hasOwnProperty.call(ROLE_PERMISSIONS, role)) return false
  return ROLE_PERMISSIONS[role as AdminRole].includes(section)
}
