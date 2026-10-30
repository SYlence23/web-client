import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuth } from './useAuth.ts'

export default function AuthLayout() {
  const { user } = useAuth()
  const location = useLocation()

  if (user) return <Navigate to={location.state?.from ?? '/'} replace />

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
        <div className="mb-6 flex items-center justify-center gap-2 text-xl font-semibold tracking-tight">
          <img src="/favicon.svg" alt="" className="size-7" />
          Ray <span className="-ml-1 text-accent-500">Tracer</span>
        </div>
        <Outlet />
      </div>
    </main>
  )
}
