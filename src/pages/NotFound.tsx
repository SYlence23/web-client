import { Link } from 'react-router'

export default function NotFound() {
  return (
    <section className="py-16 text-center">
      <p className="text-6xl font-bold text-slate-700">404</p>
      <h1 className="mt-4 text-xl font-semibold">Page not found</h1>
      <Link to="/" className="mt-6 inline-block text-accent-400 hover:underline">
        Back to a new render
      </Link>
    </section>
  )
}
