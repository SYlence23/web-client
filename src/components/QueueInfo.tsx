import { formatDuration, ordinal } from '../format.ts'

interface QueueInfoProps {
  position: number | null
  etaSeconds: number | null
}

export default function QueueInfo({ position, etaSeconds }: QueueInfoProps) {
  return (
    <div className="rounded-lg border border-sky-900 bg-sky-950/40 px-4 py-3">
      <p className="text-sm font-medium text-sky-200">
        {position ? `${ordinal(position)} in queue` : 'In queue'}
      </p>
      <p className="mt-1 text-sm text-sky-300/80">
        {etaSeconds !== null ? `Starts in about ${formatDuration(etaSeconds)}` : 'Waiting for a free worker'}
      </p>
      <p className="mt-2 text-xs text-slate-500">
        Every worker is busy. The render starts as soon as a slot frees up.
      </p>
    </div>
  )
}
