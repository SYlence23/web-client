import { Link } from 'react-router'

export default function RegisterPage() {
  return (
    <div className="space-y-4 text-center">
      <h1 className="text-lg font-medium">Create an account</h1>
      <p className="text-sm text-slate-400">The registration form will be here.</p>
      <p className="text-sm text-slate-400">
        Already registered?{' '}
        <Link to="/login" className="text-accent-400 hover:underline">
          Log in
        </Link>
      </p>
    </div>
  )
}
