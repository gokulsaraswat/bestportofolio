'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowDown, ArrowRight, Github, Linkedin, Mail, ChevronRight, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Navbar, Footer } from '@/components/site/navbar'
import { BlogCard, ProjectCard, CourseCard, LoadingCards } from '@/components/site/cards'
import { SkillsMatrix } from '@/components/site/skills-matrix'
import { HeroCarousel } from '@/components/site/hero-carousel'
import { TypingAnimation } from '@/components/site/typing-animation'

interface Project { id: string; title: string; slug: string; shortDesc: string; banner: string; website: string; downloadLink: string; repository: string; stack: string; videoUrl: string; featured: boolean; createdAt: string }
interface Blog { id: string; title: string; slug: string; excerpt: string; coverImage: string; tags: string; type: string; embedUrl: string; published: boolean; createdAt: string; writtenBy: string; acceptedBy: string }
interface Course { id: string; title: string; slug: string; description: string; banner: string; _count?: { chapters: number } }

const DEFAULT_TYPING_LINES = [
  "Backend Engineer",
  "Microservices Architect",
  "Java & Spring Boot Specialist",
  "Distributed Systems Designer",
  "Cloud-Native Builder",
  "Problem Solver",
]

export default function Home() {
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([])
  const [recentBlogs, setRecentBlogs] = useState<Blog[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [carouselImages, setCarouselImages] = useState<string[]>([])
  const [typingLines, setTypingLines] = useState<string[]>(DEFAULT_TYPING_LINES)
  const [activeSkills, setActiveSkills] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/projects?featured=true').then(r => r.json()),
      fetch('/api/blogs?published=true').then(r => r.json()),
      fetch('/api/courses').then(r => r.json()),
    ]).then(([proj, blogs, crs]) => {
      setFeaturedProjects(proj)
      setRecentBlogs(blogs.slice(0, 3))
      setCourses(crs)
      setLoading(false)
    }).catch(() => setLoading(false))

    fetch('/api/profile').then(r => r.json()).then(data => {
      try {
        const imgs = JSON.parse(data.carouselImages || '[]')
        setCarouselImages(imgs.filter(Boolean).slice(0, 5))
      } catch { /* ignore */ }
      try {
        const lines = JSON.parse(data.typingLines || '[]')
        if (Array.isArray(lines) && lines.length > 0) {
          setTypingLines(lines.filter((l: string) => l.trim()).slice(0, 10))
        }
      } catch { /* ignore */ }
    }).catch(() => {})
  }, [])

  const handleSkillToggle = (skill: string) => {
    setActiveSkills(prev => {
      if (prev.includes(skill)) {
        return prev.filter(s => s !== skill)
      }
      if (prev.length >= 5) return prev
      return [...prev, skill]
    })
  }

  const filteredProjects = activeSkills.length > 0
    ? featuredProjects.filter(p => {
        try {
          const stack: string[] = JSON.parse(p.stack)
          return activeSkills.every(sel =>
            stack.some(s => s.toLowerCase().includes(sel.toLowerCase()))
          )
        } catch { return false }
      })
    : featuredProjects

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      <main className="flex-1">
        {/* HERO */}
        <section className="relative flex min-h-screen items-center justify-center px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />
          <div className="absolute top-1/4 -left-32 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute bottom-1/4 -right-32 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />

          {/* Carousel - PC only */}
          {carouselImages.length > 0 && (
            <div className="absolute inset-0 hidden lg:block">
              <HeroCarousel images={carouselImages} intervalMs={3000} />
            </div>
          )}

          <motion.div
            className="relative z-10 max-w-3xl text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Hi, I&apos;m <span className="text-primary">Gokul Saraswat</span>
            </h1>

            <motion.div
              className="mt-4 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed h-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <TypingAnimation lines={typingLines} />
            </motion.div>

            <motion.div
              className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <Button size="lg" className="gap-2" asChild>
                <Link href="/projects">View My Work <ArrowRight className="h-4 w-4" /></Link>
              </Button>
              <Button size="lg" variant="outline" className="gap-2" asChild>
                <Link href="/contact">Get in Touch <Mail className="h-4 w-4" /></Link>
              </Button>
            </motion.div>

            <motion.div
              className="mt-6 flex items-center justify-center gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <a href="https://github.com/gokulsaraswat" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground transition-all duration-300 hover:scale-125 hover:rotate-3" aria-label="GitHub"><Github className="h-5 w-5" /></a>
              <a href="https://www.linkedin.com/in/gokulsaraswat" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-[#0A66C2] transition-all duration-300 hover:scale-125" aria-label="LinkedIn"><Linkedin className="h-5 w-5" /></a>
              <a href="mailto:gokulsaraswat07@gmail.com" className="text-muted-foreground hover:text-[#EA4335] transition-all duration-300 hover:scale-125" aria-label="Email"><Mail className="h-5 w-5" /></a>
            </motion.div>

            <motion.div
              className="mt-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              <a href="#projects" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
                Scroll to explore <ArrowDown className="h-4 w-4 animate-bounce" />
              </a>
            </motion.div>
          </motion.div>
        </section>

        {/* SKILLS & TECHNOLOGIES — before Featured Work */}
        <section className="py-20 px-4 bg-muted/30">
          <div className="mx-auto max-w-6xl">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="mb-8">
              <h2 className="text-2xl font-bold sm:text-3xl">Skills & Technologies</h2>
              <p className="text-muted-foreground mt-1">
                Click skills to filter featured projects below
                {activeSkills.length > 0 && (
                  <span className="text-xs ml-2">
                    ({activeSkills.length}/5 selected)
                  </span>
                )}
              </p>
            </motion.div>
            <SkillsMatrix activeSkills={activeSkills} onSkillToggle={handleSkillToggle} maxSkills={5} />
          </div>
        </section>

        {/* FEATURED PROJECTS — after Skills */}
        <section id="projects" className="py-20 px-4">
          <div className="mx-auto max-w-6xl">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold sm:text-3xl">Featured Work</h2>
                  <p className="text-muted-foreground mt-1">Projects I&apos;m most proud of</p>
                </div>
                <Button variant="ghost" className="gap-1" asChild>
                  <Link href="/projects">View All <ChevronRight className="h-4 w-4" /></Link>
                </Button>
              </div>
            </motion.div>

            {/* Active skill filters */}
            {activeSkills.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 flex flex-wrap items-center gap-2"
              >
                <span className="text-sm text-muted-foreground">Filtered by:</span>
                {activeSkills.map(skill => (
                  <Badge key={skill} variant="default" className="gap-1 pr-1">
                    {skill}
                    <button
                      onClick={() => handleSkillToggle(skill)}
                      className="ml-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full hover:bg-primary-foreground/20 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                <button
                  onClick={() => setActiveSkills([])}
                  className="text-xs text-primary hover:underline ml-1"
                >
                  Clear all
                </button>
                <span className="text-xs text-muted-foreground ml-auto">
                  {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''} found
                </span>
              </motion.div>
            )}

            {loading ? (
              <LoadingCards count={2} />
            ) : filteredProjects.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2">
                {filteredProjects.map((project, i) => (
                  <motion.div key={project.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }}>
                    <ProjectCard project={project} />
                  </motion.div>
                ))}
              </div>
            ) : activeSkills.length > 0 ? (
              <div className="rounded-xl border-2 border-dashed p-12 text-center">
                <p className="text-muted-foreground">No projects match all selected skills.</p>
                <button onClick={() => setActiveSkills([])} className="mt-2 text-sm text-primary hover:underline">Clear filters</button>
              </div>
            ) : (
              <div className="rounded-xl border-2 border-dashed p-12 text-center">
                <p className="text-muted-foreground">No featured projects yet. They&apos;re on the way!</p>
                <Button variant="link" className="mt-2" asChild><Link href="/admin">Add projects &rarr;</Link></Button>
              </div>
            )}
          </div>
        </section>

        {/* RECENT BLOGS */}
        <section className="py-20 px-4">
          <div className="mx-auto max-w-6xl">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold sm:text-3xl">Latest Posts</h2>
                  <p className="text-muted-foreground mt-1">Thoughts on engineering, architecture, and more</p>
                </div>
                <Button variant="ghost" className="gap-1" asChild>
                  <Link href="/blog">All Posts <ChevronRight className="h-4 w-4" /></Link>
                </Button>
              </div>
            </motion.div>

            {loading ? (
              <LoadingCards count={3} />
            ) : recentBlogs.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {recentBlogs.map((blog, i) => (
                  <motion.div key={blog.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }}>
                    <BlogCard blog={blog} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-12">No blog posts yet.</p>
            )}
          </div>
        </section>

        {/* COURSES */}
        {courses.length > 0 && (
          <section className="py-20 px-4 bg-muted/30">
            <div className="mx-auto max-w-6xl">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-bold sm:text-3xl">Courses</h2>
                    <p className="text-muted-foreground mt-1">Structured learning paths I&apos;ve created</p>
                  </div>
                  <Button variant="ghost" className="gap-1" asChild>
                    <Link href="/courses">View All <ChevronRight className="h-4 w-4" /></Link>
                  </Button>
                </div>
              </motion.div>
              <div className="grid gap-6 sm:grid-cols-2">
                {courses.slice(0, 2).map((course, i) => (
                  <motion.div key={course.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }}>
                    <CourseCard course={course} />
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="py-20 px-4">
          <div className="mx-auto max-w-2xl text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
              <h2 className="text-2xl font-bold sm:text-3xl">Let&apos;s Work Together</h2>
              <p className="mt-3 text-muted-foreground">I&apos;m always open to discussing new projects, creative ideas, or opportunities to be part of your vision.</p>
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button size="lg" asChild><Link href="/contact" className="gap-2">Get in Touch <ArrowRight className="h-4 w-4" /></Link></Button>
                <Button size="lg" variant="outline" asChild><a href="mailto:gokulsaraswat07@gmail.com" className="gap-2"><Mail className="h-4 w-4" />Email Me</a></Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}