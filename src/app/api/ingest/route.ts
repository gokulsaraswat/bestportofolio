import { NextRequest, NextResponse } from 'next/server'

// POST /api/ingest — Ingest a text chunk into Supabase with embedding
// Body: { text: string, type: 'resume'|'blog'|'project'|'course'|'profile'|'general', sourceId?: string, sourceTitle?: string, metadata?: object }
// This route is called from the admin panel when content is created/updated.

export async function POST(request: NextRequest) {
  try {
    const { text, type, sourceId, sourceTitle, metadata } = await request.json()

    if (!text || !type) {
      return NextResponse.json({ error: 'text and type are required' }, { status: 400 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    const openaiKey = process.env.OPENAI_API_KEY

    if (!supabaseUrl || !supabaseKey || !openaiKey) {
      return NextResponse.json({ error: 'RAG not configured. Set SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, and OPENAI_API_KEY in .env.local' }, { status: 503 })
    }

    // Step 1: Generate embedding via OpenAI
    const embedRes = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${openaiKey}` },
      body: JSON.stringify({ input: text, model: 'text-embedding-3-small' }),
    })

    if (!embedRes.ok) {
      const err = await embedRes.json().catch(() => ({}))
      console.error('Embedding error:', err)
      return NextResponse.json({ error: 'Failed to generate embedding', details: err }, { status: 500 })
    }

    const embedData = await embedRes.json()
    const embedding = embedData.data[0].embedding

    // Step 2: Insert into Supabase
    const insertRes = await fetch(`${supabaseUrl}/rest/v1/documents`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Prefer': 'return=representation',
      },
      body: JSON.stringify({
        content: text,
        type,
        source_id: sourceId || '',
        source_title: sourceTitle || '',
        metadata: metadata || {},
        embedding,
      }),
    })

    if (!insertRes.ok) {
      const err = await insertRes.json().catch(() => ({}))
      console.error('Supabase insert error:', err)
      return NextResponse.json({ error: 'Failed to store document', details: err }, { status: 500 })
    }

    const result = await insertRes.json()
    return NextResponse.json({ success: true, id: result[0]?.id, type }, { status: 201 })
  } catch (error) {
    console.error('Ingest error:', error)
    return NextResponse.json({ error: 'Ingestion failed' }, { status: 500 })
  }
}

// DELETE /api/ingest — Remove documents by source
// Body: { sourceId: string }
export async function DELETE(request: NextRequest) {
  try {
    const { sourceId, type } = await request.json()

    if (!sourceId) {
      return NextResponse.json({ error: 'sourceId is required' }, { status: 400 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: 'RAG not configured' }, { status: 503 })
    }

    const url = new URL(`${supabaseUrl}/rest/v1/documents`)
    const params = new URLSearchParams()
    params.set('source_id', 'eq.' + sourceId)
    if (type) params.set('type', 'eq.' + type)
    url.search = params.toString()

    const res = await fetch(url.toString(), {
      method: 'DELETE',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
      },
    })

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to delete documents' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Ingest delete error:', error)
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
  }
}