import Link from 'next/link'
import { Github, Linkedin, Twitter, Mail } from 'lucide-react'
import { Footer as SharedFooter, type FooterColumn, type FooterSocial } from '@gokulsaraswat/ui'

const columns: FooterColumn[] = [
  {
    title: 'Explore',
    links: [
      { label: 'Home', href: '/' },
      { label: 'Projects', href: '/projects' },
      { label: 'Blog', href: '/blog' },
    ],
  },
  {
    title: 'Learn',
    links: [
      { label: 'Courses', href: '/courses' },
      { label: 'Snippets', href: '/snippets' },
    ],
  },
]

const iconClass = 'h-4 w-4'
const socials: FooterSocial[] = [
  { label: 'GitHub', href: 'https://github.com/gokulsaraswat', icon: <Github className={iconClass} /> },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/gokulsaraswat', icon: <Linkedin className={iconClass} /> },
  { label: 'X.com', href: 'https://x.com/gokulsaraswat', icon: <Twitter className={iconClass} /> },
  { label: 'Email', href: 'mailto:gokulsaraswat07@gmail.com', icon: <Mail className={iconClass} /> },
]

export function Footer() {
  return (
    <SharedFooter
      siteName="Gokul Saraswat"
      tagline="Backend Engineer architecting high-availability microservices for enterprise banking. Specializing in Java, Spring Boot, and distributed systems."
      columns={columns}
      socials={socials}
      linkComponent={Link}
    />
  )
}
