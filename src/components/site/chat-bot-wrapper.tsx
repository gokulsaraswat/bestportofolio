'use client'

import { useEffect, useState } from 'react'
import { ChatWidget } from '@/components/site/chat-widget'

export function ChatBotWrapper() {
  const [visible, setVisible] = useState(false)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    fetch('/api/chat-status')
      .then(r => r.json())
      .then(data => {
        setVisible(data.enabled === true)
        setChecked(true)
      })
      .catch(() => setChecked(true))
  }, [])

  // Don't render anything until we've checked
  if (!checked) return null
  if (!visible) return null

  return <ChatWidget />
}