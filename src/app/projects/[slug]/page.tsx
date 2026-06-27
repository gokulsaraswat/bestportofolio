'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import { ThemedCodeBlock } from '@/components/site/themed-code-block'
import { CommentSection } from '@/components/site/comment-section'
import {
  ArrowLeft, ExternalLink, Github, Download, Calendar,
  User, FolderGit2, Code2, Database, FileText, Terminal,
  BarChart3, Shield, Eye, BookOpen,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Navbar, Footer } from '@/components/site/navbar'
import { format } from 'date-fns'
import { EmbedList } from "@/components/embed-renderer"
import { ContributorsDisplay } from "@/components/contributors-input"


interface Project {
  id: string; title: string; slug: string; description: string
  shortDesc: string; banner: string; website: string; downloadLink: string
  repository: string; stack: string; screenshots: string; role: string
  process: string; results: string; architectureDiagramUrl: string
  dbSchemaUrl: string; adrContent: string; cicdSnippet: string
  iacSnippet: string; observabilityUrl: string; testCoverageUrl: string
  performanceMetrics: string; securityImplementation: string
  swaggerUrl: string; terminalSessionUrl: string; behindTheScenes: string
  videoUrl: string
  featured: boolean; createdAt: string
  embeds: string; contributorsJson: string; showTeam: boolean
}

function CodeBlock({ title, code, language }: { title: string; code: string; language?: string }) {
  if (!code) return null
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Code2 className="h-4 w-4 text-primary" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ThemedCodeBlock language={language || 'yaml'}>{code}</ThemedCodeBlock>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function ImageBlock({ title, url }: { title: string; url: string }) {
  if (!url) return null
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Eye className="h-4 w-4 text-primary" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-2">
          <img src={url} alt={title} className="w-full rounded-lg" loading="lazy" />
        </CardContent>
      </Card>
    </motion.div>
  )
}

function MarkdownBlock({ title, content, icon: Icon }: { title: string; content: string; icon?: React.ElementType }) {
  if (!content) return null
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            {Icon && <Icon className="h-4 w-4 text-primary" />}
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm prose-neutral dark:prose-invert max-w-none">
          <ReactMarkdown>{content}</ReactMarkdown>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default function ProjectDetailPage() {
  const params = useParams()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    fetch(`/api/projects`)
      .then(r => r.json())
      .then(data => {
        const found = data.find((p: Project) => p.slug === params.slug)
        if (found) setProject(found)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [params.slug])

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 py-20 px-4">
          <div className="mx-auto max-w-4xl space-y-4">
            <div className="h-8 w-2/3 rounded bg-muted animate-pulse" />
            <div className="h-64 w-full rounded-xl bg-muted animate-pulse mt-6" />
          </div>
        </main>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 py-20 px-4 text-center">
          <p className="text-muted-foreground mb-4">Project not found</p>
          <Button asChild variant="outline"><Link href="/projects" className="gap-2"><ArrowLeft className="h-4 w-4" />Back to Projects</Link></Button>
        </main>
        <Footer />
      </div>
    )
  }

  const stack: string[] = project.stack ? JSON.parse(project.stack) : []
  const screenshots: string[] = project.screenshots ? JSON.parse(project.screenshots) : []

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'technical', label: 'Technical Deep-Dive' },
    { id: 'process', label: 'Process & Results' },
  ]

  const hasTechnical = project.architectureDiagramUrl || project.dbSchemaUrl || project.adrContent ||
    project.cicdSnippet || project.iacSnippet || project.observabilityUrl || project.testCoverageUrl ||
    project.performanceMetrics || project.securityImplementation || project.swaggerUrl || project.terminalSessionUrl

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-20 px-4">
        <motion.div
          className="mx-auto max-w-4xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Back */}
          <Button variant="ghost" size="sm" className="mb-6 -ml-2 gap-1.5 text-muted-foreground hover:text-foreground" asChild>
            <Link href="/projects"><ArrowLeft className="h-4 w-4" />Back to Projects</Link>
          </Button>

          {/* Hero */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">{project.title}</h1>
            {project.shortDesc && <p className="mt-2 text-lg text-muted-foreground">{project.shortDesc}</p>}
            {project.role && (
              <p className="mt-1 text-sm text-primary font-medium">Role: {project.role}</p>
            )}
            <div className="flex flex-wrap gap-2 mt-4">
              {stack.map(s => (
                <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              {project.website && (
                <Button size="sm" asChild><a href={project.website} target="_blank" rel="noreferrer" className="gap-1.5"><ExternalLink className="h-3.5 w-3.5" />Visit</a></Button>
              )}
              {project.downloadLink && (
                <Button size="sm" variant="outline" asChild><a href={project.downloadLink} target="_blank" rel="noreferrer" className="gap-1.5"><Download className="h-3.5 w-3.5" />Download</a></Button>
              )}
              {project.repository && (
                <Button size="sm" variant="outline" asChild><a href={project.repository} target="_blank" rel="noreferrer" className="gap-1.5"><Github className="h-3.5 w-3.5" />Source</a></Button>
              )}
            </div>
          </motion.div>

          {/* Banner / Screenshots */}
          {(project.banner || screenshots.length > 0) && (
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 }} className="mb-8">
              <div className="grid gap-3 sm:grid-cols-2">
                {project.banner && (
                  <div className="aspect-video rounded-xl overflow-hidden bg-muted sm:col-span-2">
                    <img src={project.banner} alt={project.title} className="h-full w-full object-cover" />
                  </div>
                )}
                {screenshots.map((s, i) => (
                  <div key={i} className="aspect-video rounded-xl overflow-hidden bg-muted">
                    <img src={s} alt={`${project.title} screenshot ${i + 1}`} className="h-full w-full object-cover" loading="lazy" />
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Video */}
          {project.videoUrl && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }} 
              animate={{ opacity: 1, scale: 1 }} 
              transition={{ delay: 0.2 }} 
              className="mb-8"
            >
              <div className="aspect-video rounded-xl overflow-hidden bg-black">
                <video
                  src={project.videoUrl}
                  controls
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="h-full w-full object-contain"
                />
              </div>
            </motion.div>
          )}

          {/* Tabs */}
          <div className="flex gap-1 border-b mb-8">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary text-foreground'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="space-y-6 pb-8">
            {activeTab === 'overview' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="prose prose-neutral dark:prose-invert max-w-none">
                  <ReactMarkdown>{project.description}</ReactMarkdown>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  {format(new Date(project.createdAt), 'MMMM yyyy')}                
                </div>

                {/* Embeds */}
                {project.embeds && <EmbedList urls={project.embeds} />}
                  
                  {/* Team / Contributors */}

                  {project.showTeam && project.contributorsJson && (
                    <ContributorsDisplay
                      contributorsJson={project.contributorsJson}
                      showTeam={project.showTeam}
                    />
                  )}
              </motion.div>
            )}

            {activeTab === 'technical' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                {!hasTechnical ? (
                  <div className="rounded-xl border-2 border-dashed p-10 text-center">
                    <Code2 className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">No technical details added yet. The admin can add architecture diagrams, CI/CD configs, DB schemas, and more.</p>
                  </div>
                ) : (
                  <>
                    <ImageBlock title="Architecture Diagram" url={project.architectureDiagramUrl} />
                    <ImageBlock title="Database Schema" url={project.dbSchemaUrl} />
                    <MarkdownBlock title="Architecture Decision Records" content={project.adrContent} icon={BookOpen} />
                    <CodeBlock title="CI/CD Pipeline" code={project.cicdSnippet} language="yaml" />
                    <CodeBlock title="Infrastructure as Code" code={project.iacSnippet} language="hcl" />
                    <ImageBlock title="Observability / Monitoring" url={project.observabilityUrl} />
                    <ImageBlock title="Test Coverage" url={project.testCoverageUrl} />
                    <MarkdownBlock title="Performance Metrics" content={project.performanceMetrics} icon={BarChart3} />
                    <MarkdownBlock title="Security Implementation" content={project.securityImplementation} icon={Shield} />
                    {project.swaggerUrl && (
                      <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm flex items-center gap-2">
                              <FileText className="h-4 w-4 text-primary" />
                              API Documentation (Swagger)
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <iframe src={project.swaggerUrl} className="w-full rounded-lg border" style={{ minHeight: 400 }} />
                          </CardContent>
                        </Card>
                      </motion.div>
                    )}
                    {project.terminalSessionUrl && (
                      <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm flex items-center gap-2">
                              <Terminal className="h-4 w-4 text-primary" />
                              Terminal Session
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <iframe src={project.terminalSessionUrl} className="w-full rounded-lg border bg-black" style={{ minHeight: 300 }} />
                          </CardContent>
                        </Card>
                      </motion.div>
                    )}
                  </>
                )}
              </motion.div>
            )}

            {activeTab === 'process' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <MarkdownBlock title="My Process" content={project.process} icon={FolderGit2} />
                <MarkdownBlock title="Results & Impact" content={project.results} icon={BarChart3} />
                <MarkdownBlock title="Behind the Scenes" content={project.behindTheScenes} icon={Eye} />
              </motion.div>
            )}
          </div>
          {/* Comments */}
          <CommentSection entityType="project" entityId={project.slug} />
        </motion.div>
      </main>
      <Footer />
    </div>
  )
}