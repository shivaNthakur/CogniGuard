import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useAlerts } from '../hooks/useAlerts'
import Navbar from '../components/common/Navbar'
import { severityColor, severityClass } from '../utils/scoreColors'
import { AlertCircle, AlertTriangle, Info, CheckCircle, Search } from 'lucide-react'

const ANALYST_LINKS = [
  { to:'/dashboard', label:'Dashboard' },
  { to:'/monitor',   label:'Session Monitor' },
  { to:'/alerts',    label:'Alerts Center' },
]
const ADMIN_LINKS = [...ANALYST_LINKS, { to:'/admin', label:'Admin' }]

const SEV_ICONS = { CRITICAL: AlertCircle, HIGH: AlertTriangle, MEDIUM: Info, LOW: CheckCircle }

const FILTERS = ['All','CRITICAL','HIGH','MEDIUM','LOW','Resolved']

export default function AlertsCenter() {
  const { user } = useAuth()
  const { alerts, resolveAlert } = useAlerts()
  const [filter,  setFilter]  = useState('All')
  const [search,  setSearch]  = useState('')
  const links = user?.role === 'admin' ? ADMIN_LINKS : ANALYST_LINKS

  const filtered = alerts.filter(a => {
    if (filter === 'Resolved') return a.resolved
    if (filter !== 'All' && a.severity !== filter) return false
    if (a.resolved && filter !== 'Resolved') return false
    if (search && !JSON.stringify(a).toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const counts = {
    CRITICAL: alerts.filter(a=>a.severity==='CRITICAL'&&!a.resolved).length,
    HIGH:     alerts.filter(a=>a.severity==='HIGH'&&!a.resolved).length,
    MEDIUM:   alerts.filter(a=>a.severity==='MEDIUM'&&!a.resolved).length,
    resolved: alerts.filter(a=>a.resolved).length,
  }

  return (
    <div style={{ minHeight:'100vh', background:'#050A14' }}>
      <Navbar links={links} />
      <div style={{ maxWidth:1100, margin:'0 auto', padding:'28px 24px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:28 }}>
          <div>
            <h1 style={{ fontFamily:'Sora', fontSize:24, fontWeight:800, color:'#fff', margin:0 }}>Alerts Center</h1>
            <p style={{ color:'#64748b', fontSize:14, margin:'4px 0 0' }}>{alerts.filter(a=>!a.resolved).length} active alerts</p>
          </div>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:24 }}>
          {[
            { label:'Critical', count: counts.CRITICAL, color:'#FF3B5C' },
            { label:'High',     count: counts.HIGH,     color:'#FFB800' },
            { label:'Medium',   count: counts.MEDIUM,   color:'#00D4FF' },
            { label:'Resolved', count: counts.resolved, color:'#00FF87' },
          ].map(c => (
            <div key={c.label} className="glass stat-card" style={{ borderRadius:14, padding:'16px 20px' }}>
              <div style={{ fontFamily:'Sora', fontSize:28, fontWeight:800, color: c.color,
                textShadow:`0 0 16px ${c.color}55`, marginBottom:4 }}>{c.count}</div>
              <div style={{ fontSize:13, color:'#94a3b8' }}>{c.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display:'flex', gap:12, marginBottom:20, flexWrap:'wrap' }}>
          <div style={{ display:'flex', gap:6 }}>
            {FILTERS.map(f => (
              <button key={f} onClick={() => setFilter(f)}
                style={{ padding:'6px 14px', borderRadius:20, border:'none', cursor:'pointer',
                  fontSize:12, fontFamily:'JetBrains Mono', fontWeight:600,
                  background: filter===f ? '#00D4FF' : 'rgba(15,32,64,0.6)',
                  color: filter===f ? '#050A14' : '#64748b',
                  transition:'all 0.2s' }}>{f}</button>
            ))}
          </div>
          <div style={{ position:'relative', marginLeft:'auto', minWidth:200 }}>
            <Search size={14} color="#64748b" style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)' }} />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search alerts..."
              className="input-field" style={{ paddingLeft:34, paddingTop:8, paddingBottom:8, fontSize:13 }} />
          </div>
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {filtered.length === 0 && (
            <div style={{ textAlign:'center', padding:48, color:'#475569', fontSize:14 }}>
              No alerts match the current filter.
            </div>
          )}
          {filtered.map(a => {
            const color = severityColor(a.severity)
            const Icon  = SEV_ICONS[a.severity] || Info
            return (
              <div key={a.id} className={severityClass(a.severity)}
                style={{ borderRadius:14, padding:'16px 20px' }}>
                <div style={{ display:'flex', alignItems:'flex-start', gap:14 }}>
                  <Icon size={20} color={color} style={{ flexShrink:0, marginTop:2 }} />
                  <div style={{ flex:1 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:6, flexWrap:'wrap' }}>
                      <span style={{ fontSize:11, fontFamily:'JetBrains Mono', fontWeight:700, padding:'2px 10px',
                        borderRadius:20, color, background: color+'18', border:`1px solid ${color}33` }}>{a.severity}</span>
                      <h3 style={{ fontSize:15, fontWeight:700, color:'#e2e8f0', margin:0 }}>{a.title}</h3>
                      {a.resolved && <span style={{ fontSize:11, color:'#00FF87', padding:'2px 10px', borderRadius:20,
                        background:'rgba(0,255,135,0.1)', border:'1px solid rgba(0,255,135,0.25)' }}>Resolved</span>}
                    </div>
                    <p style={{ fontSize:13, color:'#94a3b8', marginBottom:8 }}>{a.description}</p>
                    <div style={{ display:'flex', gap:16, flexWrap:'wrap' }}>
                      {[
                        ['Session', a.session_id],
                        ['Agent',   a.agent],
                        ['Action',  a.action_taken],
                        ['Score',   a.trust_score],
                        ['Time',    a.triggered_at],
                      ].map(([k,v]) => (
                        <span key={k} style={{ fontSize:11, color:'#475569', fontFamily:'JetBrains Mono' }}>
                          {k}: <span style={{ color:'#94a3b8' }}>{v}</span>
                        </span>
                      ))}
                    </div>
                    {a.top_factors?.length > 0 && (
                      <div style={{ marginTop:12, display:'flex', flexDirection:'column', gap:4 }}>
                        {a.top_factors.map((f,i) => (
                          <div key={i} style={{ display:'flex', justifyContent:'space-between',
                            padding:'6px 12px', background:'rgba(0,0,0,0.2)', borderRadius:8 }}>
                            <span style={{ fontSize:12, color:'#94a3b8' }}>{f.factor}</span>
                            <span style={{ fontSize:12, color:'#FF3B5C', fontFamily:'JetBrains Mono', fontWeight:700 }}>{f.impact}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div style={{ display:'flex', flexDirection:'column', gap:8, flexShrink:0 }}>
                    {!a.resolved && (
                      <button onClick={() => resolveAlert(a.id)} className="btn-ghost"
                        style={{ fontSize:12, padding:'6px 14px' }}>Resolve</button>
                    )}
                    <button className="btn-ghost"
                      style={{ fontSize:12, padding:'6px 14px', borderColor:'rgba(255,59,92,0.3)', color:'#FF3B5C' }}
                      onClick={() => alert('Freeze session — connect backend')}>Freeze</button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}