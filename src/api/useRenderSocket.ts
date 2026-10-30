import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { API_PREFIX } from './client.ts'
import { renderKey } from './renders.ts'
import { getToken } from './token.ts'
import type { RenderStatus } from './types.ts'

const RECONNECT_MS = 3000

function socketUrl(id: string, token: string): string {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
  const query = new URLSearchParams({ token })
  return `${protocol}//${window.location.host}${API_PREFIX}/ws/renders/${id}?${query}`
}

export function useRenderSocket(id: string, enabled: boolean): boolean {
  const queryClient = useQueryClient()
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    const token = getToken()
    if (!enabled || !token) return

    let socket: WebSocket
    let retry: ReturnType<typeof setTimeout> | undefined
    let disposed = false

    const connect = () => {
      socket = new WebSocket(socketUrl(id, token))
      socket.onopen = () => setConnected(true)
      socket.onmessage = (event) => {
        const status = JSON.parse(event.data) as RenderStatus
        queryClient.setQueryData(renderKey(id), status)
      }
      socket.onclose = () => {
        setConnected(false)
        if (!disposed) retry = setTimeout(connect, RECONNECT_MS)
      }
    }

    connect()

    return () => {
      disposed = true
      clearTimeout(retry)
      socket.close()
    }
  }, [id, enabled, queryClient])

  return connected
}
