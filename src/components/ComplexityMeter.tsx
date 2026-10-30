import { MAX_COMPLEXITY } from '../limits.ts'

const numberFormat = new Intl.NumberFormat('en-US')

export default function ComplexityMeter({ value }: { value: number }) {
  const ratio = value / MAX_COMPLEXITY
  const over = ratio > 1
  const color = over ? 'bg-red-500' : ratio > 0.75 ? 'bg-amber-400' : 'bg-emerald-500'

  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between text-sm">
        <span className="text-slate-400">Complexity</span>
        <span className={over ? 'font-medium text-red-400' : 'text-slate-300'}>
          {numberFormat.format(value)} / {numberFormat.format(MAX_COMPLEXITY)}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-800">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${Math.min(ratio, 1) * 100}%` }} />
      </div>
      <p className="text-xs text-slate-500">width × height × samples per pixel</p>
    </div>
  )
}
