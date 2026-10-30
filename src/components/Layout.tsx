import { Link, NavLink, Outlet } from 'react-router'
import { useAuth } from '../auth/useAuth.ts'

const links = [
  { to: '/', label: 'New render', end: true, admin: false },
  { to: '/history', label: 'History', end: false, admin: false },
  { to: '/admin', label: 'Admin', end: false, admin: true },
]

export default function Layout() {
  const { user, logout } = useAuth()
  const visibleLinks = links.filter((link) => !link.admin || user?.isAdmin)

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-5xl items-center gap-8 px-4">
          <Link to="/" className="flex items-center gap-2 font-semibold tracking-tight">
            <img src="/favicon.svg" alt="" className="size-6" />
            Ray <span className="-ml-1 text-accent-500">Tracer</span>
          </Link>
          <nav className="flex gap-1 text-sm">
            {visibleLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `rounded-md px-3 py-1.5 transition-colors ${
                    isActive ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-3 text-sm">
            <span className="text-slate-400">
              {user?.username}
              {user?.isAdmin && <span className="ml-2 rounded bg-accent-500/15 px-1.5 py-0.5 text-xs text-accent-400">admin</span>}
            </span>
            <button
              type="button"
              onClick={logout}
              className="rounded-md border border-slate-700 px-3 py-1.5 text-slate-300 transition hover:border-slate-500 hover:text-white"
            >
              Log out
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}
