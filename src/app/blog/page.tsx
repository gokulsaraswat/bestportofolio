'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search, X, FileText, Play, Music, MessageCircle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Navbar, Footer } from '@/components/site/navbar'
import { BlogCard, LoadingCards } from '@/components/site/cards'

interface Blog { id: string; title: string; slug: string; excerpt: string; coverImage: string; tags: string; category: string; type: string; embedUrl: string; published: boolean; createdAt: string; writtenBy: string; acceptedBy: string }

const types = ['all', 'article', 'youtube', 'spotify', 'tweet']

export default function BlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  useEffect(() => {
    fetch('/api/blogs?published=true').then(r => r.json()).then(data => { setBlogs(data); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  const allCategories = useMemo(() => {
    const catSet = new Set<string>()
    blogs.forEach(b => {
      const c = (b.category || '').trim()
      if (c) catSet.add(c)
    })
    return [...catSet]
  }, [blogs])

  const allTags = useMemo(() => {
    const tagSet = new Set<string>()
    blogs.forEach(b => {
      if (b.tags) {
        b.tags.split(',').map(t => t.trim()).filter(Boolean).forEach(t => tagSet.add(t))
      }
    })
    return [...tagSet]
  }, [blogs])

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => {
      if (prev.includes(tag)) return prev.filter(t => t !== tag)
      if (prev.length >= 5) return prev
      return [...prev, tag]
    })
  }

  const filtered = blogs.filter(b => {
    const matchSearch = !search || b.title.toLowerCase().includes(search.toLowerCase()) || b.excerpt.toLowerCase().includes(search.toLowerCase())
    const matchType = typeFilter === 'all' || b.type === typeFilter
    const matchCategory = !categoryFilter || (b.category || '').trim() === categoryFilter
    const matchTags = selectedTags.length === 0 || (() => {
      const blogTags = (b.tags || '').split(',').map(t => t.trim().toLowerCase()).filter(Boolean)
      return selectedTags.some(st => blogTags.some(bt => bt.includes(st.toLowerCase()) || st.toLowerCase().includes(bt)))
    })()
    return matchSearch && matchType && matchCategory && matchTags
  })

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-20 px-4">
        <div className="mx-auto max-w-6xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="text-3xl font-bold sm:text-4xl">Blog</h1>
            <p className="mt-2 text-muted-foreground">Articles, videos, playlists, and thoughts</p>
          </motion.div>

          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search posts..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
              {search && <button className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" onClick={() => setSearch('')}><X className="h-3 w-3" /></button>}
            </div>
            <div className="flex gap-1.5">
              {types.map(t => (
                <button key={t} onClick={() => setTypeFilter(t)} className={`flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-medium capitalize transition-colors ${typeFilter === t ? 'border-primary bg-primary text-primary-foreground' : 'hover:border-primary/50'}`}>
                  {t !== 'all' && t === 'article' && <FileText className="h-3 w-3" />}
                  {t !== 'all' && t === 'youtube' && <Play className="h-3 w-3" />}
                  {t !== 'all' && t === 'spotify' && <Music className="h-3 w-3" />}
                  {t !== 'all' && t === 'tweet' && <MessageCircle className="h-3 w-3" />}
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Category filters */}
          {allCategories.length > 0 && (
            <div className='mb-6'>
              <div className='flex items-center gap-2 text-sm text-muted-foreground mb-2'>
                <span>Filter by category</span>
              </div>
              <div className='flex flex-wrap gap-1.5'>
                {allCategories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(prev => prev === cat ? '' : cat)}
                    className={`rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors ${
                      categoryFilter === cat
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'hover:border-primary/50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tag filters */}
          {allTags.length > 0 && (
            <div className="mb-6 space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Filter by tags</span>
                {selectedTags.length > 0 && <span className="text-xs">({selectedTags.length}/5)</span>}
              </div>
              {selectedTags.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5">
                  {selectedTags.map(tag => (
                    <Badge key={tag} variant="default" className="gap-1 pr-1 text-xs">
                      {tag}
                      <button onClick={() => handleTagToggle(tag)} className="ml-0.5 inline-flex h-3.5 w-3.5 items-center justify-center rounded-full hover:bg-primary-foreground/20">
                        <X className="h-2.5 w-2.5" />
                      </button>
                    </Badge>
                  ))}
                  <button onClick={() => setSelectedTags([])} className="text-xs text-primary hover:underline ml-1">Clear all</button>
                </div>
              )}
              <div className="flex flex-wrap gap-1.5">
                {allTags.map(tag => {
                  const isSelected = selectedTags.includes(tag)
                  return (
                    <button
                      key={tag}
                      onClick={() => handleTagToggle(tag)}
                      disabled={!isSelected && selectedTags.length >= 5}
                      className={`rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors ${
                        isSelected
                          ? 'border-primary bg-primary text-primary-foreground'
                          : selectedTags.length >= 5
                            ? 'opacity-40 cursor-not-allowed'
                            : 'hover:border-primary/50'
                      }`}
                    >
                      {tag}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {loading ? <LoadingCards count={6} /> : filtered.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((blog, i) => (
                <motion.div key={blog.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05, duration: 0.4 }}>
                  <BlogCard blog={blog} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border-2 border-dashed p-16 text-center">
              <p className="text-muted-foreground">{search || typeFilter !== 'all' || categoryFilter || selectedTags.length > 0 ? 'No posts match your filters.' : 'No blog posts yet.'}</p>
              {(search || typeFilter !== 'all' || categoryFilter || selectedTags.length > 0) && (
                <button onClick={() => { setSearch(''); setTypeFilter('all'); setCategoryFilter(''); setSelectedTags([]) }} className="mt-2 text-sm text-primary hover:underline">Clear all filters</button>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}