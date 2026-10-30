export type TaskStatus = 'queued' | 'running' | 'done' | 'cancelled' | 'failed'

export interface Credentials {
  username: string
  password: string
}

export interface Token {
  accessToken: string
  tokenType: string
}

export interface User {
  id: number
  username: string
  isAdmin: boolean
}

export interface RenderRequest {
  scene: string
  width: number
  height: number
  spp: number
  maxDepth?: number
  seed?: number
}

export interface RenderCreated {
  id: string
  status: TaskStatus
  renderer: string | null
  queuePosition: number | null
  etaSeconds: number | null
}

export interface RenderStatus {
  id: string
  status: TaskStatus
  progress: number
  error: string | null
  renderer: string | null
  scene: string
  width: number
  height: number
  spp: number
  createdAt: string
  queuePosition: number | null
  etaSeconds: number | null
}

export interface AdminRenderer {
  name: string
  url: string
  up: boolean
  running: number
  capacity: number
  load: number
  lastSeen: string | null
}

export interface AdminTask {
  id: string
  username: string | null
  status: TaskStatus
  progress: number
  renderer: string | null
  scene: string
  width: number
  height: number
  spp: number
  createdAt: string
  startedAt: string | null
  queuePosition: number | null
  etaSeconds: number | null
}
