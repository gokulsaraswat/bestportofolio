import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest, NextResponse } from 'next/server'

// POST /api/ingest — Ingest a text chunk into Supabase
export async function POST(request: NextRequest) {
  try {
    const { text, type, sourceId, sourceTitle, metadata } = await request.json()

    if (!text || !type) {
      return NextResponse.json({ error: 'text and type are required' }, { status: 400 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    const geminiKey = process.env.GEMINI_API_KEY

    if (!supabaseUrl || !supabaseKey || !geminiKey) {
      return NextResponse.json({ error: 'RAG not configured. Set SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, and GEMINI_API_KEY in .env.local' }, { status: 503 })
    }

    // 1. Generate embedding using Google Generative AI SDK
    const genAI = new GoogleGenerativeAI(geminiKey)
    const model = genAI.getGenerativeModel({ model: "text-embedding-004" })
    const result = await model.embedContent(text)
    const embedding = result.embedding.values // This returns the 768-dim array

    // 2. Insert into Supabase
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

    const data = await insertRes.json()
    return NextResponse.json({ success: true, id: data[0]?.id }, { status: 201 })
  } catch (error) {
    console.error('Ingest error:', error)
    return NextResponse.json({ error: 'Ingestion failed' }, { status: 500 })
  }
}

// DELETE /api/ingest — Remove documents by source
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