'use client'

import { useTheme } from 'next-themes'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'

export function ThemedCodeBlock({ language, children }: { language: string; children: string }) {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'
  const code = String(children).replace(/\n$/, '')

  return (
    <SyntaxHighlighter
      style={isDark ? oneDark : oneLight}
      language={language}
      PreTag="div"
      className={`rounded-lg !p-4 !text-sm !border !border-border ${isDark ? '!bg-[#282c34]' : '!bg-[#fafafa]'}`}
      showLineNumbers={code.split('\n').length > 3}
      lineNumberStyle={{ minWidth: '2.5em', paddingRight: '1em', color: isDark ? '#555' : '#aaa', userSelect: 'none' }}
    >
      {code}
    </SyntaxHighlighter>
  )
}

export function getThemedStyle() {
  // For server components or non-hook contexts, this returns a default.
  // In client components, prefer using <ThemedCodeBlock> directly.
  return oneDark
}