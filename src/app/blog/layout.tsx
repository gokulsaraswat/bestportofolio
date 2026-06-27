import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Thoughts on backend engineering, Java, Spring Boot, microservices, system design, and more by Gokul Saraswat.',
  openGraph: { title: 'Blog | Gokul Saraswat', description: 'Thoughts on backend engineering, Java, Spring Boot, microservices, system design, and more.' },
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children
}