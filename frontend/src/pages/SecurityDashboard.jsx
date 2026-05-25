import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useAllSessions } from '../hooks/useAllSessions'
import { useAlerts } from '../hooks/useAlerts'
import { useTrustScore } from '../hooks/useTrustScore'
import Navbar from '../components/common/Navbar'
import TrustGauge from '../components/dashboard/TrustGauge'
import AgentScoreBars from '../components/dashboard/AgentScoreBars'
import ScoreTimeline from '../components/dashboard/ScoreTimeline'
import SessionList from '../components/dashboard/SessionList'
import AlertPanel from '../components/dashboard/AlertPanel'
import { MOCK_AGENT_SCORES } from '../mock/mockData'
import { Activity, Users, AlertTriangle, Shield, Wifi } from 'lucide-react'

const ANALYST_LINKS = [
  { to:'/dashboard', label:'Dashboard' },
  { to:'/monitor',   label:'Session Monitor' },
  { to:'/alerts',    label:'Alerts Center' },
]
const ADMIN_LINKS = [
  ...ANALYST_LINKS,
  { to:'/admin', label:'Admin' },
]

export default function SecurityDashboard() {
  const { user } = useAuth()
  const { sessions } = useAllSessions()
  const { alerts, resolveAlert } = useAlerts()
  const { score, agents, history } = useTrustScore('system')
  const navigate = useNavigate()

  const active   = sessions.length
  const threats  = alerts.filter(a => !a.resolved && (a.severity==='CRITICAL'||a.severity==='HIGH')).length
  const avgScore = Math.round(sessions.reduce((s,x)=>s+x.score,0)/sessions.length)
  const frozen   = sessions.filter(s=>s.action==='FREEZE').length

  const links = user?.role === 'admin' ? ADMIN_LINKS : ANALYST_LINKS

  return (
    <div style={{ minHeight:'100vh', background:'#050A14' }}>
      <Navbar links={links} />
      <div style={{ maxWidth:1280, margin:'0 auto', padding:'28px 24px' }}>
        {/* Header */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:28 }}>
          <div>
            <h1 style={{ fontFamily:'Sora', fontSize:24, fontWeight:800, color:'#fff', margin:0 }}>
              Security Operations Center
            </h1>
            <p style={{ color:'#64748b', fontSize:14, margin:'4px 0 0' }}>
              Real-time behavioral intelligence · {active} active sessions
            </p>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:8, padding:'6px 14px',
            background:'rgba(0,255,135,0.08)', border:'1px solid rgba(0,255,135,0.2)', borderRadius:20 }}>
            <Wifi size={12} color="#00FF87" />
            <span style={{ fontSize:12, color:'#00FF87', fontFamily:'JetBrains Mono' }}>LIVE</span>
          </div>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, marginBottom:24 }}>
          {[
            { label:'Active Sessions',   value: active,   icon: Users,         color:'#00D4FF', sub:'Across all channels' },
            { label:'Active Threats',    value: threats,  icon: AlertTriangle, color:'#FF3B5C', sub:'Critical + High' },
            { label:'Avg Trust Score',   value: avgScore, icon: Shield,        color:'#00FF87', sub:'System-wide' },
            { label:'Frozen Sessions',   value: frozen,   icon: Activity,      color:'#FFB800', sub:'Pending verification' },
          ].map(s => (
            <div key={s.label} className="glass stat-card" style={{ borderRadius:16, padding:'18px 20px' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
                <div style={{ width:36, height:36, borderRadius:10, display:'flex', alignItems:'center',
                  justifyContent:'center', background: s.color+'18', border:`1px solid ${s.color}28` }}>
                  <s.icon size={18} color={s.color} />
                </div>
              </div>
              <div style={{ fontFamily:'Sora', fontSize:32, fontWeight:800, color:'#fff',
                textShadow:`0 0 20px ${s.color}44`, marginBottom:2 }}>{s.value}</div>
              <div style={{ fontSize:13, color:'#94a3b8' }}>{s.label}</div>
              <div style={{ fontSize:11, color:'#475569', fontFamily:'JetBrains Mono', marginTop:2 }}>{s.sub}</div>
            </div>
          ))}
        </div>

        
        <div style={{ display:'grid', gridTemplateColumns:'200px 1fr 320px', gap:20, marginBottom:20 }}>
          
          <div className="glass" style={{ borderRadius:16, padding:24, display:'flex', flexDirection:'column',
            alignItems:'center', justifyContent:'center' }}>
            <p style={{ fontSize:11, color:'#64748b', fontFamily:'JetBrains Mono', textTransform:'uppercase',
              letterSpacing:1, marginBottom:16 }}>System Trust</p>
            <TrustGauge score={avgScore} size={160} />
          </div>
        
          <div className="glass" style={{ borderRadius:16, padding:20 }}>
            <p style={{ fontSize:13, fontWeight:600, color:'#e2e8f0', marginBottom:16 }}>Trust Score History</p>
            <ScoreTimeline history={history} />
          </div>
          
          <div className="glass" style={{ borderRadius:16, padding:20 }}>
            <p style={{ fontSize:13, fontWeight:600, color:'#e2e8f0', marginBottom:16 }}>AI Security Agents</p>
            <AgentScoreBars agentScores={MOCK_AGENT_SCORES} />
          </div>
        </div>

  =
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
          <div className="glass" style={{ borderRadius:16, padding:20 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
              <p style={{ fontSize:13, fontWeight:600, color:'#e2e8f0' }}>Active Sessions</p>
              <button onClick={() => navigate('/monitor')} className="btn-ghost"
                style={{ fontSize:11, padding:'4px 12px' }}>Monitor All</button>
            </div>
            <SessionList sessions={sessions} onSelect={s => navigate('/monitor?session=' + s.id)} />
          </div>
          <div className="glass" style={{ borderRadius:16, padding:20 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
              <p style={{ fontSize:13, fontWeight:600, color:'#e2e8f0' }}>Recent Alerts</p>
              <button onClick={() => navigate('/alerts')} className="btn-ghost"
                style={{ fontSize:11, padding:'4px 12px' }}>All Alerts</button>
            </div>
            <AlertPanel alerts={alerts.slice(0,4)} onResolve={resolveAlert} />
          </div>
        </div>
      </div>
    </div>
  )
}