import { useMutation } from '@tanstack/react-query'
import { useState, type FormEvent, type ReactNode } from 'react'
import type { Credentials } from '../api/types.ts'

interface AuthFormProps {
  title: string
  submitLabel: string
  confirmPassword?: boolean
  onSubmit: (credentials: Credentials) => Promise<void>
  footer: ReactNode
}

const inputClass =
  'w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none transition focus:border-accent-500 focus:ring-2 focus:ring-accent-500/30'

export default function AuthForm({ title, submitLabel, confirmPassword, onSubmit, footer }: AuthFormProps) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')

  const mutation = useMutation({ mutationFn: onSubmit })

  const mismatch = confirmPassword && confirmation !== '' && confirmation !== password

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (mismatch) return
    mutation.mutate({ username, password })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h1 className="text-center text-lg font-medium">{title}</h1>

      <label className="block space-y-1">
        <span className="text-sm text-slate-400">Username</span>
        <input
          className={inputClass}
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          autoComplete="username"
          required
          minLength={3}
          maxLength={50}
          pattern="[A-Za-z0-9_.\-]+"
          title="Letters, digits, dots, dashes and underscores"
          autoFocus
        />
      </label>

      <label className="block space-y-1">
        <span className="text-sm text-slate-400">Password</span>
        <input
          className={inputClass}
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete={confirmPassword ? 'new-password' : 'current-password'}
          required
          minLength={6}
          maxLength={72}
        />
      </label>

      {confirmPassword && (
        <label className="block space-y-1">
          <span className="text-sm text-slate-400">Repeat password</span>
          <input
            className={inputClass}
            type="password"
            value={confirmation}
            onChange={(event) => setConfirmation(event.target.value)}
            autoComplete="new-password"
            required
          />
          {mismatch && <span className="text-xs text-red-400">Passwords do not match.</span>}
        </label>
      )}

      {mutation.error && (
        <p className="rounded-md border border-red-900 bg-red-950/50 px-3 py-2 text-sm text-red-300">
          {mutation.error.message}
        </p>
      )}

      <button
        type="submit"
        disabled={mutation.isPending}
        className="w-full rounded-md bg-accent-500 px-3 py-2 text-sm font-medium text-slate-950 transition hover:bg-accent-400 disabled:opacity-60"
      >
        {mutation.isPending ? 'Please wait…' : submitLabel}
      </button>

      <p className="text-center text-sm text-slate-400">{footer}</p>
    </form>
  )
}
