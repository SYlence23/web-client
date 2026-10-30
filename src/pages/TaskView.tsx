import { useParams } from 'react-router'

export default function TaskView() {
  const { id } = useParams()

  return (
    <section>
      <h1 className="text-2xl font-semibold">Render</h1>
      <p className="mt-2 font-mono text-sm text-slate-400">{id}</p>
    </section>
  )
}
