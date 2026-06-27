'use client'

import { ArrowUpDown } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export interface SortOption {
  value: string // "field:dir"
  label: string
}

interface SortBarProps {
  options: SortOption[]
  value: string
  onChange: (value: string) => void
  className?: string
}

export function SortBar({ options, value, onChange, className = '' }: SortBarProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-[170px] h-8 text-xs">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}