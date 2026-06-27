import type { Metadata } from 'next'
import { Navbar, Footer } from '@/components/site/navbar'

export const metadata: Metadata = { title: 'Privacy Policy - Gokul Saraswat' }

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-20 px-4">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
          <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6 text-sm text-muted-foreground">
            <p className="text-base text-foreground">Last updated: June 2026</p>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-2">1. Information We Collect</h2>
              <p>When you use the contact form on this website, we collect your name, email address, and the content of your message. We do not use cookies for tracking, and we do not collect any personal data automatically through browsing.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-2">2. How We Use Your Information</h2>
              <p>The information collected through the contact form is used solely to respond to your inquiry. We do not sell, share, or distribute your personal information to any third parties.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-2">3. Data Storage</h2>
              <p>Your contact form submissions are stored securely and are accessible only to the website administrator. Data is retained only as long as necessary to respond to your inquiry.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-2">4. Third-Party Services</h2>
              <p>This website may embed content from third-party services such as YouTube, Spotify, and Twitter/X. These services have their own privacy policies, and we encourage you to review them. We do not control and are not responsible for the privacy practices of these third-party services.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-2">5. Your Rights</h2>
              <p>You have the right to request access to, correction of, or deletion of any personal data you have provided. To exercise these rights, please contact us at gokulsaraswat07@gmail.com.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-2">6. Security</h2>
              <p>We implement appropriate security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-2">7. Changes to This Policy</h2>
              <p>We may update this privacy policy from time to time. Any changes will be posted on this page with an updated revision date.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-2">8. Contact</h2>
              <p>If you have questions about this privacy policy, please contact us at <a href="mailto:gokulsaraswat07@gmail.com" className="text-primary hover:underline">gokulsaraswat07@gmail.com</a>.</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}