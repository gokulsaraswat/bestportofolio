import { db } from '@/lib/db'

export async function logOperation(data: {
  action: string
  entityType?: string
  entityId?: string
  details?: string
  actor?: string
}) {
  try {
    await db.operationLog.create({
      data: {
        action: data.action,
        entityType: data.entityType || '',
        entityId: data.entityId || '',
        details: data.details || '',
        actor: data.actor || 'admin',
      },
    })
    // Keep only last 1000 logs
    const count = await db.operationLog.count()
    if (count > 1000) {
      const logs = await db.operationLog.findMany({
        orderBy: { createdAt: 'asc' },
        take: count - 1000,
        select: { id: true },
      })
      if (logs.length > 0) {
        await db.operationLog.deleteMany({
          where: { id: { in: logs.map(l => l.id) } },
        })
      }
    }
  } catch (error) {
    console.error('Failed to log operation:', error)
  }
}