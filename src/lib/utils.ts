import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat('en-US').format(n)
}

export function equipmentTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    semi_tractor:    'Semi Tractor',
    excavator:       'Excavator',
    bulldozer:       'Bulldozer',
    trailer_rgn:     'RGN Trailer',
    trailer_flatbed: 'Flatbed Trailer',
    trailer_lowboy:  'Lowboy Trailer',
    crane:           'Crane',
    grader:          'Motor Grader',
    loader:          'Wheel Loader',
    other:           'Other Equipment',
  }
  return labels[type] ?? type
}

export function conditionLabel(grade: number): string {
  const labels: Record<number, string> = {
    1: 'Poor',
    2: 'Fair',
    3: 'Good',
    4: 'Very Good',
    5: 'Excellent',
  }
  return labels[grade] ?? 'Unknown'
}

export function conditionColor(grade: number): string {
  if (grade >= 5) return 'text-green-600 bg-green-50'
  if (grade >= 4) return 'text-blue-600 bg-blue-50'
  if (grade >= 3) return 'text-yellow-600 bg-yellow-50'
  if (grade >= 2) return 'text-orange-600 bg-orange-50'
  return 'text-red-600 bg-red-50'
}

export function timeAgo(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

export function monthlyPayment(price: number, rate = 7.9, months = 60): number {
  const r = rate / 100 / 12
  return Math.round(price * r / (1 - Math.pow(1 + r, -months)))
}

// Supabase jsonb columns sometimes arrive as strings depending on client/version.
// This normalizes either case to a real array so .map()/.length never crash.
export function asArray<T = any>(value: unknown): T[] {
  if (Array.isArray(value)) return value as T[]
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }
  return []
}
