'use client'

import Link from 'next/link'
import { Code2, Github, Linkedin, Twitter, Mail, Shield } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border bg-card/50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left: Brand */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <Link
              href="/"
              className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
            >
              <Code2 className="h-5 w-5" />
              <span className="font-bold text-lg tracking-tight">
                Gokul Saraswat
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Backend Engineer · Bangalore, India
            </p>
          </div>

          {/* Center: Social Links */}
          <div className="flex items-center gap-3">
            <a
              href="https://github.com/gokulsaraswat"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-secondary-foreground hover:bg-foreground hover:text-background transition-all duration-300 hover:scale-125 hover:rotate-3"
              aria-label="GitHub"
            >
              <Github className="h-4 w-4" />
            </a>
            <a
              href="https://www.linkedin.com/in/gokulsaraswat"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-secondary-foreground hover:bg-[#0A66C2] hover:text-white transition-all duration-300 hover:scale-125"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-4 w-4" />
            </a>
            <a
              href="https://x.com/gokulsaraswat"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-secondary-foreground hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300 hover:scale-125"
              aria-label="X.com"
            >
              <Twitter className="h-4 w-4" />
            </a>
            <a
              href="mailto:gokulsaraswat07@gmail.com"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-secondary-foreground hover:bg-[#EA4335] hover:text-white transition-all duration-300 hover:scale-125"
              aria-label="Email"
            >
              <Mail className="h-4 w-4" />
            </a>
          </div>

          {/* Right: Links */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <a
              href="https://github.com/gokulsaraswat"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-foreground transition-colors"
            >
              <Github className="h-3 w-3" />
              Contribute
            </a>
            <Link
              href="/privacy"
              className="hover:text-foreground transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/admin"
              className="flex items-center gap-1 hover:text-foreground transition-colors"
            >
              <Shield className="h-3 w-3" />
              Admin
            </Link>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-6 pt-4 border-t border-border text-center">
          <p className="text-xs text-muted-foreground">
            &copy; {currentYear} Gokul Saraswat. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}