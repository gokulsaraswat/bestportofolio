import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const entityType = searchParams.get('entityType')
    const status = searchParams.get('status')
    const includeArchived = searchParams.get('includeArchived') === 'true'

    const where: Record<string, unknown> = {}
    if (entityType) where.entityType = entityType
    if (status) where.status = status
    if (!includeArchived) where.archived = false

    const todos = await db.todo.findMany({
      where: Object.keys(where).length > 0 ? where : { archived: false },
      orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
    })
    return NextResponse.json(todos)
  } catch (error) {
    console.error('Todos fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch todos' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    if (!body.title) return NextResponse.json({ error: 'Title is required' }, { status: 400 })

    const todo = await db.todo.create({
      data: {
        title: body.title,
        description: body.description ?? '',
        status: body.status ?? 'draft',
        priority: body.priority ?? 'medium',
        entityType: body.entityType ?? '',
        entityId: body.entityId ?? '',
        assignee: body.assignee ?? '',
        remarks: body.remarks ?? '',
        dueDate: body.dueDate ?? '',
      },
    })

    // Log creation
    await db.todoHistory.create({
      data: {
        todoId: todo.id,
        action: 'created',
        field: '',
        oldValue: '',
        newValue: todo.title,
        actor: body.actor ?? 'admin',
      },
    })

    return NextResponse.json(todo, { status: 201 })
  } catch (error) {
    console.error('Todo create error:', error)
    return NextResponse.json({ error: 'Failed to create todo' }, { status: 500 })
  }
}