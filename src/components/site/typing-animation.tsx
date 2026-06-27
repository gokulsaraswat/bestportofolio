'use client'

import { useState, useEffect, useCallback } from 'react'

interface TypingAnimationProps {
  lines: string[]
  typingSpeed?: number
  deletingSpeed?: number
  pauseBeforeDelete?: number
  pauseBeforeType?: number
  className?: string
}

export function TypingAnimation({
  lines,
  typingSpeed = 60,
  deletingSpeed = 35,
  pauseBeforeDelete = 2000,
  pauseBeforeType = 400,
  className = '',
}: TypingAnimationProps) {
  const [currentLineIndex, setCurrentLineIndex] = useState(0)
  const [currentText, setCurrentText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [isWaiting, setIsWaiting] = useState(false)
  const [isFinished, setIsFinished] = useState(false)

  const tick = useCallback(() => {
    if (lines.length === 0) return

    const isLastLine = currentLineIndex === lines.length - 1

    if (isWaiting) return

    const fullText = lines[currentLineIndex]

    if (!isDeleting) {
      // Typing
      if (currentText.length < fullText.length) {
        setCurrentText(fullText.slice(0, currentText.length + 1))
      } else {
        // Finished typing this line
        if (isLastLine) {
          setIsFinished(true)
          return
        }
        setIsWaiting(true)
        setTimeout(() => {
          setIsWaiting(false)
          setIsDeleting(true)
        }, pauseBeforeDelete)
      }
    } else {
      // Deleting
      if (currentText.length > 0) {
        setCurrentText(currentText.slice(0, -1))
      } else {
        // Finished deleting, move to next line
        setIsDeleting(false)
        setCurrentLineIndex((prev) => (prev + 1) % lines.length)
        setIsWaiting(true)
        setTimeout(() => {
          setIsWaiting(false)
        }, pauseBeforeType)
      }
    }
  }, [currentText, currentLineIndex, isDeleting, isWaiting, lines, pauseBeforeDelete, pauseBeforeType])

  useEffect(() => {
    if (lines.length === 0 || isFinished) return

    const speed = isDeleting ? deletingSpeed : typingSpeed
    const timer = setTimeout(tick, isWaiting ? 100 : speed)
    return () => clearTimeout(timer)
  }, [tick, isDeleting, isWaiting, deletingSpeed, typingSpeed, lines.length, isFinished])

  if (lines.length === 0) return null

  return (
    <span className={className}>
      {currentText}
      {!isFinished && (
        <span className="inline-block w-[3px] h-[1.1em] bg-current ml-0.5 align-middle animate-pulse" />
      )}
    </span>
  )
}