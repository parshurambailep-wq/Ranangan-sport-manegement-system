import { useEffect, useState } from 'react'
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js'
import { Bar } from 'react-chartjs-2'
import api from '../../services/apiClient'

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend)

export default function AdminDashboard() {
  const [data, setData] = useState(null)
  const [approvals, setApprovals] = useState({ players: [], coaches: [], vendors: [] })
  const [payments, setPayments] = useState([])

  useEffect(() => {
    api
      .get('/dashboard/admin')
      .then((res) => setData(res.data))
      .catch(() => setData({ revenue_per_event: [], ticket_sales: [] }))
    api
      .get('/users/pending-approvals')
      .then((res) => setApprovals(res.data))
      .catch(() => setApprovals({ players: [], coaches: [], vendors: [] }))
    api
      .get('/payments/pending')
      .then((res) => setPayments(res.data))
      .catch(() => setPayments([]))
  }, [])

  if (!data) return null

  const revenueLabels = data.revenue_per_event.map((r) => `Event ${r.event_id || 'N/A'}`)
  const revenueValues = data.revenue_per_event.map((r) => r.revenue)

  const ticketsLabels = data.ticket_sales.map((t) => `Event ${t.event_id || 'N/A'}`)
  const ticketsValues = data.ticket_sales.map((t) => t.tickets)

  return (
    <div className="min-h-screen bg-black text-white px-10 py-8 space-y-8">
      <header className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
      </header>

      <div className="grid gap-8 md:grid-cols-2 mb-8">
        <div className="bg-black/40 rounded-2xl p-6 border border-white/5">
          <h2 className="mb-4 text-lg font-semibold">Revenue per Event</h2>
          <Bar
            data={{
              labels: revenueLabels,
              datasets: [
                {
                  label: 'Revenue (INR)',
                  data: revenueValues,
                  backgroundColor: '#00f5a0',
                },
              ],
            }}
          />
        </div>

        <div className="bg-black/40 rounded-2xl p-6 border border-white/5">
          <h2 className="mb-4 text-lg font-semibold">Ticket Sales</h2>
          <Bar
            data={{
              labels: ticketsLabels,
              datasets: [
                {
                  label: 'Tickets',
                  data: ticketsValues,
                  backgroundColor: '#00d9f5',
                },
              ],
            }}
          />
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="bg-black/40 rounded-2xl p-6 border border-white/5">
          <h2 className="mb-3 text-lg font-semibold">Pending Approvals</h2>
          <div className="space-y-2 text-sm">
            {approvals.players.map((p) => (
              <div key={`player-${p.id}`} className="flex items-center justify-between">
                <span>Player #{p.id} – Sport: {p.sport}</span>
                <button
                  onClick={async () => {
                    await api.post('/users/approve', { type: 'player', id: p.id })
                    setApprovals((prev) => ({
                      ...prev,
                      players: prev.players.filter((x) => x.id !== p.id),
                    }))
                  }}
                  className="px-3 py-1 rounded-full bg-primary text-black text-xs font-semibold"
                >
                  Approve
                </button>
              </div>
            ))}
            {approvals.coaches.map((c) => (
              <div key={`coach-${c.id}`} className="flex items-center justify-between">
                <span>Coach #{c.id} – Sport: {c.sport}</span>
                <button
                  onClick={async () => {
                    await api.post('/users/approve', { type: 'coach', id: c.id })
                    setApprovals((prev) => ({
                      ...prev,
                      coaches: prev.coaches.filter((x) => x.id !== c.id),
                    }))
                  }}
                  className="px-3 py-1 rounded-full bg-primary text-black text-xs font-semibold"
                >
                  Approve
                </button>
              </div>
            ))}
            {approvals.vendors.map((v) => (
              <div key={`vendor-${v.id}`} className="flex items-center justify-between">
                <span>Vendor #{v.id} – {v.business_name}</span>
                <button
                  onClick={async () => {
                    await api.post('/users/approve', { type: 'vendor', id: v.id })
                    setApprovals((prev) => ({
                      ...prev,
                      vendors: prev.vendors.filter((x) => x.id !== v.id),
                    }))
                  }}
                  className="px-3 py-1 rounded-full bg-primary text-black text-xs font-semibold"
                >
                  Approve
                </button>
              </div>
            ))}
            {!approvals.players.length &&
              !approvals.coaches.length &&
              !approvals.vendors.length && <p className="text-xs text-gray-400">No pending approvals.</p>}
          </div>
        </div>

        <div className="bg-black/40 rounded-2xl p-6 border border-white/5">
          <h2 className="mb-3 text-lg font-semibold">Pending Payments</h2>
          <div className="space-y-2 text-sm">
            {payments.map((p) => (
              <div key={p.id} className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">
                    ₹{p.amount} – {p.purpose}
                  </p>
                  <p className="text-xs text-gray-400">UPI: {p.upi_txn_id}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={async () => {
                      await api.post(`/payments/verify/${p.id}`, { action: 'verify' })
                      setPayments((prev) => prev.filter((x) => x.id !== p.id))
                    }}
                    className="px-3 py-1 rounded-full bg-primary text-black text-xs font-semibold"
                  >
                    Verify
                  </button>
                  <button
                    onClick={async () => {
                      await api.post(`/payments/verify/${p.id}`, { action: 'reject' })
                      setPayments((prev) => prev.filter((x) => x.id !== p.id))
                    }}
                    className="px-3 py-1 rounded-full bg-red-500 text-black text-xs font-semibold"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
            {!payments.length && <p className="text-xs text-gray-400">No pending payments.</p>}
          </div>
        </div>
      </div>
    </div>
  )
}

