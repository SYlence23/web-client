import type { TaskStatus } from '../api/types.ts'

const styles: Record<TaskStatus, string> = {
  queued: 'bg-sky-500/15 text-sky-300',
  running: 'bg-accent-500/15 text-accent-400',
  done: 'bg-emerald-500/15 text-emerald-300',
  cancelled: 'bg-slate-500/20 text-slate-300',
  failed: 'bg-red-500/15 text-red-300',
}

export default function StatusBadge({ status }: { status: TaskStatus }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status]}`}>
      {status === 'running' && <span className="size-1.5 animate-pulse rounded-full bg-current" />}
      {status}
    </span>
  )
}
