import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
export function AnalystGuard({ children }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (user.role === 'user') return <Navigate to="/banking" replace />
  return children
}