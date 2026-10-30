import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState, type FormEvent, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router'
import { createRender, rendersKey, useRenders } from '../api/renders.ts'
import ComplexityMeter from '../components/ComplexityMeter.tsx'
import { MAX_ACTIVE_RENDERS, MAX_HEIGHT, MAX_WIDTH, complexity, isActive, renderProblems } from '../limits.ts'
import { SCENES } from '../scenes.ts'

const RESOLUTIONS = [
  { label: '480p', width: 854, height: 480 },
  { label: '720p', width: 1280, height: 720 },
  { label: '1080p', width: 1920, height: 1080 },
]

const QUALITIES = [
  { label: 'Draft', spp: 16 },
  { label: 'Low', spp: 32 },
  { label: 'Medium', spp: 64 },
  { label: 'High', spp: 128 },
  { label: 'Best', spp: 256 },
]

function OptionButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg border px-3 py-2 text-left text-sm transition ${
        active
          ? 'border-accent-500 bg-accent-500/10 text-white'
          : 'border-slate-700 text-slate-300 hover:border-slate-500'
      }`}
    >
      {children}
    </button>
  )
}

const inputClass =
  'w-28 rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-500/30'

export default function NewRender() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [scene, setScene] = useState(SCENES[0].id)
  const [resolution, setResolution] = useState('720p')
  const [width, setWidth] = useState(1280)
  const [height, setHeight] = useState(720)
  const [spp, setSpp] = useState(64)

  const renders = useRenders()
  const activeCount = renders.data?.filter((render) => isActive(render.status)).length ?? 0
  const tooManyActive = activeCount >= MAX_ACTIVE_RENDERS

  const mutation = useMutation({
    mutationFn: createRender,
    onSuccess: (created) => {
      queryClient.invalidateQueries({ queryKey: rendersKey })
      navigate(`/renders/${created.id}`)
    },
  })

  const problems = renderProblems(width, height, spp)
  const canStart = problems.length === 0 && !tooManyActive && !mutation.isPending

  function pickResolution(label: string) {
    setResolution(label)
    const preset = RESOLUTIONS.find((item) => item.label === label)
    if (preset) {
      setWidth(preset.width)
      setHeight(preset.height)
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (canStart) mutation.mutate({ scene, width, height, spp })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">New render</h1>
        <p className="mt-1 text-slate-400">Pick a scene, resolution and quality, then start rendering.</p>
      </div>

      <fieldset className="space-y-3">
        <legend className="mb-3 font-medium">Scene</legend>
        <div className="grid gap-3 sm:grid-cols-3">
          {SCENES.map((item) => (
            <OptionButton key={item.id} active={scene === item.id} onClick={() => setScene(item.id)}>
              <span className="block font-medium">{item.name}</span>
              <span className="mt-1 block text-xs text-slate-400">{item.description}</span>
            </OptionButton>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-3 font-medium">Resolution</legend>
        <div className="flex flex-wrap gap-2">
          {RESOLUTIONS.map((item) => (
            <OptionButton key={item.label} active={resolution === item.label} onClick={() => pickResolution(item.label)}>
              {item.label} <span className="text-slate-500">{item.width}×{item.height}</span>
            </OptionButton>
          ))}
          <OptionButton active={resolution === 'custom'} onClick={() => setResolution('custom')}>
            Custom
          </OptionButton>
        </div>
        {resolution === 'custom' && (
          <div className="mt-3 flex items-center gap-2 text-sm">
            <input
              type="number"
              className={inputClass}
              min={1}
              max={MAX_WIDTH}
              value={width}
              onChange={(event) => setWidth(event.target.valueAsNumber)}
              aria-label="Width"
            />
            <span className="text-slate-500">×</span>
            <input
              type="number"
              className={inputClass}
              min={1}
              max={MAX_HEIGHT}
              value={height}
              onChange={(event) => setHeight(event.target.valueAsNumber)}
              aria-label="Height"
            />
            <span className="text-slate-500">
              max {MAX_WIDTH}×{MAX_HEIGHT}
            </span>
          </div>
        )}
      </fieldset>

      <fieldset>
        <legend className="mb-3 font-medium">Quality</legend>
        <div className="flex flex-wrap gap-2">
          {QUALITIES.map((item) => (
            <OptionButton key={item.spp} active={spp === item.spp} onClick={() => setSpp(item.spp)}>
              {item.label} <span className="text-slate-500">{item.spp} spp</span>
            </OptionButton>
          ))}
        </div>
      </fieldset>

      <div className="max-w-md">
        <ComplexityMeter value={complexity(width || 0, height || 0, spp)} />
      </div>

      <div className="space-y-3">
        {problems.map((problem) => (
          <p key={problem} className="text-sm text-red-400">
            {problem}
          </p>
        ))}
        {tooManyActive && (
          <p className="text-sm text-amber-400">
            You already have {activeCount} active renders, the limit is {MAX_ACTIVE_RENDERS}. Wait for one to finish
            or cancel it in{' '}
            <Link to="/history" className="underline">
              History
            </Link>
            .
          </p>
        )}
        {mutation.error && <p className="text-sm text-red-400">{mutation.error.message}</p>}

        <button
          type="submit"
          disabled={!canStart}
          className="rounded-md bg-accent-500 px-5 py-2.5 font-medium text-slate-950 transition hover:bg-accent-400 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {mutation.isPending ? 'Starting…' : 'Start render'}
        </button>
      </div>
    </form>
  )
}
