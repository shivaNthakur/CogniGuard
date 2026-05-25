import { useState, useEffect } from 'react'
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts'
import { Wifi, Smartphone, Globe, MapPin, Clock, Shield, AlertTriangle, CheckCircle, XCircle, Activity } from 'lucide-react'
import TrustScoreRing from '../components/TrustScoreRing'

const SESSION_IDS = ['USR-4421', 'USR-8832', 'USR-1190', 'USR-3374', 'USR-6610']
const CHANNELS = ['Mobile Banking', 'Web Banking', 'UPI/NPCI', 'Other Digital Channel']
const LOCATIONS = ['Mumbai, MH', 'New Delhi, DL', 'Pune, MH', 'Bangalore, KA', 'Chennai, TN']

function makeRadarData(base) {
  return [
    { axis: 'Identity', value: Math.round(base * (0.8 + Math.random() * 0.4)) },
    { axis: 'Cognitive', value: Math.round(base * (0.7 + Math.random() * 0.5)) },
    { axis: 'Financial', value: Math.round(base * (0.75 + Math.random() * 0.4)) },
    { axis: 'Threat', value: Math.round(base * (0.85 + Math.random() * 0.3)) },
    { axis: 'Emotional', value: Math.round(base * (0.6 + Math.random() * 0.6)) },
  ].map(d => ({ ...d, value: Math.min(100, Math.max(5, d.value)) }))
}

const EVENT_LOG = [
  { t: '14:32:11', event: 'Session started — Mobile SDK authenticated', type: 'info' },
  { t: '14:32:18', event: 'Behavioral baseline loaded — 30-day profile', type: 'safe' },
  { t: '14:33:02', event: 'Keystroke rhythm: 98.2% match', type: 'safe' },
  { t: '14:33:45', event: 'Navigation deviation detected — hesitation spike', type: 'warn' },
  { t: '14:34:10', event: 'New beneficiary addition — risk flagged', type: 'warn' },
  { t: '14:34:22', event: 'Transaction amount: 3.4× normal — escalation triggered', type: 'danger' },
  { t: '14:34:28', event: 'Step-up biometric auth requested', type: 'info' },
  { t: '14:34:35', event: 'Emotional stress signal — urgency behavior detected', type: 'danger' },
  { t: '14:34:40', event: 'Silent SOC alert raised — account hold initiated', type: 'danger' },
]

export default function SessionMonitorPage() {
  const [selectedIdx, setSelectedIdx] = useState(0)
  const [scores, setScores] = useState([94, 58, 23, 87, 71])
  const [radarData, setRadarData] = useState(() => makeRadarData(58))

  useEffect(() => {
    const t = setInterval(() => {
      setScores(prev => prev.map(s => Math.min(99, Math.max(10, Math.round(s + (Math.random() - 0.45) * 3)))))
    }, 1500)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    setRadarData(makeRadarData(scores[selectedIdx]))
    const t = setInterval(() => setRadarData(makeRadarData(scores[selectedIdx])), 2000)
    return () => clearInterval(t)
  }, [selectedIdx, scores])

  const score = scores[selectedIdx]
  const scoreColor = score >= 80 ? '#00FF88' : score >= 60 ? '#FF9F00' : '#FF3366'
  const status = score >= 80 ? 'SECURE' : score >= 60 ? 'CAUTION' : 'CRITICAL'

  return (
    <div className="pt-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-2xl font-700 text-text-primary">Session Monitor</h1>
            <p className="text-text-secondary text-sm mt-0.5">Deep-dive into individual session behavioral analysis</p>
          </div>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-trust animate-pulse-slow" />
            <span className="font-mono text-xs text-trust">5 ACTIVE SESSIONS</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          <div className="p-4 rounded-2xl border border-border bg-panel/60 backdrop-blur-sm">
            <h2 className="font-display font-600 text-text-primary mb-4 text-sm">Sessions</h2>
            <div className="flex flex-col gap-2">
              {SESSION_IDS.map((id, i) => {
                const s = scores[i]
                const c = s >= 80 ? { dot: '#00FF88', ring: 'border-safe/30 bg-safe/5', text: 'text-safe' }
                  : s >= 60 ? { dot: '#FF9F00', ring: 'border-warn/30 bg-warn/5', text: 'text-warn' }
                  : { dot: '#FF3366', ring: 'border-danger/30 bg-danger/5', text: 'text-danger' }
                const isSelected = selectedIdx === i
                return (
                  <button
                    key={id}
                    onClick={() => setSelectedIdx(i)}
                    className={`w-full text-left p-3 rounded-xl border transition-all duration-200
                      ${isSelected ? `${c.ring} border-opacity-80` : 'border-border hover:border-muted'}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: c.dot, boxShadow: isSelected ? `0 0 8px ${c.dot}` : 'none' }} />
                        <span className="font-mono text-xs text-text-primary">{id}</span>
                      </div>
                      <span className={`font-mono text-sm font-700 ${c.text}`}>{s}</span>
                    </div>
                    <div className="text-[10px] text-text-dim mt-1 ml-4">{CHANNELS[i % CHANNELS.length]}</div>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="lg:col-span-3 flex flex-col gap-6">
            <div className="p-5 rounded-2xl border border-border bg-panel/60 backdrop-blur-sm">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-6 flex-wrap">
                  <div className="flex items-center gap-2 text-xs text-text-secondary">
                    <Smartphone className="w-3.5 h-3.5" />
                    <span className="font-mono">{CHANNELS[selectedIdx % CHANNELS.length]}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-text-secondary">
                    <MapPin className="w-3.5 h-3.5" />
                    <span className="font-mono">{LOCATIONS[selectedIdx]}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-text-secondary">
                    <Clock className="w-3.5 h-3.5" />
                    <span className="font-mono">Session: 00:04:12</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-text-secondary">
                    <Wifi className="w-3.5 h-3.5" />
                    <span className="font-mono">AES-256 Encrypted</span>
                  </div>
                </div>
                <div
                  className="px-4 py-1.5 rounded-full border font-mono text-sm font-700 transition-all"
                  style={{ borderColor: scoreColor + '40', backgroundColor: scoreColor + '10', color: scoreColor }}
                >
                  {status}
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl border border-border bg-panel/60 backdrop-blur-sm flex flex-col items-center justify-center">
                <h3 className="font-display font-600 text-text-primary mb-4 self-start">Session Trust Score</h3>
                <TrustScoreRing score={score} size={160} />
                <div className="mt-4 w-full">
                  <div className="flex justify-between text-xs font-mono text-text-dim mb-1">
                    <span>Trust Level</span>
                    <span style={{ color: scoreColor }}>{score}/100</span>
                  </div>
                  <div className="h-2 bg-muted/40 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${score}%`, backgroundColor: scoreColor, boxShadow: `0 0 10px ${scoreColor}60` }} />
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-2xl border border-border bg-panel/60 backdrop-blur-sm">
                <h3 className="font-display font-600 text-text-primary mb-2">Agent Vector Analysis</h3>
                <p className="text-xs text-text-dim mb-2">Real-time multi-agent breakdown</p>
                <ResponsiveContainer width="100%" height={220}>
                  <RadarChart data={radarData} margin={{ top: 10, right: 20, left: 20, bottom: 10 }}>
                    <PolarGrid stroke="#0F1E30" />
                    <PolarAngleAxis dataKey="axis" tick={{ fill: '#7A9BB5', fontSize: 10, fontFamily: 'JetBrains Mono' }} />
                    <Radar dataKey="value" stroke={scoreColor} fill={scoreColor} fillOpacity={0.12} strokeWidth={2} />
                    <Tooltip
                      contentStyle={{ background: '#080D14', border: '1px solid #0F1E30', borderRadius: 8, fontFamily: 'JetBrains Mono', fontSize: 11 }}
                      labelStyle={{ color: '#7A9BB5' }}
                      itemStyle={{ color: scoreColor }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-border bg-panel/60 backdrop-blur-sm">
              <h3 className="font-display font-600 text-text-primary mb-4">Session Event Log</h3>
              <div className="space-y-2 max-h-56 overflow-y-auto pr-2">
                {EVENT_LOG.map((e, i) => {
                  const Icon = e.type === 'safe' ? CheckCircle : e.type === 'warn' ? AlertTriangle : e.type === 'danger' ? XCircle : Shield
                  const c = e.type === 'safe' ? 'text-safe' : e.type === 'warn' ? 'text-warn' : e.type === 'danger' ? 'text-danger' : 'text-trust'
                  return (
                    <div key={i} className="flex items-start gap-3 py-1.5 border-b border-border/50 last:border-0">
                      <Icon className={`w-3.5 h-3.5 ${c} mt-0.5 flex-shrink-0`} />
                      <span className="font-mono text-[10px] text-text-dim w-16 flex-shrink-0">{e.t}</span>
                      <span className="text-xs text-text-secondary leading-snug">{e.event}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
