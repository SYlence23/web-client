import { Link } from 'react-router'

export default function LoginPage() {
  return (
    <div className="space-y-4 text-center">
      <h1 className="text-lg font-medium">Log in</h1>
      <p className="text-sm text-slate-400">The login form will be here.</p>
      <p className="text-sm text-slate-400">
        No account?{' '}
        <Link to="/register" className="text-accent-400 hover:underline">
          Register
        </Link>
      </p>
    </div>
  )
}
