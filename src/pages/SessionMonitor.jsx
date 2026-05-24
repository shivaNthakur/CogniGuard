import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useAllSessions } from '../hooks/useAllSessions'
import Navbar from '../components/common/Navbar'
import TrustGauge from '../components/dashboard/TrustGauge'
import AgentScoreBars from '../components/dashboard/AgentScoreBars'
import EventFeed from '../components/dashboard/EventFeed'
import ShapCards from '../components/dashboard/ShapCards'
import StatusBadge from '../components/common/StatusBadge'
import { scoreColor } from '../utils/scoreColors'
import { MapPin, Monitor, Clock, Lock } from 'lucide-react'

const ANALYST_LINKS = [
  { to:'/dashboard', label:'Dashboard' },
  { to:'/monitor',   label:'Session Monitor' },
  { to:'/alerts',    label:'Alerts Center' },
]
const ADMIN_LINKS = [...ANALYST_LINKS, { to:'/admin', label:'Admin' }]

const SHAP_FACTORS = [
  { factor:'New beneficiary — 4.1x amount deviation', impact:'+24.1 risk', agent:'financial' },
  { factor:'Multiple coercion signals detected',      impact:'+22.8 risk', agent:'coercion'  },
  { factor:'After-hours transaction pattern',         impact:'+16.7 risk', agent:'coercion'  },
]

export default function SessionMonitor() {
  const { user } = useAuth()
  const { sessions } = useAllSessions()
  const location = useLocation()
  const params = new URLSearchParams(location.search)
  const defaultId = params.get('session') || sessions[0]?.id

  const [selectedId, setSelectedId] = useState(defaultId)
  const selected = sessions.find(s => s.id === selectedId) || sessions[0]
  const links = user?.role === 'admin' ? ADMIN_LINKS : ANALYST_LINKS

  return (
    <div style={{ minHeight:'100vh', background:'#050A14' }}>
      <Navbar links={links} />
      <div style={{ display:'grid', gridTemplateColumns:'260px 1fr', height:'calc(100vh - 60px)' }}>
        {/* Left sidebar — session list */}
        <div style={{ borderRight:'1px solid rgba(0,212,255,0.07)', padding:16, overflowY:'auto',
          background:'rgba(5,10,20,0.6)' }}>
          <p style={{ fontSize:11, color:'#64748b', fontFamily:'JetBrains Mono', textTransform:'uppercase',
            letterSpacing:1.5, marginBottom:12 }}>Active Sessions ({sessions.length})</p>
          {sessions.map(s => {
            const color = scoreColor(s.score)
            const isActive = s.id === selectedId
            return (
              <div key={s.id} onClick={() => setSelectedId(s.id)}
                style={{ padding:'12px 14px', borderRadius:12, marginBottom:6, cursor:'pointer',
                  background: isActive ? 'rgba(0,212,255,0.08)' : 'rgba(15,32,64,0.3)',
                  border: isActive ? '1px solid rgba(0,212,255,0.25)' : '1px solid rgba(255,255,255,0.04)',
                  transition:'all 0.2s' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:4 }}>
                  <span style={{ fontFamily:'JetBrains Mono', fontSize:12, fontWeight:700, color: isActive ? '#00D4FF' : '#94a3b8' }}>{s.id}</span>
                  <span style={{ fontFamily:'JetBrains Mono', fontSize:13, fontWeight:700, color }}>{Math.round(s.score)}</span>
                </div>
                <div style={{ fontSize:11, color:'#475569' }}>{s.channel}</div>
                <div style={{ fontSize:11, color:'#475569' }}>{s.city}</div>
                <div style={{ marginTop:6 }}><StatusBadge action={s.action} small /></div>
              </div>
            )
          })}
        </div>

       
        {selected && (
          <div style={{ overflowY:'auto', padding:24 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:24 }}>
              <div>
                <h2 style={{ fontFamily:'Sora', fontSize:20, fontWeight:700, color:'#fff', margin:'0 0 4px' }}>
                  Session: {selected.id}
                </h2>
                <div style={{ display:'flex', gap:16 }}>
                  {[
                    [Monitor, selected.channel],
                    [MapPin,  selected.city],
                    [Clock,   '14m 22s active'],
                    [Lock,    'AES-256'],
                  ].map(([Icon, val], i) => (
                    <div key={i} style={{ display:'flex', alignItems:'center', gap:4 }}>
                      <Icon size={12} color="#64748b" />
                      <span style={{ fontSize:12, color:'#64748b' }}>{val}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ display:'flex', gap:10, alignItems:'center' }}>
                <StatusBadge action={selected.action} />
                <button className="btn-danger" style={{ padding:'8px 16px', fontSize:13 }}
                  onClick={() => alert('Freeze session — connect to backend')}>
                  Freeze Session
                </button>
              </div>
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'180px 1fr 1fr', gap:20, marginBottom:20 }}>
              <div className="glass" style={{ borderRadius:16, padding:20, display:'flex',
                flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
                <TrustGauge score={Math.round(selected.score)} size={150} />
              </div>
              <div className="glass" style={{ borderRadius:16, padding:20 }}>
                <p style={{ fontSize:13, fontWeight:600, color:'#e2e8f0', marginBottom:16 }}>Agent Vector Analysis</p>
                <AgentScoreBars agentScores={selected.agent_scores} />
              </div>
              <div className="glass" style={{ borderRadius:16, padding:20 }}>
                <p style={{ fontSize:13, fontWeight:600, color:'#e2e8f0', marginBottom:16 }}>Risk Factors (SHAP)</p>
                {selected.score < 70
                  ? <ShapCards factors={SHAP_FACTORS} />
                  : <p style={{ fontSize:13, color:'#475569', marginTop:8 }}>No significant risk factors detected for this session.</p>
                }
              </div>
            </div>

            <div className="glass" style={{ borderRadius:16, padding:20 }}>
              <p style={{ fontSize:13, fontWeight:600, color:'#e2e8f0', marginBottom:16 }}>Session Event Log</p>
              <EventFeed />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}