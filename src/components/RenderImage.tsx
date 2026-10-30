import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'
import { getRenderImage } from '../api/renders.ts'
import type { TaskStatus } from '../api/types.ts'

interface RenderImageProps {
  id: string
  status: TaskStatus
  width: number
  height: number
  refreshMs?: number
  download?: boolean
}

function saveBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  setTimeout(() => URL.revokeObjectURL(url))
}

export default function RenderImage({ id, status, width, height, refreshMs = 3000, download }: RenderImageProps) {
  const imgRef = useRef<HTMLImageElement>(null)
  const image = useQuery({
    queryKey: ['renders', id, 'image', status],
    queryFn: () => getRenderImage(id),
    enabled: status === 'running' || status === 'done',
    refetchInterval: status === 'running' ? refreshMs : false,
    staleTime: status === 'done' ? Infinity : 0,
    placeholderData: keepPreviousData,
  })
  const blob = image.data

  useEffect(() => {
    if (!blob || !imgRef.current) return
    const url = URL.createObjectURL(blob)
    imgRef.current.src = url
    return () => URL.revokeObjectURL(url)
  }, [blob])

  const placeholder =
    status === 'queued'
      ? 'Waiting for a free worker…'
      : status === 'running'
        ? 'Waiting for the first rows…'
        : status === 'done'
          ? 'Loading image…'
          : 'No image'

  return (
    <div className="space-y-3">
      <div
        className="flex items-center justify-center overflow-hidden rounded-lg border border-slate-800 bg-slate-900"
        style={{ aspectRatio: `${width} / ${height}` }}
      >
        {blob ? (
          <img ref={imgRef} alt="Render result" className="h-full w-full object-contain" />
        ) : (
          <span className="text-sm text-slate-500">{placeholder}</span>
        )}
      </div>
      {download && status === 'done' && blob && (
        <button
          type="button"
          onClick={() => saveBlob(blob, `render-${id.slice(0, 8)}.png`)}
          className="rounded-md bg-accent-500 px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-accent-400"
        >
          Download PNG
        </button>
      )}
    </div>
  )
}
