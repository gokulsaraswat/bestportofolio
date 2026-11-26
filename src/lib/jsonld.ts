import type { MetadataRoute } from 'next'

/**
 * JSON-LD structured data for the Person schema.
 * Rendered in the homepage <head> via a <script type="application/ld+json"> tag
 * for richer Google search results (knowledge panel eligibility).
 *
 * This is a server component — data is fetched at build/request time.
 */
import { db } from '@/lib/db'

export async function getPersonJsonLd() {
  const profile = await db.profile.findFirst().catch(() => null)

  const person = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile?.name || 'Gokul Saraswat',
    jobTitle: profile?.occupation || 'Backend Engineer',
    worksFor: {
      '@type': 'Organization',
      name: profile?.company || 'Oracle Financial Services Software',
    },
    email: `mailto:${profile?.email || 'gokulsaraswat07@gmail.com'}`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: profile?.location || 'Bangalore',
      addressCountry: 'IN',
    },
    url: profile?.website || 'https://gokulsaraswat.com',
    sameAs: [
      profile?.github,
      profile?.linkedin,
      profile?.twitter,
    ].filter(Boolean),
    knowsAbout: (() => {
      try {
        const skills = JSON.parse(profile?.skills || '[]')
        return skills.flatMap((cat: { items?: string[] }) => cat.items || [])
      } catch {
        return ['Java', 'Spring Boot', 'Microservices', 'SQL']
      }
    })(),
  }

  return person
}
