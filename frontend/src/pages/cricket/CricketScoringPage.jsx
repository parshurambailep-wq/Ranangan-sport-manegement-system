import { useEffect, useState } from 'react'
import api from '../../services/apiClient'

export default function CricketScoringPage() {
  const [matchId, setMatchId] = useState('')
  const [over, setOver] = useState(1)
  const [ball, setBall] = useState(1)
  const [runs, setRuns] = useState(0)
  const [isWicket, setIsWicket] = useState(false)
  const [extrasType, setExtrasType] = useState('')
  const [summary, setSummary] = useState(null)

  const submitBall = async (e) => {
    e.preventDefault()
    await api.post('/cricket/ball', {
      match_id: Number(matchId),
      over_number: Number(over),
      ball_number: Number(ball),
      runs: Number(runs),
      is_wicket: isWicket,
      extras_type: extrasType || null,
    })
    loadSummary()
  }

  const loadSummary = async () => {
    if (!matchId) return
    const res = await api.get(`/cricket/summary/${matchId}`)
    setSummary(res.data)
  }

  useEffect(() => {
    if (matchId) loadSummary()
  }, [matchId])

  return (
    <div className="min-h-screen bg-black text-white px-10 py-8 space-y-8">
      <h1 className="text-3xl font-bold mb-4">Cricket Ball-by-Ball Scoring</h1>

      <form onSubmit={submitBall} className="grid gap-4 md:grid-cols-5 bg-black/40 border border-white/5 p-4 rounded-2xl">
        <input
          type="number"
          placeholder="Match ID"
          value={matchId}
          onChange={(e) => setMatchId(e.target.value)}
          className="rounded-lg bg-black/40 border border-white/10 px-3 py-2 text-sm"
          required
        />
        <input
          type="number"
          min={1}
          placeholder="Over"
          value={over}
          onChange={(e) => setOver(e.target.value)}
          className="rounded-lg bg-black/40 border border-white/10 px-3 py-2 text-sm"
          required
        />
        <input
          type="number"
          min={1}
          max={6}
          placeholder="Ball"
          value={ball}
          onChange={(e) => setBall(e.target.value)}
          className="rounded-lg bg-black/40 border border-white/10 px-3 py-2 text-sm"
          required
        />
        <input
          type="number"
          min={0}
          max={6}
          placeholder="Runs"
          value={runs}
          onChange={(e) => setRuns(e.target.value)}
          className="rounded-lg bg-black/40 border border-white/10 px-3 py-2 text-sm"
        />
        <select
          value={extrasType}
          onChange={(e) => setExtrasType(e.target.value)}
          className="rounded-lg bg-black/40 border border-white/10 px-3 py-2 text-sm"
        >
          <option value="">No extras</option>
          <option value="wide">Wide</option>
          <option value="no-ball">No Ball</option>
          <option value="bye">Bye</option>
          <option value="leg-bye">Leg Bye</option>
        </select>
        <label className="flex items-center gap-2 text-xs md:col-span-2">
          <input
            type="checkbox"
            checked={isWicket}
            onChange={(e) => setIsWicket(e.target.checked)}
            className="rounded border-white/20 bg-black/40"
          />
          Wicket
        </label>
        <button
          type="submit"
          className="md:col-span-2 py-2 rounded-lg bg-primary text-black font-semibold hover:opacity-90 transition"
        >
          Save Ball
        </button>
      </form>

      {summary && (
        <div className="bg-black/40 border border-white/5 rounded-2xl p-4">
          <h2 className="text-xl font-semibold mb-2">
            Match #{summary.match_id} — {summary.total_runs}/{summary.total_wickets}
          </h2>
          <div className="space-y-2 text-sm">
            {Object.entries(summary.overs).map(([overNo, balls]) => (
              <div key={overNo}>
                <p className="font-semibold mb-1">Over {overNo}</p>
                <div className="flex flex-wrap gap-2">
                  {balls.map((b) => (
                    <span
                      key={b.ball}
                      className="px-2 py-1 rounded-full bg-white/10 border border-white/10 text-xs"
                    >
                      {b.ball}:{' '}
                      {b.is_wicket ? 'W' : b.runs}
                      {b.extras_type ? ` (${b.extras_type})` : ''}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

