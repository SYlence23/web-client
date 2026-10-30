import { apiFetch } from './client.ts'
import type { RenderCreated, RenderRequest, RenderStatus } from './types.ts'

export const rendersKey = ['renders'] as const

export function listRenders(): Promise<RenderStatus[]> {
  return apiFetch<RenderStatus[]>('/renders')
}

export function createRender(request: RenderRequest): Promise<RenderCreated> {
  return apiFetch<RenderCreated>('/renders', { method: 'POST', body: request })
}
