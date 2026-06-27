'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { Menu, Sun, Moon, Github, Linkedin, Twitter, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import { GlobalSearch } from '@/components/site/global-search'
export { Footer } from '@/components/site/footer'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/projects', label: 'Projects' },
  { href: '/blog', label: 'Blog' },
  { href: '/courses', label: 'Courses' },
  { href: '/snippets', label: 'Snippets' },
  { href: '/contact', label: 'Contact' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-background/80 backdrop-blur-md border-b shadow-sm' : 'bg-transparent'}`}>
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-lg font-bold tracking-tight hover:opacity-80 transition-opacity">
          Gokul Saraswat
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <GlobalSearch />
          {mounted && (
            <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          )}

          <div className="hidden md:flex items-center gap-1">
            <a href="https://github.com/gokulsaraswat" target="_blank" rel="noreferrer" className="p-2 text-muted-foreground hover:text-foreground transition-all duration-300 hover:scale-125 hover:rotate-3" aria-label="GitHub">
              <Github className="h-4 w-4" />
            </a>
            <a href="https://www.linkedin.com/in/gokulsaraswat" target="_blank" rel="noreferrer" className="p-2 text-muted-foreground hover:text-[#0A66C2] transition-all duration-300 hover:scale-125" aria-label="LinkedIn">
              <Linkedin className="h-4 w-4" />
            </a>
            <a href="https://x.com/gokulsaraswat" target="_blank" rel="noreferrer" className="p-2 text-muted-foreground hover:text-foreground dark:hover:text-white transition-all duration-300 hover:scale-125" aria-label="X.com">
              <Twitter className="h-4 w-4" />
            </a>
            <a href="mailto:gokulsaraswat07@gmail.com" className="p-2 text-muted-foreground hover:text-[#EA4335] transition-all duration-300 hover:scale-125" aria-label="Email">
              <Mail className="h-4 w-4" />
            </a>
          </div>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <div className="flex flex-col gap-1 mt-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="mt-4 flex items-center gap-3 px-3">
                  <a href="https://github.com/gokulsaraswat" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground transition-all duration-300 hover:scale-125 hover:rotate-3" aria-label="GitHub"><Github className="h-5 w-5" /></a>
                  <a href="https://www.linkedin.com/in/gokulsaraswat" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-[#0A66C2] transition-all duration-300 hover:scale-125" aria-label="LinkedIn"><Linkedin className="h-5 w-5" /></a>
                  <a href="https://x.com/gokulsaraswat" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground dark:hover:text-white transition-all duration-300 hover:scale-125" aria-label="X.com"><Twitter className="h-5 w-5" /></a>
                  <a href="mailto:gokulsaraswat07@gmail.com" className="text-muted-foreground hover:text-[#EA4335] transition-all duration-300 hover:scale-125" aria-label="Email"><Mail className="h-5 w-5" /></a>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  )
}

