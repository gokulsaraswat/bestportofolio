'use client'

import { useState, useEffect } from 'react'
import { Bot, Upload, Trash2, CheckCircle2, XCircle, Loader2, Database, Key, RefreshCw, FileText, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/hooks/use-toast'

interface ProfileData {
  chatBotEnabled: boolean
}

interface IngestDoc {
  text: string
  type: string
  sourceId: string
  sourceTitle: string
}

const typeOptions = [
  { value: 'resume', label: 'Resume', color: 'bg-blue-500/10 text-blue-500' },
  { value: 'blog', label: 'Blog Post', color: 'bg-green-500/10 text-green-500' },
  { value: 'project', label: 'Project', color: 'bg-purple-500/10 text-purple-500' },
  { value: 'course', label: 'Course', color: 'bg-amber-500/10 text-amber-500' },
  { value: 'profile', label: 'Profile', color: 'bg-pink-500/10 text-pink-500' },
  { value: 'general', label: 'General', color: 'bg-zinc-500/10 text-zinc-500' },
]

export function RagSettings() {
  const { toast } = useToast()

  // Config
  const [chatBotEnabled, setChatBotEnabled] = useState(false)
  const [loading, setLoading] = useState(true)

  // Ingestion
  const [ingestText, setIngestText] = useState('')
  const [ingestType, setIngestType] = useState('general')
  const [ingestSourceId, setIngestSourceId] = useState('')
  const [ingestSourceTitle, setIngestSourceTitle] = useState('')
  const [ingesting, setIngesting] = useState(false)

  // Status check
  const [configStatus, setConfigStatus] = useState<'checking' | 'ok' | 'missing'>('checking')

  // Batch ingest from existing content
  const [batchType, setBatchType] = useState<'all' | 'blogs' | 'projects' | 'profile'>('all')
  const [batchMode, setBatchMode] = useState<'replace' | 'add'>('add')
  const [batching, setBatching] = useState(false)
  const [batchProgress, setBatchProgress] = useState('')

  const checkConfig = async () => {
  setConfigStatus('checking')
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: [{ role: 'user', content: 'test' }] }),
    })
    setConfigStatus('ok')
  } catch {
    setConfigStatus('missing')
  }
}



useEffect(() => {
    let cancelled = false
    void (async () => {
      try {
        const res = await fetch('/api/profile')
        if (!cancelled && res.ok) {
          const data = await res.json()
          setChatBotEnabled(data.chatBotEnabled === true)
        }
      } catch { /* ignore */ }
      finally {
        if (!cancelled) setLoading(false)
      }
    })()
    void (async () => {
      setConfigStatus('checking')
      try {
        await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: [{ role: 'user', content: 'test' }] }),
        })
        if (!cancelled) setConfigStatus('ok')
      } catch {
        if (!cancelled) setConfigStatus('missing')
      }
    })()
    return () => { cancelled = true }
  }, [])



  const handleToggleBot = async (checked: boolean) => {
    setChatBotEnabled(checked)
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatBotEnabled: checked }),
      })
      if (!res.ok) throw new Error()
      toast({ title: checked ? 'Chat bot enabled' : 'Chat bot disabled' })
    } catch {
      setChatBotEnabled(!checked)
      toast({ title: 'Failed to update', variant: 'destructive' })
    }
  }

  const handleIngest = async () => {
    if (!ingestText.trim()) {
      toast({ title: 'Text content is required', variant: 'destructive' })
      return
    }
    setIngesting(true)
    try {
      const res = await fetch('/api/ingest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: ingestText,
          type: ingestType,
          sourceId: ingestSourceId,
          sourceTitle: ingestSourceTitle,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed')
      toast({ title: 'Document ingested', description: `Type: ${ingestType}` })
      setIngestText('')
      setIngestSourceId('')
      setIngestSourceTitle('')
    } catch (err) {
      toast({
        title: 'Ingestion failed',
        description: err instanceof Error ? err.message : 'Check your API keys',
        variant: 'destructive',
      })
    } finally {
      setIngesting(false)
    }
  }

  const handleBatchIngest = async () => {
    setBatching(true)
    setBatchProgress('Starting...')

    try {
      const typesToIngest = batchType === 'all'
        ? ['profile', 'blogs', 'projects'] as const
        : [batchType] as ('profile' | 'blogs' | 'projects')[]

      for (const bt of typesToIngest) {
        setBatchProgress(`Fetching ${bt}...`)
        let endpoint = '/api/profile'
        let type = 'profile'
        if (bt === 'blogs') { endpoint = '/api/blogs'; type = 'blog' }
        else if (bt === 'projects') { endpoint = '/api/projects'; type = 'project' }

        const res = await fetch(endpoint)
        if (!res.ok) throw new Error(`Failed to fetch ${bt}`)
        const items = await res.json()

        // If replace mode, delete existing docs for this type first
        if (batchMode === 'replace') {
          setBatchProgress(`Removing old ${bt} documents...`)
          for (const item of items) {
            const srcId = bt === 'profile' ? 'profile' : item.slug
            await fetch('/api/ingest', {
              method: 'DELETE',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ sourceId: srcId, type }),
            }).catch(() => {})
          }
        }

        let success = 0
        let fail = 0

        for (let i = 0; i < items.length; i++) {
          const item = items[i]
          let text = ''
          let sourceId = ''
          let sourceTitle = ''

          if (bt === 'profile') {
            text = `Name: ${item.name}\nOccupation: ${item.occupation}\nCompany: ${item.company}\nLocation: ${item.location}\nBio: ${item.bio}\nSkills: ${item.skills}\nCertifications: ${item.certifications}`
            sourceId = 'profile'
            sourceTitle = 'Profile - ' + item.name
          } else if (bt === 'blogs') {
            text = `Title: ${item.title}\nExcerpt: ${item.excerpt}\nContent: ${item.content}\nTags: ${item.tags}\nType: ${item.type}\nWritten By: ${item.writtenBy || ''}\nAccepted By: ${item.acceptedBy || ''}`
            sourceId = item.slug
            sourceTitle = item.title
          } else if (bt === 'projects') {
            text = `Title: ${item.title}\nDescription: ${item.shortDesc}\nFull Description: ${item.description}\nRole: ${item.role}\nStack: ${item.stack}\nResults: ${item.results}\nComplexity: ${item.complexity || 1}`
            sourceId = item.slug
            sourceTitle = item.title
          }

          setBatchProgress(`[${bt}] Ingesting ${i + 1}/${items.length}: ${sourceTitle}`)

          try {
            const ingestRes = await fetch('/api/ingest', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ text, type, sourceId, sourceTitle }),
            })
            if (ingestRes.ok) success++
            else fail++
          } catch {
            fail++
          }
        }

        toast({
          title: `${bt} ingest complete`,
          description: `${success} succeeded, ${fail} failed out of ${items.length} items`,
        })
      }

      setBatchProgress('')
    } catch (err) {
      toast({ title: 'Batch ingest failed', description: err instanceof Error ? err.message : 'Error', variant: 'destructive' })
      setBatchProgress('')
    } finally {
      setBatching(false)
    }
  }

  if (loading) {
    return <div className="space-y-4">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)}</div>
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Visibility Toggle */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Bot className="h-4 w-4" />
            Chat Bot Visibility
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Show chat widget on website</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                When enabled, visitors see a floating chat button in the bottom-right corner
              </p>
            </div>
            <Switch checked={chatBotEnabled} onCheckedChange={handleToggleBot} />
          </div>
        </CardContent>
      </Card>

      {/* Configuration Status */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Key className="h-4 w-4" />
            Configuration Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2">
            {configStatus === 'checking' ? (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            ) : configStatus === 'ok' ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            ) : (
              <XCircle className="h-4 w-4 text-rose-500" />
            )}
            <span className="text-sm">
              {configStatus === 'checking' && 'Checking configuration...'}
              {configStatus === 'ok' && 'API routes are reachable'}
              {configStatus === 'missing' && 'API keys not configured — see .env.example'}
            </span>
          </div>

          <div className="rounded-lg bg-muted/50 p-3 space-y-2 text-xs">
            <p className="font-medium text-muted-foreground">Required .env.local variables:</p>
            <code className="block text-[11px] bg-background rounded px-2 py-1">NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co</code>
            <code className="block text-[11px] bg-background rounded px-2 py-1">SUPABASE_SERVICE_ROLE_KEY=eyJ...</code>
            <code className="block text-[11px] bg-background rounded px-2 py-1">GEMINI_API_KEY=sk-...</code>
          </div>

          <Button variant="outline" size="sm" onClick={checkConfig} className="gap-1.5">
            <RefreshCw className="h-3.5 w-3.5" />
            Re-check
          </Button>
        </CardContent>
      </Card>

      {/* Manual Ingestion */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Ingest Document
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="sm:col-span-3">
              <Label>Type</Label>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {typeOptions.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setIngestType(opt.value)}
                    className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                      ingestType === opt.value
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'hover:border-primary/50 text-muted-foreground'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="ingest-source-id">Source ID</Label>
              <Input id="ingest-source-id" placeholder="e.g. blog-slug" value={ingestSourceId} onChange={e => setIngestSourceId(e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="ingest-source-title">Source Title</Label>
              <Input id="ingest-source-title" placeholder="e.g. My Blog Post Title" value={ingestSourceTitle} onChange={e => setIngestSourceTitle(e.target.value)} />
            </div>
          </div>
          <div>
            <Label htmlFor="ingest-text">Content</Label>
            <Textarea
              id="ingest-text"
              placeholder="Paste the text content to embed..."
              value={ingestText}
              onChange={e => setIngestText(e.target.value)}
              rows={6}
              className="font-mono text-xs"
            />
          </div>
          <Button onClick={handleIngest} disabled={ingesting || !ingestText.trim()} className="gap-1.5">
            {ingesting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            {ingesting ? 'Ingesting...' : 'Ingest Document'}
          </Button>
        </CardContent>
      </Card>

      {/* Batch Ingest from Existing Content */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Database className="h-4 w-4" />
            Batch Ingest from Website
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Automatically ingest all your existing website content (blogs, projects, profile) into the RAG system.
            This will embed them so the chatbot can answer questions about them.
          </p>
          <div className="flex flex-wrap gap-2">
            {(['all', 'profile', 'blogs', 'projects'] as const).map(t => (
              <button
                key={t}
                onClick={() => setBatchType(t)}
                className={`rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors ${
                  batchType === t
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'hover:border-primary/50 text-muted-foreground'
                }`}
              >
                {t === 'all' && 'Ingest Everything'}
                {t === 'profile' && 'Profile & Resume'}
                {t === 'blogs' && 'All Blog Posts'}
                {t === 'projects' && 'All Projects'}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Mode:</span>
              <button
                onClick={() => setBatchMode('add')}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                  batchMode === 'add'
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'hover:border-primary/50 text-muted-foreground'
                }`}
              >
                Add to Existing
              </button>
              <button
                onClick={() => setBatchMode('replace')}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                  batchMode === 'replace'
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'hover:border-primary/50 text-muted-foreground'
                }`}
              >
                Replace All
              </button>
            </div>
          </div>
          {batchProgress && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              {batchProgress}
            </div>
          )}
          <Button onClick={handleBatchIngest} disabled={batching} variant="outline" className="gap-1.5">
            {batching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {batching ? 'Ingesting...' : batchType === 'all' ? 'Ingest Everything' : `Ingest All ${batchType}`}
          </Button>
        </CardContent>
      </Card>

      {/* Setup Guide */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Setup Guide
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
            <li>Create a <strong>Supabase</strong> project at supabase.com (Free Tier)</li>
            <li>Go to SQL Editor and run the contents of <code className="bg-muted px-1 rounded text-xs">supabase/migrations/001_rag_schema.sql</code></li>
            <li>Copy <code className="bg-muted px-1 rounded text-xs">.env.example</code> to <code className="bg-muted px-1 rounded text-xs">.env.local</code> and fill in your keys</li>
            <li>Get an <strong>OpenAI</strong> API key from platform.openai.com</li>
            <li>Use &quot;Batch Ingest&quot; above to index your content</li>
            <li>Toggle the chat bot on and test it on your website</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  )
}