import { useEffect, useState } from 'react'
import api from '../../services/apiClient'

export default function VendorDashboard() {
  const [revenue, setRevenue] = useState(0)

  useEffect(() => {
    api
      .get('/dashboard/vendor')
      .then((res) => setRevenue(res.data.vendor_revenue || 0))
      .catch(() => setRevenue(0))
  }, [])

  return (
    <div className="min-h-screen bg-black text-white px-10 py-8">
      <h1 className="text-3xl font-bold mb-6">Vendor Dashboard</h1>
      <div className="bg-black/40 border border-white/5 rounded-2xl p-6 max-w-md">
        <p className="text-sm text-gray-400 mb-2">Total verified sales</p>
        <p className="text-4xl font-bold text-primary">₹{revenue.toFixed(2)}</p>
      </div>
    </div>
  )
}

