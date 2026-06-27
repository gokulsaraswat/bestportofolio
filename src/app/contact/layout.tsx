import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with Gokul Saraswat for freelance work, collaboration, or just to say hello.',
  openGraph: { title: 'Contact | Gokul Saraswat', description: 'Get in touch for collaboration.' },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}