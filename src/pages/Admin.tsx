import { useAdminRenderers, useAdminTasks } from '../api/admin.ts'
import type { AdminRenderer, AdminTask } from '../api/types.ts'
import StatusBadge from '../components/StatusBadge.tsx'
import { formatDuration, ordinal } from '../format.ts'
import { SCENES } from '../scenes.ts'

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-3">
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold tabular-nums">{value}</p>
    </div>
  )
}

function WorkerCard({ worker }: { worker: AdminRenderer }) {
  const load = Math.min(worker.load, 1)
  const color = load >= 1 ? 'bg-red-500' : load >= 0.5 ? 'bg-amber-400' : 'bg-emerald-500'

  return (
    <div className={`rounded-xl border p-4 ${worker.up ? 'border-slate-800 bg-slate-900/50' : 'border-red-900 bg-red-950/30'}`}>
      <div className="flex items-center justify-between">
        <span className="font-medium">{worker.name}</span>
        <span className={`flex items-center gap-1.5 text-xs ${worker.up ? 'text-emerald-400' : 'text-red-400'}`}>
          <span className="size-2 rounded-full bg-current" />
          {worker.up ? 'up' : 'down'}
        </span>
      </div>
      <p className="mt-1 truncate font-mono text-xs text-slate-500">{worker.url}</p>
      <div className="mt-4 flex items-baseline justify-between text-sm">
        <span className="text-slate-400">Running</span>
        <span className="tabular-nums">
          {worker.running} / {worker.capacity}
        </span>
      </div>
      <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-800">
        <div className={`h-full rounded-full transition-[width] duration-500 ${color}`} style={{ width: `${load * 100}%` }} />
      </div>
    </div>
  )
}

function TaskRow({ task }: { task: AdminTask }) {
  const scene = SCENES.find((item) => item.id === task.scene)?.name ?? task.scene

  return (
    <tr className="border-t border-slate-800">
      <td className="py-2.5 pr-4">{task.username ?? '—'}</td>
      <td className="py-2.5 pr-4">{scene}</td>
      <td className="py-2.5 pr-4 text-slate-400">
        {task.width}×{task.height} · {task.spp} spp
      </td>
      <td className="py-2.5 pr-4">
        <StatusBadge status={task.status} />
      </td>
      <td className="py-2.5 pr-4 tabular-nums text-slate-300">
        {task.status === 'running'
          ? `${task.progress.toFixed(1)}%`
          : task.queuePosition
            ? `${ordinal(task.queuePosition)}${task.etaSeconds !== null ? `, ~${formatDuration(task.etaSeconds)}` : ''}`
            : '—'}
      </td>
      <td className="py-2.5 text-slate-400">{task.renderer ?? '—'}</td>
    </tr>
  )
}

export default function Admin() {
  const renderers = useAdminRenderers()
  const tasks = useAdminTasks()

  const workers = renderers.data ?? []
  const active = tasks.data ?? []
  const up = workers.filter((worker) => worker.up)
  const running = up.reduce((sum, worker) => sum + worker.running, 0)
  const capacity = up.reduce((sum, worker) => sum + worker.capacity, 0)
  const queued = active.filter((task) => task.status === 'queued').length

  return (
    <section className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Admin</h1>
        <p className="mt-1 text-slate-400">Workers, their load, and every active render. Refreshes every 2 seconds.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Stat label="Workers up" value={`${up.length} / ${workers.length}`} />
        <Stat label="Slots busy" value={`${running} / ${capacity}`} />
        <Stat label="Running" value={String(active.length - queued)} />
        <Stat label="Queued" value={String(queued)} />
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-medium">Workers</h2>
        {renderers.isError && <p className="text-red-400">{renderers.error.message}</p>}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {workers.map((worker) => (
            <WorkerCard key={worker.url} worker={worker} />
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-medium">Active renders</h2>
        {tasks.isError && <p className="text-red-400">{tasks.error.message}</p>}
        {tasks.data && active.length === 0 && <p className="text-slate-500">Nothing is running or queued.</p>}
        {active.length > 0 && (
          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/50 px-4">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="py-2.5 pr-4 font-medium">User</th>
                  <th className="py-2.5 pr-4 font-medium">Scene</th>
                  <th className="py-2.5 pr-4 font-medium">Size</th>
                  <th className="py-2.5 pr-4 font-medium">Status</th>
                  <th className="py-2.5 pr-4 font-medium">Progress / queue</th>
                  <th className="py-2.5 font-medium">Worker</th>
                </tr>
              </thead>
              <tbody>
                {active.map((task) => (
                  <TaskRow key={task.id} task={task} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  )
}
