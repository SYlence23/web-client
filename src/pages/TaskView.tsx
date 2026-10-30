import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { Link, useParams } from 'react-router'
import { ApiError } from '../api/client.ts'
import { cancelRender, getRender, renderKey, rendersKey } from '../api/renders.ts'
import { useRenderSocket } from '../api/useRenderSocket.ts'
import ProgressBar from '../components/ProgressBar.tsx'
import QueueInfo from '../components/QueueInfo.tsx'
import RenderImage from '../components/RenderImage.tsx'
import StatusBadge from '../components/StatusBadge.tsx'
import { ACTIVE_STATUSES } from '../limits.ts'
import { SCENES } from '../scenes.ts'

function Detail({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="mt-0.5 text-sm text-slate-200">{children}</dd>
    </div>
  )
}

export default function TaskView() {
  const { id = '' } = useParams()
  const queryClient = useQueryClient()

  const render = useQuery({
    queryKey: renderKey(id),
    queryFn: () => getRender(id),
    refetchInterval: (query) => {
      const status = query.state.data?.status
      return status && ACTIVE_STATUSES.includes(status) && !live ? 1000 : false
    },
  })
  const active = render.data ? ACTIVE_STATUSES.includes(render.data.status) : false
  const live = useRenderSocket(id, active)

  const cancel = useMutation({
    mutationFn: () => cancelRender(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: renderKey(id) })
      queryClient.invalidateQueries({ queryKey: rendersKey, exact: true })
    },
  })

  if (render.isPending) {
    return <p className="text-slate-400">Loading…</p>
  }

  if (render.isError) {
    const notFound = render.error instanceof ApiError && render.error.status === 404
    return (
      <div className="space-y-4">
        <p className="text-red-400">{notFound ? 'This render does not exist.' : render.error.message}</p>
        <Link to="/history" className="text-accent-400 hover:underline">
          Back to history
        </Link>
      </div>
    )
  }

  const task = render.data
  const sceneName = SCENES.find((scene) => scene.id === task.scene)?.name ?? task.scene

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_18rem]">
      <RenderImage id={task.id} status={task.status} width={task.width} height={task.height} download />

      <aside className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold">{sceneName}</h1>
            <StatusBadge status={task.status} />
            {active && (
              <span className={`text-xs ${live ? 'text-emerald-400' : 'text-slate-500'}`}>
                {live ? 'live' : 'polling'}
              </span>
            )}
          </div>
          <p className="font-mono text-xs text-slate-500">{task.id}</p>
        </div>

        {task.status === 'queued' ? (
          <QueueInfo position={task.queuePosition} etaSeconds={task.etaSeconds} />
        ) : (
          <ProgressBar value={task.progress} />
        )}

        {task.error && (
          <p className="rounded-md border border-red-900 bg-red-950/50 px-3 py-2 text-sm text-red-300">{task.error}</p>
        )}

        <dl className="grid grid-cols-2 gap-4">
          <Detail label="Resolution">
            {task.width}×{task.height}
          </Detail>
          <Detail label="Quality">{task.spp} spp</Detail>
          <Detail label="Worker">{task.renderer ?? '—'}</Detail>
          <Detail label="Created">{new Date(task.createdAt).toLocaleTimeString()}</Detail>
        </dl>

        {active && (
          <button
            type="button"
            onClick={() => cancel.mutate()}
            disabled={cancel.isPending}
            className="w-full rounded-md border border-red-800 px-4 py-2 text-sm text-red-300 transition hover:bg-red-950 disabled:opacity-50"
          >
            {cancel.isPending ? 'Cancelling…' : 'Cancel render'}
          </button>
        )}
        {cancel.error && <p className="text-sm text-red-400">{cancel.error.message}</p>}

        <Link to="/" className="block text-sm text-accent-400 hover:underline">
          Start another render
        </Link>
      </aside>
    </div>
  )
}
