/**
 * Keeps only a model's writable scalar columns from a request body, so a
 * PUT cannot set id/timestamps or smuggle in nested relation writes.
 *
 * Usage:
 *   const data = pickFields(body, Prisma.BlogPostScalarFieldEnum)
 */
const READ_ONLY = new Set(['id', 'createdAt', 'updatedAt'])

export function pickFields(
  body: Record<string, unknown>,
  fields: Record<string, string>
): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(body).filter(([key]) => key in fields && !READ_ONLY.has(key))
  )
}
