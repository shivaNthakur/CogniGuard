import { useState, useEffect } from 'react'
import { IS_DEMO } from '../config'
import { MOCK_ALERTS } from '../mock/mockData'

export function useAlerts() {
  const [alerts, setAlerts] = useState(MOCK_ALERTS)

  const resolveAlert = (id) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, resolved: true } : a))
  }

  return { alerts, resolveAlert }
}