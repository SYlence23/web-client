export interface SessionUser {
  id: number
  username: string
  isAdmin: boolean
  expiresAt: number
}

interface TokenPayload {
  sub: string
  name: string
  admin: boolean
  exp: number
}

export function readToken(token: string): SessionUser | null {
  try {
    const part = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    const bytes = Uint8Array.from(atob(part), (char) => char.charCodeAt(0))
    const payload = JSON.parse(new TextDecoder().decode(bytes)) as TokenPayload
    const user = {
      id: Number(payload.sub),
      username: payload.name,
      isAdmin: payload.admin,
      expiresAt: payload.exp * 1000,
    }
    return user.expiresAt > Date.now() ? user : null
  } catch {
    return null
  }
}
