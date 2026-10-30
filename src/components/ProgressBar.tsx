export default function ProgressBar({ value }: { value: number }) {
  const percent = Math.max(0, Math.min(100, value))

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-sm">
        <span className="text-slate-400">Progress</span>
        <span className="tabular-nums text-slate-300">{percent.toFixed(1)}%</span>
      </div>
      <div
        className="h-2.5 overflow-hidden rounded-full bg-slate-800"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
      >
        <div className="h-full rounded-full bg-accent-500 transition-[width] duration-500" style={{ width: `${percent}%` }} />
      </div>
    </div>
  )
}
