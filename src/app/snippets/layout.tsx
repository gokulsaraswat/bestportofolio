import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Snippets',
  description: 'Code snippets, HLDs, LLDs, API designs, DB designs, and more by Gokul Saraswat.',
  openGraph: {
    title: 'Snippets | Gokul Saraswat',
    description: 'Code snippets, HLDs, LLDs, API designs, DB designs, and more.',
  },
}

export default function SnippetsLayout({ children }: { children: React.ReactNode }) {
  return children
}