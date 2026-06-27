'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, Github, Linkedin, Twitter, Mail, MapPin, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Navbar, Footer } from '@/components/site/navbar'
import { useToast } from '@/hooks/use-toast'

export default function ContactPage() {
  const { toast } = useToast()
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sending, setSending] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast({ title: 'Please fill in required fields', variant: 'destructive' })
      return
    }
    setSending(true)
    try {
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      if (!res.ok) throw new Error()
      toast({ title: 'Message sent!', description: 'Thank you for reaching out. I\'ll get back to you soon.' })
      setForm({ name: '', email: '', subject: '', message: '' })
    } catch {
      toast({ title: 'Failed to send', description: 'Please try again later.', variant: 'destructive' })
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-20 px-4">
        <div className="mx-auto max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="text-3xl font-bold sm:text-4xl">Get in Touch</h1>
            <p className="mt-2 text-muted-foreground">Have a question or want to work together? Drop me a message.</p>
          </motion.div>

          <div className="grid gap-8 lg:grid-cols-5">
            {/* Contact Info */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-2 space-y-6">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <div><p className="text-sm font-medium">Email</p><a href="mailto:gokulsaraswat07@gmail.com" className="text-sm text-muted-foreground hover:text-foreground">gokulsaraswat07@gmail.com</a></div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <div><p className="text-sm font-medium">Location</p><p className="text-sm text-muted-foreground">Bangalore, Karnataka, India</p></div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <div><p className="text-sm font-medium">Phone</p><p className="text-sm text-muted-foreground">+91-9829086012</p></div>
              </div>
              <div className="pt-4 border-t">
                <p className="text-sm font-medium mb-3">Connect</p>
                <div className="flex gap-3">
                  <a href="https://github.com/gokulsaraswat" target="_blank" rel="noreferrer" className="p-2 rounded-lg border hover:bg-accent transition-all duration-300 hover:scale-125 hover:rotate-3" aria-label="GitHub"><Github className="h-5 w-5" /></a>
                  <a href="https://www.linkedin.com/in/gokulsaraswat" target="_blank" rel="noreferrer" className="p-2 rounded-lg border hover:bg-[#0A66C2]/10 hover:border-[#0A66C2]/30 hover:text-[#0A66C2] transition-all duration-300 hover:scale-125" aria-label="LinkedIn"><Linkedin className="h-5 w-5" /></a>
                  <a href="https://x.com/gokulsaraswat" target="_blank" rel="noreferrer" className="p-2 rounded-lg border hover:bg-black/5 hover:border-black/30 hover:text-black dark:hover:bg-white/5 dark:hover:border-white/30 dark:hover:text-white transition-all duration-300 hover:scale-125" aria-label="X.com"><Twitter className="h-5 w-5" /></a>
                </div>
              </div>
            </motion.div>

            {/* Form */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-3">
              <form onSubmit={handleSubmit} className="rounded-xl border p-6 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name *</Label>
                    <Input id="name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Your name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input id="email" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="you@example.com" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} placeholder="What's this about?" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea id="message" rows={5} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} placeholder="Tell me about your project or idea..." />
                </div>
                <Button type="submit" disabled={sending} className="w-full gap-2">
                  {sending ? 'Sending...' : <><Send className="h-4 w-4" /> Send Message</>}
                </Button>
              </form>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}