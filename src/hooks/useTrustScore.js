import { useState, useEffect } from 'react'
import { IS_DEMO, WS_BASE } from '../config'
import { MOCK_TRUST_HISTORY, MOCK_AGENT_SCORES } from '../mock/mockData'

const getAction = (s) => s >= 80 ? 'ALLOW' : s >= 60 ? 'SOFT_OTP' : s >= 40 ? 'BIOMETRIC' : 'FREEZE'

export function useTrustScore(sessionId) {
  const [score, setScore]     = useState(85)
  const [action, setAction]   = useState('ALLOW')
  const [agents, setAgents]   = useState(MOCK_AGENT_SCORES)
  const [history, setHistory] = useState(MOCK_TRUST_HISTORY)
  const [explain, setExplain] = useState([])
  const [frozen, setFrozen]   = useState(false)

  useEffect(() => {
    if (IS_DEMO) {
      const iv = setInterval(() => {
        setScore(prev => {
          const next = Math.max(0, Math.min(100, prev + (Math.random() - 0.5) * 3))
          setAction(getAction(next))
          setFrozen(next < 40)
          setHistory(h => [...h.slice(-29), { time: new Date().toLocaleTimeString(), score: next }])
          return Math.round(next)
        })
      }, 2500)
      return () => clearInterval(iv)
    }
    const ws = new WebSocket(`${WS_BASE}/api/v1/ws/${sessionId}`)
    ws.onmessage = (e) => {
      const d = JSON.parse(e.data)
      setScore(d.trust_score)
      setAction(d.action)
      setAgents(d.agent_scores || {})
      setExplain(d.explanation || [])
      setFrozen(d.trust_score < 40)
      setHistory(h => [...h.slice(-29), { time: new Date().toLocaleTimeString(), score: d.trust_score }])
    }
    return () => ws.close()
  }, [sessionId])

  return { score, action, agents, history, explain, frozen, setScore, setAction, setExplain }
}