import { Link } from 'react-router'
import AuthForm from './AuthForm.tsx'
import { useAuth } from './useAuth.ts'

export default function LoginPage() {
  const { login } = useAuth()

  return (
    <AuthForm
      title="Log in"
      submitLabel="Log in"
      onSubmit={login}
      footer={
        <>
          No account?{' '}
          <Link to="/register" className="text-accent-400 hover:underline">
            Register
          </Link>
        </>
      }
    />
  )
}
