import { useNavigate } from 'react-router-dom'
import StatusBadge from '../common/StatusBadge'
import { scoreColor } from '../../utils/scoreColors'
export default function SessionList({ sessions, onSelect }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
      {sessions.map(s => {
        const color = scoreColor(s.score)
        return (
          <div key={s.id} onClick={() => onSelect?.(s)}
            style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 16px',
              background:'rgba(15,32,64,0.4)', borderRadius:12, cursor:'pointer',
              border:'1px solid rgba(0,212,255,0.06)', transition:'all 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.borderColor='rgba(0,212,255,0.2)'}
            onMouseLeave={e => e.currentTarget.style.borderColor='rgba(0,212,255,0.06)'}>
            <div style={{ width:36, height:36, borderRadius:8, display:'flex', alignItems:'center',
              justifyContent:'center', fontFamily:'JetBrains Mono', fontSize:11, fontWeight:700,
              background: color + '18', color, border: `1px solid ${color}30` }}>
              {Math.round(s.score)}
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:13, fontWeight:600, color:'#e2e8f0', fontFamily:'JetBrains Mono' }}>{s.id}</div>
              <div style={{ fontSize:11, color:'#64748b' }}>{s.channel} · {s.city}</div>
            </div>
            <StatusBadge action={s.action} small />
          </div>
        )
      })}
    </div>
  )
}