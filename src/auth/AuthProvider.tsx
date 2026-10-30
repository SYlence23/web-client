import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { apiFetch } from '../api/client.ts'
import { clearToken, getToken, setToken } from '../api/token.ts'
import type { Credentials, Token } from '../api/types.ts'
import { AuthContext } from './authContext.ts'
import { readToken } from './jwt.ts'

function initialToken(): string | null {
  const token = getToken()
  if (token && readToken(token)) return token
  clearToken()
  return null
}

export default function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()
  const [token, setTokenState] = useState(initialToken)
  const user = useMemo(() => (token ? readToken(token) : null), [token])

  const login = useCallback(async (credentials: Credentials) => {
    const { accessToken } = await apiFetch<Token>('/auth/login', { method: 'POST', body: credentials })
    setToken(accessToken)
    setTokenState(accessToken)
  }, [])

  const register = useCallback(
    async (credentials: Credentials) => {
      await apiFetch('/auth/register', { method: 'POST', body: credentials })
      await login(credentials)
    },
    [login],
  )

  const logout = useCallback(() => {
    clearToken()
    setTokenState(null)
    queryClient.clear()
  }, [queryClient])

  const value = useMemo(() => ({ user, login, register, logout }), [user, login, register, logout])

  return <AuthContext value={value}>{children}</AuthContext>
}
