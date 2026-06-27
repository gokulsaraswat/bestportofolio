import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Courses',
  description: 'Free structured learning paths on Go, System Design, and more by Gokul Saraswat.',
  openGraph: { title: 'Courses | Gokul Saraswat', description: 'Free structured learning paths.' },
}

export default function CoursesLayout({ children }: { children: React.ReactNode }) {
  return children
}