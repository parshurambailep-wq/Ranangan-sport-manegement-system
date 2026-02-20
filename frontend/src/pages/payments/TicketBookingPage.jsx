import { useState } from 'react'
import api from '../../services/apiClient'
import { useAuth } from '../../context/AuthContext'

export default function TicketBookingPage() {
  const { user } = useAuth()
  const [eventId, setEventId] = useState('')
  const [amount, setAmount] = useState(0)
  const [upiTxnId, setUpiTxnId] = useState('')
  const [status, setStatus] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('')
    const res = await api.post('/payments', {
      user_id: user?.id,
      event_id: Number(eventId),
      amount: Number(amount),
      purpose: 'ticket_booking',
      upi_txn_id: upiTxnId,
    })
    setStatus(`Payment created with status: ${res.data.status}`)
  }

  return (
    <div className="min-h-screen bg-black text-white px-10 py-8 flex flex-col gap-6">
      <h1 className="text-3xl font-bold">Ticket Booking Payment</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-black/40 border border-white/5 rounded-2xl p-6 max-w-xl">
        <div>
          <label className="block text-sm mb-1">Event ID</label>
          <input
            type="number"
            value={eventId}
            onChange={(e) => setEventId(e.target.value)}
            className="w-full rounded-lg bg-black/40 border border-white/10 px-3 py-2 text-sm"
            required
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Amount (INR)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full rounded-lg bg-black/40 border border-white/10 px-3 py-2 text-sm"
            required
          />
        </div>
        <div>
          <label className="block text-sm mb-1">UPI Transaction ID</label>
          <input
            type="text"
            value={upiTxnId}
            onChange={(e) => setUpiTxnId(e.target.value)}
            className="w-full rounded-lg bg-black/40 border border-white/10 px-3 py-2 text-sm"
            required
          />
        </div>
        <button
          type="submit"
          className="mt-2 px-6 py-2 rounded-full bg-primary text-black font-semibold hover:opacity-90 transition"
        >
          Submit Payment
        </button>
        {status && <p className="mt-2 text-xs text-gray-300">{status}</p>}
      </form>
    </div>
  )
}

