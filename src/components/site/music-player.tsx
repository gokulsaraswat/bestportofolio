'use client'

import { useState, useEffect, useRef } from 'react'
import { Volume2, VolumeX, Music } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

export function MusicPlayer() {
  const [muted, setMuted] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)
  const [musicUrl, setMusicUrl] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    setMounted(true)
    fetch('/api/profile')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data?.musicUrl) setMusicUrl(data.musicUrl)
        else setMusicUrl(null)
      })
      .catch(() => setMusicUrl(null))
  }, [])

  useEffect(() => {
    if (!mounted || !musicUrl) return

    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.src = ''
    }

    const audio = new Audio(musicUrl)
    audio.loop = true
    audio.volume = 0.3
    audioRef.current = audio

    const handleFirstInteraction = () => {
      if (!hasInteracted) {
        setHasInteracted(true)
        audio.play().catch(() => {})
      }
      document.removeEventListener('click', handleFirstInteraction)
      document.removeEventListener('keydown', handleFirstInteraction)
    }

    document.addEventListener('click', handleFirstInteraction)
    document.addEventListener('keydown', handleFirstInteraction)

    return () => {
      audio.pause()
      audio.src = ''
      document.removeEventListener('click', handleFirstInteraction)
      document.removeEventListener('keydown', handleFirstInteraction)
    }
  }, [mounted, musicUrl])

  if (!mounted || !musicUrl) return null

  const toggleMute = () => {
    if (!audioRef.current) return
    if (muted) {
      audioRef.current.play().catch(() => {})
      setMuted(false)
    } else {
      audioRef.current.pause()
      setMuted(true)
    }
    setHasInteracted(true)
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 2, duration: 0.5 }}
      className="fixed bottom-20 left-6 z-40"
    >
      <Button
        variant="outline"
        size="sm"
        onClick={toggleMute}
        className="h-9 gap-1.5 rounded-full px-3 text-xs shadow-sm bg-background/80 backdrop-blur-sm"
        title={muted ? 'Play music' : 'Mute music'}
      >
        {muted ? (
          <VolumeX className="h-3.5 w-3.5 text-muted-foreground" />
        ) : (
          <Volume2 className="h-3.5 w-3.5" />
        )}
        <Music className="h-3 w-3" />
        <span className="hidden sm:inline">{muted ? 'Play' : 'Mute'}</span>
      </Button>
    </motion.div>
  )
}