import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'

const SessionContext = createContext(null)

export function SessionProvider({ children }) {
  const { user } = useAuth()
  const [sessionId, setSessionId] = useState(null)

  useEffect(() => {
    if (user?.role === 'user') {
      // In real mode: POST /api/v1/session/start
      const sid = `SES-${Date.now()}`
      setSessionId(sid)
    } else {
      setSessionId(null)
    }
  }, [user])

  return (
    <SessionContext.Provider value={{ sessionId }}>
      {children}
    </SessionContext.Provider>
  )
}

export const useSession = () => useContext(SessionContext)