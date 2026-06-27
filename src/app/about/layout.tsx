import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About',
  description: 'Backend Engineer with 3 years of experience architecting high-availability microservices for enterprise banking at Oracle Financial Services.',
  openGraph: { title: 'About | Gokul Saraswat', description: 'Backend Engineer at Oracle Financial Services Software, Bangalore.' },
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children
}