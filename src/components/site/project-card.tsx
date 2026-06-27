'use client'

import { motion } from 'framer-motion'
import { ExternalLink, Github, Download } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface ProjectCardProps {
  project: {
    id: string
    title: string
    slug: string
    shortDesc: string
    banner: string
    stack: string
    website: string
    downloadLink: string
    repository: string
    featured: boolean
  }
  index?: number
  large?: boolean
}

export function ProjectCard({ project, index = 0, large = false }: ProjectCardProps) {
  let stack: string[] = []
  try {
    stack = typeof project.stack === 'string' ? JSON.parse(project.stack) : project.stack
  } catch {
    stack = []
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Card className="group overflow-hidden border-border/50 hover:border-border transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 h-full flex flex-col">
        {/* Banner */}
        {project.banner && (
          <div className={large ? 'aspect-[21/9]' : 'aspect-[16/9]'} style={{ position: 'relative', overflow: 'hidden' }}>
            <div
              className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-primary/5"
              style={{
                backgroundImage: project.banner ? `url(${project.banner})` : undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
            {project.featured && (
              <div className="absolute top-3 right-3">
                <Badge className="bg-primary text-primary-foreground text-xs">
                  Featured
                </Badge>
              </div>
            )}
          </div>
        )}

        <CardHeader className="pb-2">
          <CardTitle className={large ? 'text-xl' : 'text-lg'}>{project.title}</CardTitle>
          {project.shortDesc && (
            <CardDescription className={large ? 'text-sm line-clamp-3' : 'text-sm line-clamp-2'}>
              {project.shortDesc}
            </CardDescription>
          )}
        </CardHeader>

        <CardContent className="flex flex-col gap-4 mt-auto">
          {/* Stack badges */}
          {stack.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {stack.slice(0, large ? 8 : 4).map((tech: string) => (
                <Badge key={tech} variant="secondary" className="text-xs font-normal">
                  {tech}
                </Badge>
              ))}
              {stack.length > (large ? 8 : 4) && (
                <Badge variant="outline" className="text-xs font-normal">
                  +{stack.length - (large ? 8 : 4)}
                </Badge>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            {project.website && (
              <Button size="sm" asChild className="flex-1">
                <a href={project.website} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-3.5 w-3.5" />
                  Visit
                </a>
              </Button>
            )}
            {project.downloadLink && (
              <Button size="sm" variant="outline" asChild className="flex-1">
                <a href={project.downloadLink} target="_blank" rel="noopener noreferrer">
                  <Download className="h-3.5 w-3.5" />
                  Download
                </a>
              </Button>
            )}
            {project.repository && (
              <Button size="sm" variant="outline" asChild>
                <a href={project.repository} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                  <Github className="h-3.5 w-3.5" />
                </a>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}