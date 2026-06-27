import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

function diffFields(oldRec: Record<string, unknown>, newBody: Record<string, unknown>): Array<{ field: string; oldValue: string; newValue: string }> {
  const changes: Array<{ field: string; oldValue: string; newValue: string }> = []
  const trackFields = ['title', 'description', 'status', 'priority', 'assignee', 'remarks', 'dueDate']
  for (const f of trackFields) {
    const ov = String(oldRec[f] ?? '')
    const nv = String(newBody[f] ?? '')
    if (ov !== nv) changes.push({ field: f, oldValue: ov, newValue: nv })
  }
  return changes
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()

    const existing = await db.todo.findUnique({ where: { id } })
    if (!existing) return NextResponse.json({ error: 'Todo not found' }, { status: 404 })

    // Determine data to update
    const updateData: Record<string, unknown> = { updatedAt: new Date() }

    if (body.title !== undefined) updateData.title = body.title
    if (body.description !== undefined) updateData.description = body.description
    if (body.status !== undefined) updateData.status = body.status
    if (body.priority !== undefined) updateData.priority = body.priority
    if (body.entityType !== undefined) updateData.entityType = body.entityType
    if (body.entityId !== undefined) updateData.entityId = body.entityId
    if (body.assignee !== undefined) updateData.assignee = body.assignee
    if (body.remarks !== undefined) updateData.remarks = body.remarks
    if (body.dueDate !== undefined) updateData.dueDate = body.dueDate

    // If moving to 'done', set completedAt and archive
    if (body.status === 'done' && existing.status !== 'done') {
      updateData.completedAt = new Date()
      updateData.archived = true
    }

    // If un-archiving explicitly
    if (body.archived === false) {
      updateData.archived = false
    }

    // Log changes
    const changes = diffFields(existing as unknown as Record<string, unknown>, body)
    const actor = body.actor ?? 'admin'

    if (changes.length > 0) {
      await db.todoHistory.createMany({
        data: changes.map(c => ({
          todoId: id,
          action: body.status === 'done' && existing.status !== 'done' ? 'completed' : 'updated',
          field: c.field,
          oldValue: c.oldValue,
          newValue: c.newValue,
          actor,
        })),
      })
    }

    const todo = await db.todo.update({ where: { id }, data: updateData })
    return NextResponse.json(todo)
  } catch (error) {
    console.error('Todo update error:', error)
    return NextResponse.json({ error: 'Failed to update todo' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await db.todo.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete todo' }, { status: 500 })
  }
}