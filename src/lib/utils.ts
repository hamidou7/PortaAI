import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | null | undefined): string {
  if (!date) return ""
  
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
  }
  
  return new Intl.DateTimeFormat('fr-FR', options).format(date)
}

export function formatDateRange(startDate: Date, endDate: Date | null | undefined, current: boolean = false): string {
  const start = formatDate(startDate)
  if (current) return `${start} - Présent`
  if (!endDate) return start
  return `${start} - ${formatDate(endDate)}`
}

export function formatShortDate(date: Date | null | undefined): string {
  if (!date) return ""
  
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
  }
  
  return new Intl.DateTimeFormat('fr-FR', options).format(date)
}
