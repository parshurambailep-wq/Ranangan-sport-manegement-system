import { useEffect, useState } from 'react'
import api from '../../services/apiClient'

export default function KabaddiTimerPage() {
  const [timerId, setTimerId] = useState(null)
  const [remaining, setRemaining] = useState(0)

  const startRaid = async () => {
    const res = await api.post('/timers', {
      type: 'kabaddi_raid',
      duration_seconds: 30,
    })
    setTimerId(res.data.id)
  }

  useEffect(() => {
    if (!timerId) return
    const interval = setInterval(async () => {
      const res = await api.get(`/timers/status/${timerId}`)
      setRemaining(res.data.remaining_seconds)
    }, 1000)
    return () => clearInterval(interval)
  }, [timerId])

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-6">
      <h1 className="text-3xl font-bold">Kabaddi Raid Timer</h1>
      <button
        onClick={startRaid}
        className="px-6 py-3 rounded-full bg-primary text-black font-semibold hover:opacity-90 transition"
      >
        Start 30s Raid
      </button>
      {timerId && (
        <p className="text-6xl font-black tracking-widest">{remaining}</p>
      )}
    </div>
  )
}

