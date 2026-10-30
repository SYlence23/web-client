import { useQuery } from '@tanstack/react-query'
import { apiFetch } from './client.ts'
import type { AdminRenderer, AdminTask } from './types.ts'

const REFRESH_MS = 2000

export function useAdminRenderers() {
  return useQuery({
    queryKey: ['admin', 'renderers'],
    queryFn: () => apiFetch<AdminRenderer[]>('/admin/renderers'),
    refetchInterval: REFRESH_MS,
  })
}

export function useAdminTasks() {
  return useQuery({
    queryKey: ['admin', 'tasks'],
    queryFn: () => apiFetch<AdminTask[]>('/admin/tasks'),
    refetchInterval: REFRESH_MS,
  })
}
