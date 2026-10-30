import type { TaskStatus } from './api/types.ts'

export const MAX_WIDTH = 1920
export const MAX_HEIGHT = 1080
export const MAX_SPP = 256
export const MAX_COMPLEXITY = 150_000_000
export const MAX_ACTIVE_RENDERS = 3

export const ACTIVE_STATUSES: TaskStatus[] = ['queued', 'running']

export function complexity(width: number, height: number, spp: number): number {
  return width * height * spp
}

export function renderProblems(width: number, height: number, spp: number): string[] {
  const problems: string[] = []
  if (!Number.isInteger(width) || !Number.isInteger(height) || width < 1 || height < 1) {
    problems.push('Width and height must be whole numbers above zero.')
  } else if (width > MAX_WIDTH || height > MAX_HEIGHT) {
    problems.push(`Resolution is limited to ${MAX_WIDTH}×${MAX_HEIGHT}.`)
  }
  if (spp > MAX_SPP) {
    problems.push(`Samples per pixel are limited to ${MAX_SPP}.`)
  }
  if (complexity(width, height, spp) > MAX_COMPLEXITY) {
    problems.push('Too heavy: lower the resolution or the quality.')
  }
  return problems
}
