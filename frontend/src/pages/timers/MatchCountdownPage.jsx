import { useEffect, useState } from 'react'
import api from '../../services/apiClient'

export default function MatchCountdownPage() {
  const [timerId, setTimerId] = useState(null)
  const [duration, setDuration] = useState(600)
  const [remaining, setRemaining] = useState(0)

  const startCountdown = async (e) => {
    e.preventDefault()
    const res = await api.post('/timers', {
      type: 'match_countdown',
      duration_seconds: Number(duration),
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

  const minutes = Math.floor(remaining / 60)
  const seconds = remaining % 60

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-6">
      <h1 className="text-3xl font-bold">Match Countdown</h1>
      <form onSubmit={startCountdown} className="flex gap-3 items-center">
        <input
          type="number"
          min={60}
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          className="rounded-lg bg-black/40 border border-white/10 px-3 py-2 text-sm"
        />
        <button
          type="submit"
          className="px-6 py-2 rounded-full bg-primary text-black font-semibold hover:opacity-90 transition"
        >
          Start
        </button>
      </form>
      {timerId && (
        <p className="text-5xl font-black tracking-widest">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </p>
      )}
    </div>
  )
}

