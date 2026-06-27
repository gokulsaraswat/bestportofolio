import { NextRequest } from 'next/server'

// POST /api/chat — RAG Chat endpoint with streaming
// Body: { messages: Array<{role: 'user'|'assistant', content: string}> }
// Streams back the assistant's response

const SYSTEM_PROMPT = `You are Gokul Saraswat's portfolio AI assistant. You help visitors learn about Gokul's skills, projects, blog posts, courses, and professional background.

RULES:
- Only answer based on the provided context below.
- If the context doesn't contain relevant information, say "I don't have that information right now. You can reach out to Gokul directly through the contact form."
- Be concise but helpful. Use bullet points for lists.
- If someone asks about hiring, working together, or contact info, mention the contact page.
- Speak in first person as Gokul's assistant, but clarify you're an AI.
- Don't make up information that isn't in the context.
- Keep responses under 200 words unless the question requires detail.`

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json()

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: 'messages array is required' }), { status: 400, headers: { 'Content-Type': 'application/json' } })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    const openaiKey = process.env.OPENAI_API_KEY

    if (!supabaseUrl || !supabaseKey || !openaiKey) {
      // Return a helpful error message as a stream
      const fallback = "I'm not configured yet. The admin needs to set up Supabase and OpenAI API keys. Please use the contact form to reach Gokul directly."
      return new Response(fallback, {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      })
    }

    const userMessage = messages[messages.length - 1].content

    // Step 1: Generate embedding for the user's query
    const embedRes = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${openaiKey}` },
      body: JSON.stringify({ input: userMessage, model: 'text-embedding-3-small' }),
    })

    if (!embedRes.ok) {
      console.error('Embedding error in chat:', await embedRes.text())
      return new Response('Sorry, I encountered an error processing your question. Please try again.', {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      })
    }

    const embedData = await embedRes.json()
    const queryEmbedding = embedData.data[0].embedding

    // Step 2: Query Supabase for relevant documents using the match function
    const rpcRes = await fetch(`${supabaseUrl}/rest/v1/rpc/match_documents`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
      },
      body: JSON.stringify({
        query_embedding: queryEmbedding,
        match_threshold: 0.7,
        match_count: 5,
      }),
    })

    let context = ''
    if (rpcRes.ok) {
      const docs = await rpcRes.json()
      if (Array.isArray(docs) && docs.length > 0) {
        context = docs
          .map((d: { content: string; type: string; source_title: string; similarity: number }) => {
            const source = d.source_title || d.type
            return `[${source}] ${d.content}`
          })
          .join('\n\n---\n\n')
      }
    }

    // Step 3: Call OpenAI chat with context
    const systemWithCtx = context
      ? `${SYSTEM_PROMPT}\n\nHere is relevant context from Gokul's portfolio:\n\n${context}`
      : SYSTEM_PROMPT

    const chatMessages = [
      { role: 'system', content: systemWithCtx },
      ...messages.slice(-10), // Keep last 10 messages for context window
    ]

    const chatRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${openaiKey}` },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: chatMessages,
        max_tokens: 500,
        temperature: 0.7,
        stream: true,
      }),
    })

    if (!chatRes.ok) {
      console.error('Chat error:', await chatRes.text())
      return new Response('Sorry, I encountered an error. Please try again.', {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      })
    }

    // Step 4: Stream the response back
    const encoder = new TextEncoder()
    const decoder = new TextDecoder()

    const transformStream = new TransformStream({
      async transform(chunk, controller) {
        const text = decoder.decode(chunk, { stream: true })
        const lines = text.split('\n').filter((l: string) => l.startsWith('data: '))

        for (const line of lines) {
          const data = line.slice(6)
          if (data === '[DONE]') {
            controller.terminate()
            return
          }
          try {
            const parsed = JSON.parse(data)
            const content = parsed.choices?.[0]?.delta?.content
            if (content) {
              controller.enqueue(encoder.encode(content))
            }
          } catch {
            // skip malformed chunks
          }
        }
      },
    })

    const stream = chatRes.body!.pipeThrough(transformStream)

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (error) {
    console.error('Chat route error:', error)
    return new Response('Sorry, something went wrong. Please try again.', {
      status: 500,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    })
  }
}