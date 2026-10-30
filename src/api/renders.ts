import { useQuery } from '@tanstack/react-query'
import { isActive } from '../limits.ts'
import { apiBlob, apiFetch } from './client.ts'
import type { RenderCreated, RenderRequest, RenderStatus } from './types.ts'

export const rendersKey = ['renders'] as const

export function useRenders() {
  return useQuery({
    queryKey: rendersKey,
    queryFn: listRenders,
    refetchInterval: (query) => (query.state.data?.some((render) => isActive(render.status)) ? 3000 : false),
  })
}

export function renderKey(id: string) {
  return ['renders', id] as const
}

export function listRenders(): Promise<RenderStatus[]> {
  return apiFetch<RenderStatus[]>('/renders')
}

export function getRender(id: string): Promise<RenderStatus> {
  return apiFetch<RenderStatus>(`/renders/${id}`)
}

export function createRender(request: RenderRequest): Promise<RenderCreated> {
  return apiFetch<RenderCreated>('/renders', { method: 'POST', body: request })
}

export function cancelRender(id: string): Promise<void> {
  return apiFetch<void>(`/renders/${id}`, { method: 'DELETE' })
}

export function getRenderImage(id: string): Promise<Blob> {
  return apiBlob(`/renders/${id}/image`)
}
