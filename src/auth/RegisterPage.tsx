import { Link } from 'react-router'
import AuthForm from './AuthForm.tsx'
import { useAuth } from './useAuth.ts'

export default function RegisterPage() {
  const { register } = useAuth()

  return (
    <AuthForm
      title="Create an account"
      submitLabel="Register"
      confirmPassword
      onSubmit={register}
      footer={
        <>
          Already registered?{' '}
          <Link to="/login" className="text-accent-400 hover:underline">
            Log in
          </Link>
        </>
      }
    />
  )
}
