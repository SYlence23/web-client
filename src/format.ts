export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${Math.max(1, Math.round(seconds))} s`
  const minutes = Math.floor(seconds / 60)
  const rest = Math.round(seconds % 60)
  if (minutes < 60) return rest ? `${minutes} min ${rest} s` : `${minutes} min`
  return `${Math.floor(minutes / 60)} h ${minutes % 60} min`
}

const dateTimeFormat = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' })

export function formatDateTime(iso: string): string {
  return dateTimeFormat.format(new Date(iso))
}

export function ordinal(position: number): string {
  const tens = position % 100
  if (tens >= 11 && tens <= 13) return `${position}th`
  const suffix = { 1: 'st', 2: 'nd', 3: 'rd' }[position % 10] ?? 'th'
  return `${position}${suffix}`
}
