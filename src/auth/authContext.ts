import { createContext } from 'react'
import type { Credentials } from '../api/types.ts'
import type { SessionUser } from './jwt.ts'

export interface AuthState {
  user: SessionUser | null
  login: (credentials: Credentials) => Promise<void>
  register: (credentials: Credentials) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthState | null>(null)
