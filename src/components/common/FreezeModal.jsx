import { AlertTriangle, Phone } from 'lucide-react'
export default function FreezeModal({ explanation = [], onVerify }) {
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(10,0,5,0.97)',
      display:'flex', alignItems:'center', justifyContent:'center', zIndex:9999, padding:24 }}>
      <div style={{ background:'#0D0A0A', border:'2px solid #FF3B5C', borderRadius:20,
        padding:40, maxWidth:440, width:'100%', boxShadow:'0 0 60px rgba(255,59,92,0.3)' }}>
        <div style={{ textAlign:'center', marginBottom:24 }}>
          <div style={{ display:'inline-flex', alignItems:'center', justifyContent:'center',
            width:64, height:64, borderRadius:'50%', background:'rgba(255,59,92,0.12)',
            border:'2px solid rgba(255,59,92,0.4)', marginBottom:16 }}>
            <AlertTriangle size={32} color="#FF3B5C" />
          </div>
          <h2 style={{ color:'#FF3B5C', fontSize:22, fontWeight:700, fontFamily:'Sora', marginBottom:8 }}>
            Session Suspended
          </h2>
          <p style={{ color:'#94a3b8', fontSize:14 }}>
            Unusual activity detected. Your session has been paused for your security.
          </p>
        </div>

        {explanation.length > 0 && (
          <div style={{ background:'rgba(255,59,92,0.07)', border:'1px solid rgba(255,59,92,0.2)',
            borderRadius:12, padding:16, marginBottom:20 }}>
            <p style={{ color:'#FF3B5C', fontSize:11, fontFamily:'JetBrains Mono', marginBottom:8, textTransform:'uppercase', letterSpacing:1 }}>
              Detection Reasons
            </p>
            {explanation.map((e, i) => (
              <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'4px 0',
                borderBottom: i < explanation.length-1 ? '1px solid rgba(255,59,92,0.1)' : 'none' }}>
                <span style={{ color:'#cbd5e1', fontSize:12 }}>{e.factor}</span>
                <span style={{ color:'#FF3B5C', fontSize:12, fontFamily:'JetBrains Mono', marginLeft:8 }}>{e.impact}</span>
              </div>
            ))}
          </div>
        )}

        {explanation.length === 0 && (
          <div style={{ background:'rgba(255,59,92,0.07)', border:'1px solid rgba(255,59,92,0.2)',
            borderRadius:12, padding:16, marginBottom:20 }}>
            <p style={{ color:'#94a3b8', fontSize:13 }}>
              Our AI system detected unusual behavioral patterns in your session. This is a precautionary measure to protect your account.
            </p>
          </div>
        )}

        <button onClick={onVerify} className="btn-danger" style={{ width:'100%', marginBottom:16 }}>
          Verify My Identity
        </button>
        <div style={{ textAlign:'center', display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
          <Phone size={12} color="#64748b" />
          <p style={{ color:'#64748b', fontSize:12 }}>Contact your bank: 1800-XXX-XXXX</p>
        </div>
      </div>
    </div>
  )
}