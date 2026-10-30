export default function App() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-4xl font-bold tracking-tight">
        Ray <span className="text-accent-500">Tracer</span>
      </h1>
      <p className="text-slate-400">
        Distributed ray tracing over several workers behind a least-loaded balancer.
      </p>
    </main>
  )
}
