'use client'

import { useState, useCallback } from 'react'
import { Twitter, Linkedin, Link2, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export function ShareButtons() {
  const [copied, setCopied] = useState(false)

  const getUrl = useCallback(() => {
    if (typeof window !== 'undefined') {
      return window.location.href
    }
    return ''
  }, [])

  const getTitle = useCallback(() => {
    if (typeof document !== 'undefined') {
      return document.title || ''
    }
    return ''
  }, [])

  const handleTwitter = useCallback(() => {
    const url = encodeURIComponent(getUrl())
    const text = encodeURIComponent(getTitle())
    window.open(
      `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
      '_blank',
      'noopener,noreferrer,width=600,height=400'
    )
  }, [getUrl, getTitle])

  const handleLinkedIn = useCallback(() => {
    const url = encodeURIComponent(getUrl())
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      '_blank',
      'noopener,noreferrer,width=600,height=400'
    )
  }, [getUrl])

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(getUrl())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback
      const textarea = document.createElement('textarea')
      textarea.value = getUrl()
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [getUrl])

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground mr-1">Share:</span>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={handleTwitter}
            aria-label="Share on X (Twitter)"
          >
            <Twitter className="h-3.5 w-3.5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Share on X</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={handleLinkedIn}
            aria-label="Share on LinkedIn"
          >
            <Linkedin className="h-3.5 w-3.5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Share on LinkedIn</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={handleCopy}
            aria-label="Copy link"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-green-500" />
            ) : (
              <Link2 className="h-3.5 w-3.5" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>{copied ? 'Copied!' : 'Copy link'}</TooltipContent>
      </Tooltip>
    </div>
  )
}