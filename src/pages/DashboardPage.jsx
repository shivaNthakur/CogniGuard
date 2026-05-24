import { useState, useEffect, useCallback } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'
import { Activity, Shield, TrendingUp, Users, AlertTriangle, Lock } from 'lucide-react'
import TrustScoreRing from '../components/TrustScoreRing'
import AgentCard from '../components/AgentCard'
import { AGENTS, RECENT_ALERTS, ACTIVE_SESSIONS, generateTrustHistory } from '../data/mockData'

const KPI = [
  { label: 'Active Sessions', value: '12,847', delta: '+3.2%', icon: Users, color: 'text-trust' },
  { label: 'Threats Blocked', value: '234', delta: 'today', icon: Shield, color: 'text-danger' },
  { label: 'Avg Trust Score', value: '81.4', delta: '↑ 2.1', icon: TrendingUp, color: 'text-safe' },
  { label: 'OTPs Replaced', value: '98.6%', delta: 'sessions', icon: Lock, color: 'text-warn' },
]

const CustomTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    const v = payload[0].value
    const c = v >= 80 ? '#00FF88' : v >= 60 ? '#FF9F00' : '#FF3366'
    return (
      <div className="bg-panel border border-border rounded-lg px-3 py-2 text-xs font-mono">
        <span style={{ color: c }}>Score: {v}</span>
      </div>
    )
  }
  return null
}

export default function DashboardPage({ navigate }) {
  const [trustScore, setTrustScore] = useState(82)
  const [history, setHistory] = useState(generateTrustHistory)
  const [sessions] = useState(ACTIVE_SESSIONS)

  useEffect(() => {
    const t = setInterval(() => {
      setTrustScore(s => {
        const next = Math.min(99, Math.max(20, Math.round(s + (Math.random() - 0.45) * 4)))
        setHistory(h => {
          const newPoint = {
            t: new Date().toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            score: next,
          }
          return [...h.slice(-29), newPoint]
        })
        return next
      })
    }, 1500)
    return () => clearInterval(t)
  }, [])

  const scoreColor = trustScore >= 80 ? '#00FF88' : trustScore >= 60 ? '#FF9F00' : '#FF3366'

  return (
    <div className="pt-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-2xl font-700 text-text-primary">Security Dashboard</h1>
            <p className="text-text-secondary text-sm mt-0.5">Real-time behavioral authentication overview</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl border border-safe/20 bg-safe/5">
            <Activity className="w-4 h-4 text-safe animate-pulse-slow" />
            <span className="font-mono text-sm text-safe">LIVE</span>
          </div>
        </div>

    
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {KPI.map(({ label, value, delta, icon: Icon, color }) => (
            <div key={label} className="p-5 rounded-2xl border border-border bg-panel/60 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-text-secondary">{label}</span>
                <Icon className={`w-4 h-4 ${color}`} />
              </div>
              <div className="font-display text-2xl font-700 text-text-primary">{value}</div>
              <div className="text-xs text-text-dim mt-1">{delta}</div>
            </div>
          ))}
        </div>

  
        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          <div className="p-6 rounded-2xl border border-border bg-panel/60 backdrop-blur-sm flex flex-col items-center gap-6">
            <div className="text-center">
              <h2 className="font-display font-600 text-text-primary mb-0.5">System Trust Score</h2>
              <p className="text-xs text-text-dim">Aggregated from all 5 agents</p>
            </div>
            <TrustScoreRing score={trustScore} size={180} />
            <div className="w-full grid grid-cols-3 gap-2 text-center text-xs font-mono">
              <div className="p-2 rounded-lg bg-safe/5 border border-safe/10">
                <div className="text-safe font-600">SECURE</div>
                <div className="text-text-dim">80–100</div>
              </div>
              <div className="p-2 rounded-lg bg-warn/5 border border-warn/10">
                <div className="text-warn font-600">CAUTION</div>
                <div className="text-text-dim">60–79</div>
              </div>
              <div className="p-2 rounded-lg bg-danger/5 border border-danger/10">
                <div className="text-danger font-600">CRITICAL</div>
                <div className="text-text-dim">0–59</div>
              </div>
            </div>
          </div>

        
          <div className="lg:col-span-2 p-6 rounded-2xl border border-border bg-panel/60 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-display font-600 text-text-primary">Trust Score History</h2>
                <p className="text-xs text-text-dim">Last 30 data points — live</p>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-trust animate-pulse" />
                <span className="font-mono text-xs" style={{ color: scoreColor }}>{trustScore}</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={history} margin={{ top: 5, right: 5, left: -30, bottom: 0 }}>
                <defs>
                  <linearGradient id="trustGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00E5FF" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#00E5FF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="t" tick={{ fill: '#3A5A72', fontSize: 9, fontFamily: 'JetBrains Mono' }} tickLine={false} axisLine={false} interval={9} />
                <YAxis domain={[0, 100]} tick={{ fill: '#3A5A72', fontSize: 9, fontFamily: 'JetBrains Mono' }} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="score" stroke="#00E5FF" strokeWidth={2} fill="url(#trustGrad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
       
          <div className="p-6 rounded-2xl border border-border bg-panel/60 backdrop-blur-sm">
            <h2 className="font-display font-600 text-text-primary mb-4">AI Security Agents</h2>
            <div className="flex flex-col gap-3">
              {AGENTS.map(agent => (
                <AgentCard key={agent.id} agent={agent} globalScore={trustScore} />
              ))}
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-border bg-panel/60 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-600 text-text-primary">Active Sessions</h2>
              <button onClick={() => navigate('monitor')} className="text-xs text-trust hover:underline font-mono">View All →</button>
            </div>
            <div className="flex flex-col gap-3">
              {sessions.map(s => {
                const c = s.status === 'secure' ? { text: 'text-safe', bg: 'bg-safe/10 border-safe/20', dot: '#00FF88' }
                  : s.status === 'caution' ? { text: 'text-warn', bg: 'bg-warn/10 border-warn/20', dot: '#FF9F00' }
                  : { text: 'text-danger', bg: 'bg-danger/10 border-danger/20', dot: '#FF3366' }
                return (
                  <div key={s.id} className="flex items-center justify-between py-2.5 border-b border-border last:border-0">
                    <div className="flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: c.dot, boxShadow: `0 0 6px ${c.dot}` }} />
                      <div>
                        <div className="font-mono text-xs text-text-primary">{s.id}</div>
                        <div className="text-[10px] text-text-dim">{s.channel} · {s.location}</div>
                      </div>
                    </div>
                    <div className={`px-2 py-0.5 rounded-full border text-[10px] font-mono font-600 ${c.bg} ${c.text}`}>
                      {s.score}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-border bg-panel/60 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-600 text-text-primary">Recent Alerts</h2>
              <button onClick={() => navigate('alerts')} className="text-xs text-trust hover:underline font-mono">View All →</button>
            </div>
            <div className="flex flex-col gap-3">
              {RECENT_ALERTS.map(a => {
                const c = a.type === 'safe' ? { dot: '#00FF88', text: 'text-safe', bg: 'bg-safe/5' }
                  : a.type === 'warn' ? { dot: '#FF9F00', text: 'text-warn', bg: 'bg-warn/5' }
                  : { dot: '#FF3366', text: 'text-danger', bg: 'bg-danger/5' }
                return (
                  <div key={a.id} className={`flex gap-3 p-3 rounded-xl ${c.bg} border border-white/5`}>
                    <span className="w-2 h-2 rounded-full flex-shrink-0 mt-1" style={{ backgroundColor: c.dot }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-text-primary leading-snug">{a.msg}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[10px] font-mono ${c.text}`}>{a.agent}</span>
                        <span className="text-[10px] text-text-dim">{a.time}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
