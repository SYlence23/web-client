import { Link } from 'react-router'
import { useRenders } from '../api/renders.ts'
import type { RenderStatus } from '../api/types.ts'
import RenderImage from '../components/RenderImage.tsx'
import StatusBadge from '../components/StatusBadge.tsx'
import { formatDateTime, formatDuration, ordinal } from '../format.ts'
import { SCENES } from '../scenes.ts'

function sceneName(id: string) {
  return SCENES.find((scene) => scene.id === id)?.name ?? id
}

function RenderCard({ render }: { render: RenderStatus }) {
  return (
    <Link
      to={`/renders/${render.id}`}
      className="group block overflow-hidden rounded-xl border border-slate-800 bg-slate-900/50 transition hover:border-slate-600"
    >
      <RenderImage id={render.id} status={render.status} width={render.width} height={render.height} refreshMs={5000} />
      <div className="space-y-2 p-4">
        <div className="flex items-center justify-between gap-2">
          <span className="font-medium group-hover:text-white">{sceneName(render.scene)}</span>
          <StatusBadge status={render.status} />
        </div>
        <p className="text-sm text-slate-400">
          {render.width}×{render.height} · {render.spp} spp
          {render.renderer && <> · {render.renderer}</>}
        </p>
        {render.status === 'running' && (
          <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">
            <div className="h-full bg-accent-500 transition-[width]" style={{ width: `${render.progress}%` }} />
          </div>
        )}
        {render.status === 'queued' && render.queuePosition && (
          <p className="text-xs text-sky-300">
            {ordinal(render.queuePosition)} in queue
            {render.etaSeconds !== null && <>, about {formatDuration(render.etaSeconds)}</>}
          </p>
        )}
        <p className="text-xs text-slate-500">{formatDateTime(render.createdAt)}</p>
      </div>
    </Link>
  )
}

export default function History() {
  const renders = useRenders()

  return (
    <section className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">History</h1>
          <p className="mt-1 text-slate-400">Your past and current renders, newest first.</p>
        </div>
        <Link
          to="/"
          className="rounded-md bg-accent-500 px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-accent-400"
        >
          New render
        </Link>
      </div>

      {renders.isPending && <p className="text-slate-400">Loading…</p>}
      {renders.isError && <p className="text-red-400">{renders.error.message}</p>}

      {renders.data?.length === 0 && (
        <div className="rounded-xl border border-dashed border-slate-700 py-16 text-center">
          <p className="text-slate-400">No renders yet.</p>
          <Link to="/" className="mt-2 inline-block text-accent-400 hover:underline">
            Start your first one
          </Link>
        </div>
      )}

      {renders.data && renders.data.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {renders.data.map((render) => (
            <RenderCard key={render.id} render={render} />
          ))}
        </div>
      )}
    </section>
  )
}
