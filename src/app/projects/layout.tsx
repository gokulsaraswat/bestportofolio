import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Featured projects and work by Gokul Saraswat — enterprise banking microservices, APIs, and full-stack applications.',
  openGraph: { title: 'Projects | Gokul Saraswat', description: 'Featured projects and work by Gokul Saraswat.' },
}

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return children
}