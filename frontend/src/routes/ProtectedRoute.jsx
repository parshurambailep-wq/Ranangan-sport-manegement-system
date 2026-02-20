import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function ProtectedRoute({ roles }) {
  const { user, loading } = useAuth()
  if (loading) return null
  if (!user) return <Navigate to="/auth/login" replace />

  if (roles && roles.length > 0) {
    const userRoles = user.roles || user.claims?.roles || []
    const allowed = roles.some((r) => userRoles.includes(r))
    if (!allowed) return <Navigate to="/" replace />
  }

  return <Outlet />
}

