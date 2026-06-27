'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Navbar, Footer } from '@/components/site/navbar'
import { ProjectCard, LoadingCards } from '@/components/site/cards'

interface Project {
  id: string; title: string; slug: string; shortDesc: string; banner: string
  website: string; downloadLink: string; repository: string; stack: string
  featured: boolean; createdAt: string; role: string; results: string; complexity: number; videoUrl: string
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])

  useEffect(() => {
    fetch('/api/projects').then(r => r.json()).then(data => { setProjects(data); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  const allSkills = useMemo(() =>
    [...new Set(projects.flatMap(p => { try { return JSON.parse(p.stack) } catch { return [] } }))]
  , [projects])

  const handleSkillToggle = (skill: string) => {
    setSelectedSkills(prev => {
      if (prev.includes(skill)) return prev.filter(s => s !== skill)
      if (prev.length >= 5) return prev
      return [...prev, skill]
    })
  }

  const filtered = projects.filter(p => {
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.shortDesc.toLowerCase().includes(search.toLowerCase())
    const matchSkills = selectedSkills.length === 0 || (() => {
      try {
        const stack: string[] = JSON.parse(p.stack || '[]')
        return selectedSkills.every(sel => stack.some(s => s.toLowerCase().includes(sel.toLowerCase())))
      } catch { return false }
    })()
    return matchSearch && matchSkills
  })

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-20 px-4">
        <div className="mx-auto max-w-6xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="text-3xl font-bold sm:text-4xl">Projects</h1>
            <p className="mt-2 text-muted-foreground">A curated selection of my work — quality over quantity</p>
          </motion.div>

          {/* Search */}
          <div className="mb-4">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search projects..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
              {search && <button className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" onClick={() => setSearch('')}><X className="h-3 w-3" /></button>}
            </div>
          </div>

          {/* Skill Filters - multi select, max 5 */}
          <div className="mb-8 space-y-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Filter by skills</span>
              {selectedSkills.length > 0 && (
                <span className="text-xs">({selectedSkills.length}/5 selected)</span>
              )}
            </div>
            {/* Selected skills badges */}
            {selectedSkills.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5">
                {selectedSkills.map(skill => (
                  <Badge key={skill} variant="default" className="gap-1 pr-1 text-xs">
                    {skill}
                    <button onClick={() => handleSkillToggle(skill)} className="ml-0.5 inline-flex h-3.5 w-3.5 items-center justify-center rounded-full hover:bg-primary-foreground/20 transition-colors">
                      <X className="h-2.5 w-2.5" />
                    </button>
                  </Badge>
                ))}
                <button onClick={() => setSelectedSkills([])} className="text-xs text-primary hover:underline ml-1">Clear all</button>
                <span className="text-xs text-muted-foreground ml-auto">{filtered.length} project{filtered.length !== 1 ? 's' : ''} found</span>
              </div>
            )}
            {/* All skill chips */}
            <div className="flex flex-wrap gap-1.5">
              {allSkills.map(skill => {
                const isSelected = selectedSkills.includes(skill)
                return (
                  <button
                    key={skill}
                    onClick={() => handleSkillToggle(skill)}
                    disabled={!isSelected && selectedSkills.length >= 5}
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                      isSelected
                        ? 'border-primary bg-primary text-primary-foreground'
                        : selectedSkills.length >= 5
                          ? 'opacity-40 cursor-not-allowed'
                          : 'hover:border-primary/50'
                    }`}
                  >
                    {skill}
                  </button>
                )
              })}
            </div>
          </div>

          {loading ? <LoadingCards count={6} /> : filtered.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((project, i) => (
                <motion.div key={project.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05, duration: 0.4 }}>
                  <ProjectCard project={project} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border-2 border-dashed p-16 text-center">
              <p className="text-muted-foreground">{search || selectedSkills.length > 0 ? 'No projects match your filters.' : 'No projects yet. Add them from the admin panel!'}</p>
              {(search || selectedSkills.length > 0) && (
                <button onClick={() => { setSearch(''); setSelectedSkills([]) }} className="mt-2 text-sm text-primary hover:underline">Clear all filters</button>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}