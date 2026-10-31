import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { LegalPage, footerPages, type FooterPageSlug } from '@gokulsaraswat/ui'
import { Navbar, Footer } from '@/components/site/navbar'

const OWN_PAGES: FooterPageSlug[] = ['about', 'contact', 'privacy']
const sharedPages = footerPages.filter((p) => !OWN_PAGES.includes(p.slug))

export const dynamicParams = false

export function generateStaticParams() {
  return sharedPages.map((p) => ({ legal: p.slug }))
}

type Props = { params: Promise<{ legal: string }> }

function findPage(slug: string) {
  return sharedPages.find((p) => p.slug === slug)
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = findPage((await params).legal)
  return page ? { title: page.title } : {}
}

export default async function SharedFooterPage({ params }: Props) {
  const page = findPage((await params).legal)
  if (!page) notFound()

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main id="main-content" className="flex-1 py-20 px-4">
        <div className="mx-auto max-w-3xl">
          <LegalPage slug={page.slug} siteName="Gokul Saraswat" contactEmail="gokulsaraswat07@gmail.com" />
        </div>
      </main>
      <Footer />
    </div>
  )
}
