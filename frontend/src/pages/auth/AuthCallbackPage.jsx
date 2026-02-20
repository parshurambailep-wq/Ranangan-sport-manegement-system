import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export default function AuthCallbackPage() {
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const token = params.get('token')
    if (token) {
      localStorage.setItem('access_token', token)
    }
    navigate('/', { replace: true })
  }, [location, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <p className="text-sm text-gray-400">Completing sign-in...</p>
    </div>
  )
}

