import { useState, useEffect } from 'react'
import { IS_DEMO, WS_BASE } from '../config'
import { MOCK_SESSIONS } from '../mock/mockData'

export function useAllSessions() {
  const [sessions, setSessions] = useState(MOCK_SESSIONS)

  useEffect(() => {
    if (IS_DEMO) {
      // Slightly animate scores in demo mode
      const iv = setInterval(() => {
        setSessions(prev => prev.map(s => ({
          ...s,
          score: Math.max(0, Math.min(100, s.score + (Math.random() - 0.5) * 2))
        })))
      }, 3000)
      return () => clearInterval(iv)
    }
    const ws = new WebSocket(`${WS_BASE}/api/v1/ws/analyst`)
    ws.onmessage = (e) => {
      const d = JSON.parse(e.data)
      if (d.type === 'session_update') setSessions(d.sessions)
    }
    return () => ws.close()
  }, [])

  return { sessions, setSessions }
}