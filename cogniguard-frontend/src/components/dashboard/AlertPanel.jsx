import { severityColor, severityClass } from '../../utils/scoreColors'
export default function AlertPanel({ alerts, onResolve }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
      {alerts.map(a => {
        const color = severityColor(a.severity)
        return (
          <div key={a.id} className={severityClass(a.severity)}
            style={{ borderRadius:10, padding:'12px 16px' }}>
            <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:8 }}>
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                  <span style={{ fontSize:11, fontFamily:'JetBrains Mono', padding:'2px 8px', borderRadius:20,
                    color, background: color+'18', border:`1px solid ${color}33` }}>{a.severity}</span>
                  <span style={{ fontSize:13, fontWeight:600, color:'#e2e8f0' }}>{a.title}</span>
                </div>
                <p style={{ fontSize:12, color:'#94a3b8', marginBottom:4 }}>{a.description}</p>
                <div style={{ fontSize:11, color:'#475569', fontFamily:'JetBrains Mono' }}>
                  {a.session_id} · {a.agent} · {a.triggered_at}
                </div>
              </div>
              {!a.resolved && onResolve && (
                <button onClick={() => onResolve(a.id)} className="btn-ghost"
                  style={{ padding:'4px 12px', fontSize:11, whiteSpace:'nowrap', flexShrink:0 }}>
                  Resolve
                </button>
              )}
              {a.resolved && (
                <span style={{ fontSize:11, color:'#00FF87', padding:'4px 10px', borderRadius:20,
                  background:'rgba(0,255,135,0.1)', border:'1px solid rgba(0,255,135,0.3)' }}>Resolved</span>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}