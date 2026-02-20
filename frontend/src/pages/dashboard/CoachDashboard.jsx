import { useEffect, useState } from 'react'
import api from '../../services/apiClient'

export default function CoachDashboard() {
  const [matches, setMatches] = useState([])

  useEffect(() => {
    api
      .get('/dashboard/coach')
      .then((res) => setMatches(res.data))
      .catch(() => setMatches([]))
  }, [])

  return (
    <div className="min-h-screen bg-black text-white px-10 py-8">
      <h1 className="text-3xl font-bold mb-6">Coach Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2">
        {matches.map((m) => (
          <div key={m.id} className="bg-black/40 border border-white/5 rounded-xl p-4">
            <h2 className="font-semibold">{m.name}</h2>
            <p className="text-xs text-gray-400 mt-1">Match ID: {m.id}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

