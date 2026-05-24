import { useState, useEffect } from 'react'
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react'

function randomScore(base) {
  return Math.min(100, Math.max(10, Math.round(base + (Math.random() - 0.45) * 8)))
}

export default function AgentCard({ agent, globalScore }) {
  const [score, setScore] = useState(Math.round(globalScore * (0.85 + Math.random() * 0.3)))
  const [pulseClass, setPulseClass] = useState('')

  useEffect(() => {
    const t = setInterval(() => {
      setScore(s => {
        const next = randomScore(s)
        setPulseClass('scale-105')
        setTimeout(() => setPulseClass(''), 200)
        return next
      })
    }, 1800 + Math.random() * 1000)
    return () => clearInterval(t)
  }, [])

  const statusIcon = score >= 70
    ? <CheckCircle className="w-4 h-4 text-safe" />
    : score >= 40
    ? <AlertTriangle className="w-4 h-4 text-warn" />
    : <XCircle className="w-4 h-4 text-danger" />

  const barColor = score >= 70 ? '#00FF88' : score >= 40 ? '#FF9F00' : '#FF3366'

  return (
    <div className={`p-4 rounded-xl border ${agent.borderColor} ${agent.bgColor} backdrop-blur-sm transition-all duration-300 hover:shadow-panel group`}>
   
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className={`w-8 h-8 rounded-lg ${agent.bgColor} border ${agent.borderColor} flex items-center justify-center`}>
              <span className={`font-mono text-[10px] font-700 ${agent.textColor}`}>{agent.shortName}</span>
            </div>
           
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full" style={{ backgroundColor: agent.color, boxShadow: `0 0 6px ${agent.color}` }} />
          </div>
          <div>
            <div className={`text-xs font-display font-600 ${agent.textColor}`}>{agent.name}</div>
            <div className="text-[10px] text-text-dim leading-tight max-w-[140px]">{agent.desc}</div>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {statusIcon}
          <span className={`font-mono text-lg font-700 transition-transform duration-200 ${pulseClass}`} style={{ color: barColor }}>
            {score}
          </span>
        </div>
      </div>

      
      <div className="h-1.5 bg-muted/50 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${score}%`, backgroundColor: barColor, boxShadow: `0 0 8px ${barColor}60` }}
        />
      </div>
    </div>
  )
}
